# VNC Remote Control Service

## Overview
This service runs a headless X11 display with VNC and provides a noVNC web client, plus an Express API to launch a Playwright-controlled browser session.

## Prerequisites
- Google Cloud SDK (`gcloud`) installed and authenticated
- Firebase service account JSON at `server/serviceAccountKey.json`
- Active GCP project set to `caucus-digital-v2` (via `gcloud config set project caucus-digital-v2`)

## Build & Deploy (using Cloud Build)
From the `server/` directory, run:
```bash
# Build, push, and format for amd64 automatically
gcloud builds submit --tag gcr.io/caucus-digital-v2/vnc-server .

# Deploy to Cloud Run
gcloud run deploy vnc-service \
  --image gcr.io/caucus-digital-v2/vnc-server \
  --region australia-southeast1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080