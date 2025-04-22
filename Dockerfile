FROM node:18-bullseye-slim

# Noninteractive and timezone
ENV DEBIAN_FRONTEND=noninteractive TZ=Australia/Melbourne
RUN ln -fs /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install dependencies for Xvfb, VNC, Playwright
RUN apt-get update && apt-get install -y \
    git python3 python3-pip xvfb x11vnc fluxbox websockify dbus-x11 \
    libnss3 libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 \
    libxrandr2 libasound2 libpangocairo-1.0-0 libgtk-3-0 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy and install Node packages
COPY package*.json ./
RUN npm install

# Install Playwright browsers
RUN npx playwright install --with-deps

# Copy server code and scripts
COPY server.js start.sh serviceAccountKey.json ./
RUN chmod +x start.sh

# Clone noVNC client for web UI
RUN git clone https://github.com/novnc/noVNC.git /noVNC

# Expose port 8080 for Express + noVNC
EXPOSE 8080

ENTRYPOINT ["/app/start.sh"]