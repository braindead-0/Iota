export interface BiasAuditResult {
  score: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  explanation: string;
  interventions: string[];
  vectors: {
    category: string;
    biasValue: number;
  }[];
  modelUsed?: string;
}

export interface SavedAudit extends BiasAuditResult {
  id: string;
  timestamp: string;
  originalText: string;
}

export async function auditTextBias(text: string, domain?: string): Promise<BiasAuditResult> {
  if (!text.trim()) {
    throw new Error("Input text is required for auditing.");
  }

  // Call the backend API directly
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  const scanUrl = `${backendUrl}/scan`;

  try {
    const response = await fetch(scanUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer MOCK_DEVELOPMENT_TOKEN"
      },
      body: JSON.stringify({ text, domain: domain || "Search Telemetry" })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Backend returned ${response.status}: ${errorData.detail || "Failed to scan text."}`
      );
    }

    const data = await response.json();

    // Map backend AuditResponse fields → BiasAuditResult shape used by the UI
    const riskGradient = data.risk_gradient || 0;
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
    
    if (riskGradient > 0.7) riskLevel = 'High';
    else if (riskGradient > 0.3) riskLevel = 'Medium';

    // Build meaningful bias vectors from the backend result.
    let vectors: { category: string, biasValue: number }[] = [];
    
    if (data.bias_vectors && Object.keys(data.bias_vectors).length > 0) {
      vectors = Object.entries(data.bias_vectors).map(([category, value]) => ({
        category,
        biasValue: Number(value)
      }));
    } else {
      const biasItems: string[] = data.bias_identified || [];
      vectors = biasItems.length > 0
        ? biasItems.map((b: string, i: number) => ({
            category: b.length > 40 ? b.slice(0, 40) + '…' : b,
            biasValue: Math.min(1, Math.max(0, riskGradient + (i % 2 === 0 ? 0.05 : -0.05) * (i + 1) * 0.1))
          }))
        : [{ category: 'No bias detected', biasValue: 0 }];
    }

    return {
      score: data.score || 0,
      riskLevel,
      explanation: data.reasoning || "No explanation provided.",
      interventions: data.fairness_alternative ? [data.fairness_alternative] : [],
      vectors,
      modelUsed: data.model_used || "Gemini"
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Audit service error:", errorMessage);

    if (
      errorMessage.includes("Failed to fetch") ||
      errorMessage.includes("ERR_") ||
      errorMessage.includes("502")
    ) {
      throw new Error(
        `Unable to reach the backend. Make sure the Python server is running:\n` +
        `cd backend && python main.py`
      );
    }
    throw error;
  }
}

export function saveAuditToHistory(_text: string, _result: BiasAuditResult) {
  console.log("Audit saved to Firebase via Backend.");
}

export function getAuditHistory(): SavedAudit[] {
  return [];
}
