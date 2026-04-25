export interface BiasAuditResult {
  score: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  explanation: string;
  interventions: string[];
  vectors: {
    category: string;
    biasValue: number;
  }[];
}

export interface SavedAudit extends BiasAuditResult {
  id: string;
  timestamp: string;
  originalText: string;
}

export async function auditTextBias(text: string): Promise<BiasAuditResult> {
  if (!text.trim()) {
    throw new Error("Input text is required for auditing.");
  }

  const response = await fetch("http://localhost:8000/scan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer MOCK_DEVELOPMENT_TOKEN"
    },
    body: JSON.stringify({ text, domain: "Model C Dashboard" })
  });

  if (!response.ok) {
    throw new Error("Failed to scan text via FastAPI backend.");
  }

  const data = await response.json();
  
  // Map backend AuditResponse to BiasAuditResult
  const riskGradient = data.risk_gradient || 0;
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  if (riskGradient > 0.6 || data.bias_category === 'Overt') riskLevel = 'High';
  else if (riskGradient > 0.3 || data.bias_category === 'Structural') riskLevel = 'Medium';

  return {
    score: data.score || 0,
    riskLevel,
    explanation: data.reasoning || "No explanation provided.",
    interventions: data.fairness_alternative ? [data.fairness_alternative] : [],
    vectors: (data.bias_identified || []).map((b: string) => ({
      category: b,
      biasValue: riskGradient
    }))
  };
}

export function saveAuditToHistory(text: string, result: BiasAuditResult) {
  // We no longer need local storage since the backend saves to Firebase!
  // The History component will automatically pick it up via onSnapshot.
  console.log("Audit saved to Firebase via Backend.");
}

export function getAuditHistory(): SavedAudit[] {
  // Kept for type compatibility but no longer used in History.tsx
  return [];
}
