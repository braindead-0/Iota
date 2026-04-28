# Backend Connection Setup Guide

## Quick Start

### 1. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Start the Backend Server
```bash
cd backend
python main.py
```

The backend will start at `http://localhost:8000`

### 3. Configure Frontend
The frontend is already configured to connect to `http://localhost:8000` via the `.env.local` file.

If you need to change the backend URL:
- Edit `web-app/.env.local`
- Change `NEXT_PUBLIC_API_URL` to your backend URL

### 4. Check Backend Health
The backend includes a health check endpoint:
```bash
curl http://localhost:8000/health
```

You should see:
```json
{
  "status": "ok",
  "firebase": "connected" or "offline",
  "vertex_ai": "connected" or "offline"
}
```

## Production Deployment

### Setting Backend URL for Production
1. Create `web-app/.env.production.local`
2. Add: `NEXT_PUBLIC_API_URL=https://your-backend-url.com`
3. Build: `npm run build`

### Backend Deployment
The backend requires:
- **Python 3.9+**
- **Google Cloud Credentials** (for Vertex AI)
- **Firebase Admin Credentials** (optional, uses mock tokens in dev)

For Vertex AI to work, set up Google Cloud authentication:
```bash
gcloud auth application-default login
```

Or set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable:
```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

## Troubleshooting

### Error: "Unable to connect to backend"
1. Check if backend is running: `http://localhost:8000/health`
2. Verify `NEXT_PUBLIC_API_URL` in `web-app/.env.local`
3. Check for CORS issues in browser console

### Error: "Vertex AI Error" or "Mock reasoning"
The backend is running in **demo mode** because:
- Google Cloud credentials are not configured
- Vertex AI SDK initialization failed

To enable full AI analysis, configure GCP credentials (see above).

### Port 8000 Already in Use
```bash
# Find and kill the process
lsof -i :8000
kill -9 <PID>
```

Or use a different port:
```bash
# Modify backend/main.py to use a different port
# Then update NEXT_PUBLIC_API_URL accordingly
```

## Architecture

- **Frontend**: Next.js (port 3000)
- **Backend**: FastAPI (port 8000)
- **Database**: Firestore (optional, backend saves results)
- **AI Service**: Google Vertex AI Gemini API

The frontend and backend communicate via HTTP REST API with Bearer token authentication.
