from fastapi import FastAPI, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import List, Optional
import uuid
import random
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials, auth, firestore

# Import our custom Gemini evaluator
from iota_evaluator import IotaEvaluator

app = FastAPI(title="IOTA Audit Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase Admin (in production, this automatically picks up GCP credentials)
try:
    firebase_admin.initialize_app()
    db = firestore.client()
except Exception as e:
    # Handle local dev without creds gracefully, but log it
    print("Firebase init failed (missing credentials in dev environment):", e)
    db = None

# Initialize Vertex AI Evaluator
try:
    # Use the user's configured project ID
    evaluator = IotaEvaluator(project_id="iota-backend-sa")
except Exception as e:
    print("Vertex AI init failed:", e)
    evaluator = None

class AuditRequest(BaseModel):
    text: str
    domain: Optional[str] = "Web UI"

class AuditResponse(BaseModel):
    id: str
    prompt: str
    score: int
    bias_identified: List[str]
    fairness_alternative: Optional[str]
    reasoning: str
    analytics_heat: List[int]
    domain: str
    risk_gradient: float
    bias_category: str

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

@app.post("/scan", response_model=AuditResponse)
async def audit_text(request: AuditRequest, user: dict = Depends(verify_firebase_token)):
    text = request.text
    domain = request.domain
    
    # Generate Heatmap Analytics (simulated processing weights for the Grid UI)
    analytics_heat = [random.randint(0, 100) for _ in range(5)]
    
    # Call Vertex AI Gemini model
    if evaluator:
        try:
            gemini_result = evaluator.scan_text(text, domain)
            score = gemini_result.get("score", 0)
            bias_identified = gemini_result.get("bias_identified", [])
            fairness_alternative = gemini_result.get("fairness_alternative", "")
            reasoning = gemini_result.get("reasoning", "No reasoning provided.")
            risk_gradient = gemini_result.get("risk_gradient", 0.0)
            bias_category = gemini_result.get("bias_category", "None")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Vertex AI Error: {str(e)}")
    else:
        # Fallback heuristic logic if SDK lacks local GCP credentials
        score = random.randint(30, 95)
        bias_identified = ["Fallback Mock Bias"] if score < 70 else []
        fairness_alternative = "Mock Alternative" if score < 70 else ""
        reasoning = "Mock reasoning because Vertex SDK lacks local credentials."
        risk_gradient = round(random.uniform(0.1, 0.9), 2)
        bias_category = random.choice(["Subtle", "Structural", "Overt", "None"])

    audit_res = AuditResponse(
        id=f"FS-DOC-{str(uuid.uuid4())[:8].upper()}",
        prompt=text,
        score=score,
        bias_identified=bias_identified,
        fairness_alternative=fairness_alternative,
        reasoning=reasoning,
        analytics_heat=analytics_heat,
        domain=domain,
        risk_gradient=risk_gradient,
        bias_category=bias_category
    )
    
    payload = audit_res.dict()
    payload["user_uid"] = user.get("uid")
    payload["timestamp"] = firestore.SERVER_TIMESTAMP if db else "MOCK_TIMESTAMP"

    # Save to Firestore collection 'reports'
    if db:
        try:
            db.collection("reports").document(audit_res.id).set(payload)
        except Exception as e:
            print(f"Failed to save to Firestore: {e}")
            
    # For local demo purposes, keep the in-memory fallback updated
    audit_history.insert(0, audit_res)

    # Return a 200 OK with the full audit report for the frontend
    return audit_res

@app.get("/audits", response_model=List[AuditResponse])
async def get_audits():
    return audit_history

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
