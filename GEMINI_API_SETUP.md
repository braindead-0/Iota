# Gemini API Setup - Quick Start

## Getting Your Free API Key (2 minutes)

### Step 1: Create API Key
1. Go to: **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account (use: kishanbs725@gmail.com)
3. Click **"Create API Key"** button
4. Copy the generated key

### Step 2: Add to Backend Configuration
Open `backend/.env.local` and add:
```
GOOGLE_API_KEY=your-api-key-here
```

Example:
```
GOOGLE_API_KEY=AIzaSyDxIGjI1234567890_abcdefghijklmnop
```

### Step 3: Restart Backend
In your terminal (backend directory):
```
cd backend
python main.py
```

You should see: `✅ Gemini evaluator initialized successfully`

## Pricing & Quotas

✅ **FREE TIER:**
- 60 requests per minute
- 1,500 requests per day
- 100% free (no credit card needed)

🟡 **PAID TIER** (optional):
- Higher rate limits
- Charged only when you exceed free tier
- Uses your $300 Google Cloud credits

## Troubleshooting

**Q: Where do I get the API key?**
A: https://aistudio.google.com/app/apikey (requires Google account)

**Q: Is it free?**
A: Yes! Free tier never charges. Paid tier uses your GCP credits.

**Q: Backend still says "DEMO mode"?**
A: Make sure GOOGLE_API_KEY is in `backend/.env.local` (not .env.example)
Then restart the backend.

**Q: Getting permission errors?**
A: Make sure you're using the right Google account:
- Account: kishanbs725@gmail.com
- Project: iota-backend-sa

## Testing It Works

1. Restart backend: `python backend/main.py`
2. Go to: http://localhost:3000
3. Paste text in the audit box
4. Click "Run Audit"
5. Should see real AI analysis (not demo mode)

If you see "real" analysis with reasoning about the text, it's working! 🎉
