import express from 'express';
import cors from 'cors';
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import firebaseAdmin from 'firebase-admin';

// Use Xvfb display
process.env.DISPLAY = ':0';

// Initialize Firebase Admin
global.serviceAccount = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'serviceAccountKey.json'), 'utf-8')
);
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(global.serviceAccount),
  databaseURL: 'https://caucus-digital-v2-default-rtdb.asia-southeast1.firebasedatabase.app'
});

const app = express();
app.use(cors());

// Serve noVNC client under /vnc
app.use('/vnc', express.static('/noVNC'));

// Proxy WebSocket traffic at /websockify to internal port 8081
const wsProxy = createProxyMiddleware('/websockify', {
  target: 'http://localhost:8081',
  ws: true,
  changeOrigin: true,
  pathRewrite: { '^/websockify': '' }
});
app.use(wsProxy);

// HTTP endpoint to launch Playwright browser
app.get('/launch', async (req, res) => {
  console.log('[launch] request received');
  try {
    const browser = await chromium.launch({ headless: false, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://example.com');
    console.log('[launch] browser launched');
    res.json({ status: 'launched' });
  } catch (err) {
    console.error('[launch] error', err);
    res.status(500).json({ error: err.message });
  }
});

// Create HTTP server with WS upgrade support
const server = http.createServer(app);
server.on('upgrade', wsProxy.upgrade);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));