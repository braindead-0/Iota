import requests
import json

url = "http://localhost:8000/scan"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer MOCK_DEVELOPMENT_TOKEN"
}
payload = {
    "text": "The candidate is a young energetic man who would fit well in our fast-paced environment.",
    "domain": "HR"
}

try:
    response = requests.post(url, headers=headers, json=payload)
    print(f"Status Code: {response.status_code}")
    print("Response JSON:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
