#!/usr/bin/env bash
# Start X virtual framebuffer
echo "Starting Xvfb"
Xvfb :0 -screen 0 1024x768x16 &
# Start a window manager
echo "Starting fluxbox"
fluxbox &
# Start VNC server
echo "Starting x11vnc"
x11vnc -display :0 -nopw -forever -shared -rfbport 5900 &
# Serve noVNC + API
echo "Starting websockify"
npm start  # Assuming server.js invokes websockify on 8080 and Express API