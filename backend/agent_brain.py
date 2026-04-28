"""
Gemini-based evaluator using Google Generative AI API.
This is simpler and more reliable than Vertex AI for development.
"""
import json
import os
from dotenv import load_dotenv
from google import genai

# Load environment variables with override=True to ensure .env.local takes precedence
load_dotenv(override=True)
load_dotenv(os.path.join(os.path.dirname(__file__), '.env.local'), override=True)

class GeminiEvaluator:
    def __init__(self, api_key: str = None):
        """
        Initialize the Gemini evaluator.
        """
        # Get config from environment
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY")
        self.project_id = os.getenv("GCP_PROJECT_ID")
        self.location = os.getenv("GCP_LOCATION", "us-central1")
        
        # Initialize the client (Prioritize AI Studio API Key for stability, fallback to Vertex)
        try:
            if self.api_key and not self.project_id:
                print("Initializing AI Studio (using API Key)")
                self.client = genai.Client(api_key=self.api_key)
            elif self.project_id:
                print(f"Initializing Vertex AI (Project: {self.project_id}, Location: {self.location})")
                self.client = genai.Client(
                    vertexai=True, 
                    project=self.project_id, 
                    location=self.location
                )
            else:
                print("No Project ID found, using AI Studio with API Key")
                self.client = genai.Client(api_key=self.api_key)
            
            # Dynamically find the best available model
            print("Finding available Gemini models...")
            try:
                available_models = [m.name for m in self.client.models.list()]
                print(f"Available models: {len(available_models)}")
            except Exception as list_err:
                print(f"Warning: Could not list models: {list_err}")
                available_models = []
            
            # Preferred models in order of priority based on project availability
            # Standard production models for Vertex and AI Studio
            preferred = [
                "gemini-1.5-pro-002",
                "gemini-1.5-flash-002",
                "gemini-1.5-pro",
                "gemini-1.5-flash",
                "gemini-1.0-pro"
            ]
            
            self.model_name = None
            
            # Match preferred models against available ones
            for p in preferred:
                for m in available_models:
                    if p in m:
                        self.model_name = m
                        break
                if self.model_name:
                    break
            
            # Fallbacks if no match found in list
            if not self.model_name:
                self.model_name = "gemini-1.5-flash"
            
            print(f"Gemini model selected: {self.model_name}")
        except Exception as e:
            print(f"Failed to initialize Gemini: {e}")
            self.model_name = "gemini-1.5-flash"


    def scan_text(self, text: str, domain: str) -> dict:
        """
        Analyze text for bias using Gemini.
        """
        if not text or not text.strip():
            return {
                "score": 0,
                "risk_gradient": 1.0,
                "bias_category": "None",
                "bias_identified": [],
                "fairness_alternative": "",
                "reasoning": "No text provided for analysis",
                "domain": domain,
                "original_text": text
            }

        prompt = f"""
You are an advanced AI fairness auditor for the IOTA framework. Analyze the following text for bias, stereotyping, and fairness issues in the context of {domain}.

Text to analyze:
"{text}"

Your evaluation must be rigorous but balanced:
1. **Implicit & Explicit Bias**: Identify subtle framing or overt discrimination.
2. **Category Scoring**: Assign a bias probability (0.0 to 1.0) for the following vectors: Gender, Racial, Age, and Socioeconomic.
3. **Counterfactual Logic**: Briefly consider how the text would change if sensitive attributes were different.
4. **Fairness Score**: A global score from 0-100 (100 is perfectly fair/equitable). 
   - **CRITICAL**: If the text is a good example of neutral, objective, and equitable language (e.g., focusing on purely technical skills without demographic proxies), reward it with a score above 90.
   - **CRITICAL**: Do not invent "structural bias" for text that is clearly fair and professional.
5. **Risk Gradient**: 0.0 (Safe/Fair) to 1.0 (Highly Biased/Toxic).

Provide your analysis in this exact JSON format:
{{
    "score": <integer 0-100>,
    "risk_gradient": <float 0.0-1.0>,
    "bias_category": <one of: "None", "Subtle", "Structural", "Overt">,
    "bias_identified": [<list of specific issues found or empty list if none>],
    "fairness_alternative": "<corrected version or empty string if fair>",
    "reasoning": "<detailed analytical rationale>",
    "bias_vectors": {{
        "Gender": <float 0.0-1.0>,
        "Racial": <float 0.0-1.0>,
        "Age": <float 0.0-1.0>,
        "Socioeconomic": <float 0.0-1.0>
    }}
}}

Return ONLY valid JSON.
"""

        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            
            response_text = response.text.strip()
            
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0]
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0]
            
            response_text = response_text.strip()
            result = json.loads(response_text)
            
            result["domain"] = domain
            result["original_text"] = text
            
            return result
            
        except Exception as e:
            error_str = str(e)
            print(f"Gemini API error with model {self.model_name}: {error_str}")
            
            # If 404, try to fallback to a basic flash model
            if "404" in error_str or "not found" in error_str.lower():
                print("Attempting emergency fallback to gemini-1.5-flash...")
                self.model_name = "gemini-1.5-flash"
                
                try:
                    return self.scan_text(text, domain)
                except:
                    pass

            return {
                "score": 0,
                "risk_gradient": 1.0,
                "bias_category": "None",
                "bias_identified": [f"Analysis failed: {error_str}"],
                "fairness_alternative": "",
                "reasoning": f"Gemini API error: {error_str}. Model tried: {self.model_name}. Please verify model availability in your region ({self.location}).",
                "domain": domain,
                "original_text": text
            }
