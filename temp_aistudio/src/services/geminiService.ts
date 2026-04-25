import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

export function saveAuditToHistory(text: string, result: BiasAuditResult) {
  const history = JSON.parse(localStorage.getItem('iota_history') || '[]');
  const newEntry: SavedAudit = {
    ...result,
    id: `AUDIT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    originalText: text
  };
  localStorage.setItem('iota_history', JSON.stringify([newEntry, ...history].slice(0, 50)));
  return newEntry;
}

export function getAuditHistory(): SavedAudit[] {
  return JSON.parse(localStorage.getItem('iota_history') || '[]');
}

export async function auditTextBias(text: string): Promise<BiasAuditResult> {
  if (!text.trim()) {
    throw new Error("Input text is required for auditing.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following text for potential AI bias, unfairness, or stereotyping: "${text}"`,
    config: {
      systemInstruction: "You are an AI Fairness Auditor. Evaluate input text for demographic parity, gender skew, socio-economic bias, and stereotyping. Return results in a structured JSON format.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "Fairness confidence score from 0-100" },
          riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          explanation: { type: Type.STRING, description: "Detailed explanation of findings" },
          interventions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Recommended mitigation steps" 
          },
          vectors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                biasValue: { type: Type.NUMBER, description: "0 for no bias, 1 for high bias" }
              }
            }
          }
        },
        required: ["score", "riskLevel", "explanation", "interventions", "vectors"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
