import json
import vertexai
from vertexai.generative_models import GenerativeModel, GenerationConfig

class IotaEvaluator:
    def __init__(self, project_id: str, location: str = "us-central1"):
        """
        Initializes the Vertex AI SDK and loads the Gemini model.
        """
        vertexai.init(project=project_id, location=location)
        # Using gemini-1.5-flash for fast, structured outputs
        self.model = GenerativeModel("gemini-1.5-flash-001")

    def scan_text(self, text: str, domain: str) -> dict:
        """
        Sends a prompt to Gemini asking it to evaluate text fairness.
        Returns a structured JSON dictionary ready for Firestore storage.
        
        Args:
            text (str): The prompt or output text to be analyzed.
            domain (str): The industry or context (e.g., 'HR Recruiting', 'Loan Approval').
            
        Returns:
            dict: Parsed JSON response containing score, biases, alternatives, and reasoning.
        """
        prompt = f"""
        You are an advanced AI fairness and ethics evaluator for the IOTA framework.
        Analyze the following text used in the domain context of '{domain}'.

        Your tasks:
        1. Evaluate the text and assign a 'Fairness Score' between 0 (highly biased) and 100 (perfectly fair).
        2. Assign a 'Risk Gradient' value between 0.0 and 1.0, where 1.0 is extremely toxic/biased and 0.0 is completely safe.
        3. Categorize the type of bias present into exactly one of these strings: "Subtle", "Structural", "Overt", or "None".
        4. Identify any specific biased phrases, demographic stereotyping, or harmful framing. If none exist, return an empty list.
        5. Generate a 'Fair Alternative' that corrects these biases while maintaining the core intent. If the text is already fair, provide an empty string.
        6. Explain your reasoning for the score and the detected biases.
        
        Text to analyze:
        "{text}"

        Return your analysis STRICTLY as a JSON object with the exact following keys:
        {{
            "score": <integer 0-100>,
            "risk_gradient": <float 0.0-1.0>,
            "bias_category": <string "Subtle", "Structural", "Overt", or "None">,
            "bias_identified": [<list of strings detailing biased phrases or semantic vectors>],
            "fairness_alternative": "<string containing the corrected text>",
            "reasoning": "<string explaining your analytical rationale>"
        }}
        """

        # Enforce JSON output at the model level
        generation_config = GenerationConfig(
            response_mime_type="application/json",
            temperature=0.2, # Low temperature for more analytical, consistent output
        )

        response = self.model.generate_content(
            prompt,
            generation_config=generation_config
        )

        try:
            # Parse the JSON response
            result = json.loads(response.text)
            
            # Inject metadata useful for Firestore documents
            result["domain"] = domain
            result["original_text"] = text
            
            return result
        except json.JSONDecodeError as e:
            # Safe fallback if the model hallucinates non-JSON output
            return {
                "score": 0,
                "risk_gradient": 1.0,
                "bias_category": "Overt",
                "bias_identified": ["Error: Failed to parse LLM response"],
                "fairness_alternative": None,
                "reasoning": f"JSON decoding failed: {str(e)}\nRaw Response: {response.text}",
                "domain": domain,
                "original_text": text
            }
