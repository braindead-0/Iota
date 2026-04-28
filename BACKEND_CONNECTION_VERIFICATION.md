# Backend Connection Verification Checklist

## ✅ Quick Verification Steps

### Step 1: Backend Server
```bash
cd backend
python main.py
```
Wait for: `INFO:     Uvicorn running on http://0.0.0.0:8000`

### Step 2: Health Check
```bash
curl http://localhost:8000/health
```
Expected response:
```json
{
  "status": "ok",
  "firebase": "offline",
  "vertex_ai": "offline"
}
```
✅ If you get this, backend is running!

### Step 3: Frontend Development
In a new terminal:
```bash
cd web-app
npm run dev
```
Open: http://localhost:3000

### Step 4: Test Audit Flow
1. Paste text in the audit box
2. Click "Run Audit"
3. Should see:
   - ✅ Audit results appear (if backend working)
   - ❌ Error message if connection fails (with helpful hint)

## 🔧 Environment Files

### Frontend (.env.local already created)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env.local already created)
No configuration needed for development mode

## 🚀 Production Checklist

Before deploying to production:

- [ ] Deploy backend to server
- [ ] Get backend URL (e.g., https://api.myapp.com)
- [ ] Create `web-app/.env.production.local`:
  ```
  NEXT_PUBLIC_API_URL=https://api.myapp.com
  ```
- [ ] Run: `npm run build`
- [ ] Deploy frontend
- [ ] Test audit flow against production backend
- [ ] Verify error messages (if backend unavailable)

## 📝 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Unable to connect to backend" | Check if backend is running: `curl http://localhost:8000/health` |
| Port 8000 already in use | Kill process: `lsof -i :8000 \| grep LISTEN \| awk '{print $2}' \| xargs kill -9` |
| Backend returns 503 error | Configure Vertex AI credentials (see BACKEND_SETUP.md) |
| Frontend can't find env vars | Make sure you're using `NEXT_PUBLIC_` prefix for env variables |

## 📚 Documentation Files

- `BACKEND_SETUP.md` - Complete setup guide
- `FIXES_SUMMARY.md` - What was fixed
- `.env.example` files - Configuration templates
- `BACKEND_CONNECTION_VERIFICATION.md` - This file!
