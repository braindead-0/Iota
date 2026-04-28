from fastapi import FastAPI, HTTPException, Depends, Header
import os
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional, Any
import uuid
import random
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials, auth, firestore
try:
    from dotenv import load_dotenv
    # Load environment variables
    load_dotenv(override=True)
    env_path = Path(__file__).parent / ".env.local"
    if env_path.exists():
        print(f"Loading env from: {env_path}")
        load_dotenv(env_path, override=True)
        print(f"File exists: {env_path.exists()}")
    else:
        print(f"Env file not found: {env_path}")
    api_key_check = os.getenv("GOOGLE_API_KEY")
    print(f"GOOGLE_API_KEY loaded: {'YES' if api_key_check else 'NO'}")
    if api_key_check:
        print(f"API Key preview: {api_key_check[:10]}...{api_key_check[-10:]}")
except ImportError:
    pass  # python-dotenv not installed, skip
except Exception as e:
    print(f"Error loading .env: {e}")

# Import our Gemini evaluator
from gemini_evaluator import GeminiEvaluator

app = FastAPI(title="IOTA Audit Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase
SERVICE_ACCOUNT_KEY = "serviceAccountKey.json"
PROJECT_ID = "iota-backend-sa"

try:
    if os.path.exists(SERVICE_ACCOUNT_KEY):
        cred = credentials.Certificate(SERVICE_ACCOUNT_KEY)
        firebase_admin.initialize_app(cred)
        print(f"Firebase initialized with service account: {SERVICE_ACCOUNT_KEY}")
    else:
        firebase_admin.initialize_app()
        print("Firebase initialized with Application Default Credentials")
    db = firestore.client()
except Exception as e:
    print(f"Firebase initialization failed: {e}")
    db = None

# Initialize Gemini Evaluator
evaluator = None
try:
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("\n" + "="*60)
        print("GOOGLE_API_KEY not found in environment")
        print("="*60)
        print("\nTo enable AI analysis, get your API key:")
        print("1. Go to: https://aistudio.google.com/app/apikey")
        print("2. Click 'Create API Key'")
        print("3. Add to backend/.env.local:")
        print("   GOOGLE_API_KEY=your-key-here")
        print("4. Restart the backend")
        print("\nRunning in DEMO mode without full AI analysis.")
        print("="*60 + "\n")
    else:
        evaluator = GeminiEvaluator(api_key=api_key)
        print("Gemini evaluator initialized successfully\n")
except Exception as e:
    print(f"Gemini initialization failed: {e}")
    print("Falling back to demo mode.\n")

class AuditRequest(BaseModel):
    text: str
    domain: Optional[str] = "Web UI"

class AuditResponse(BaseModel):
    id: str
    prompt: str
    original_text: str  # Alias for prompt — used by History.tsx
    score: int
    bias_identified: List[str]
    fairness_alternative: Optional[str]
    reasoning: str
    analytics_heat: List[int]
    domain: str
    risk_gradient: float
    bias_category: str
    bias_vectors: Optional[dict] = None
    model_used: Optional[str] = "Gemini"

def verify_firebase_token(authorization: str = Header(None)):
    """Extracts and verifies the Bearer token."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    
    token = authorization.split("Bearer ")[1]
    
    # In a development boilerplate without real firebase certs, we mock success
    if token == "MOCK_DEVELOPMENT_TOKEN":
        return {"uid": "mock-user-id"}
        
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid authentication credentials: {str(e)}")

# In-memory storage fallback for local UI testing
audit_history: List[AuditResponse] = []

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring backend status."""
    return {
        "status": "ok",
        "firebase": "connected" if db else "offline",
        "vertex_ai": "connected" if evaluator else "offline"
    }

@app.post("/scan", response_model=AuditResponse)
async def audit_text(request: AuditRequest, user: dict = Depends(verify_firebase_token)):
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text field cannot be empty")
    
    text = request.text.strip()
    domain = request.domain or "Web UI"
    
    # Generate Heatmap Analytics (simulated processing weights for the Grid UI)
    analytics_heat = [random.randint(0, 100) for _ in range(5)]
    
    # Call Gemini API for analysis
    if evaluator:
        try:
            print(f"\nAnalyzing text for domain: {domain}")
            gemini_result = evaluator.scan_text(text, domain)
            score = int(gemini_result.get("score", 0))
            bias_identified = gemini_result.get("bias_identified", [])
            fairness_alternative = gemini_result.get("fairness_alternative", "")
            reasoning = gemini_result.get("reasoning", "No reasoning provided.")
            risk_gradient = float(gemini_result.get("risk_gradient", 0.0))
            bias_category = gemini_result.get("bias_category", "None")
            bias_vectors = gemini_result.get("bias_vectors", {})
            print(f"Analysis complete: Score {score}, Risk {risk_gradient}")
            model_used = evaluator.model_name
        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            raise HTTPException(
                status_code=503,
                detail=f"AI analysis failed: {str(e)}. Please check your GOOGLE_API_KEY."
            )
    else:
        # Fallback demo mode
        print("Using DEMO mode - Gemini API not configured")
        print("To enable real AI analysis:")
        print("   1. Get API key from https://aistudio.google.com/app/apikey")
        print("   2. Add GOOGLE_API_KEY to backend/.env.local")
        print("   3. Restart backend\n")
        
        score = random.randint(50, 85)
        bias_identified = ["Note: Demo mode - configure Gemini API for real analysis"]
        fairness_alternative = "Demo: This is simulated analysis in demo mode."
        reasoning = "System is running in demo mode. Real AI analysis is not available. Configure GOOGLE_API_KEY to enable it."
        risk_gradient = round(random.uniform(0.3, 0.7), 2)
        bias_category = random.choice(["Subtle", "Structural", "None"])
        bias_vectors = {
            "Gender": round(random.uniform(0, 0.3), 2),
            "Racial": round(random.uniform(0, 0.3), 2),
            "Age": round(random.uniform(0, 0.3), 2),
            "Socioeconomic": round(random.uniform(0, 0.3), 2)
        }
        model_used = "Simulated Model"

    audit_res = AuditResponse(
        id=f"FS-DOC-{str(uuid.uuid4())[:8].upper()}",
        prompt=text,
        original_text=text,
        score=score,
        bias_identified=bias_identified,
        fairness_alternative=fairness_alternative,
        reasoning=reasoning,
        analytics_heat=analytics_heat,
        domain=domain,
        risk_gradient=risk_gradient,
        bias_category=bias_category,
        bias_vectors=bias_vectors,
        model_used=model_used
    )
    
    payload = audit_res.dict()
    payload["user_uid"] = user.get("uid")
    payload["timestamp"] = firestore.SERVER_TIMESTAMP if db else "MOCK_TIMESTAMP"

    # Save to Firestore collection 'reports'
    if db:
        try:
            db.collection("reports").document(audit_res.id).set(payload)
            print(f"Saved report to Firestore: {audit_res.id}")
        except Exception as e:
            print(f"Failed to save to Firestore: {e}")
            
    # For local demo purposes, keep the in-memory fallback updated
    audit_history.insert(0, audit_res)

    # Return a 200 OK with the full audit report for the frontend
    return audit_res

@app.get("/audits", response_model=List[Any])
async def get_audits():
    """Return audit history. Uses Firestore if available, falls back to in-memory list."""
    if db:
        try:
            docs = db.collection("reports").order_by(
                "timestamp", direction=firestore.Query.DESCENDING
            ).limit(50).stream()
            return [d.to_dict() for d in docs]
        except Exception as e:
            print(f"Firestore read error: {e}")
    return [r.dict() for r in audit_history]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
