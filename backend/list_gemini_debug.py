import os
from google import genai
from dotenv import load_dotenv

load_dotenv("backend/.env.local")

project_id = os.getenv("GCP_PROJECT_ID")
location = os.getenv("GCP_LOCATION", "us-central1")

try:
    client = genai.Client(
        vertexai=True,
        project=project_id,
        location=location
    )
    
    print("Gemini Models:")
    models = list(client.models.list())
    for m in models:
        if "gemini" in m.name.lower():
            print(f"- {m.name}")
    
    if not models:
        print("NO MODELS FOUND")
except Exception as e:
    print(f"Error: {e}")
