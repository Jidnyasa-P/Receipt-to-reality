
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Transaction, Leak, Suggestion, BillPrediction, ChatMessage } from "../types";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY! });
};

export async function processRawData(
  rawText: string, 
  sourceType: string, 
  userId: string,
  imagePart?: { inlineData: { data: string, mimeType: string } }
): Promise<Partial<Transaction>[]> {
  const ai = getAIClient();
  const model = "gemini-3-flash-preview";
  const prompt = `TASK: High-precision financial extraction. Categorize: Food & Delivery, Groceries, Transport & Fuel, Shopping, Subscriptions, Bills & Utilities, Rent, Misc. Detect if transaction looks like a Business Expense. Return JSON array.`;

  try {
    const parts: any[] = [{ text: prompt }];
    if (imagePart) parts.push(imagePart);
    if (rawText) parts.push({ text: rawText });

    const result = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              datetime: { type: Type.STRING },
              merchant: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              currency: { type: Type.STRING },
              category: { type: Type.STRING },
              isBusiness: { type: Type.BOOLEAN }
            },
            required: ["datetime", "merchant", "amount", "category"]
          }
        }
      }
    });
    const parsed = JSON.parse(result.text || "[]");
    return parsed.map((t: any) => ({ ...t, userId, sourceType, id: Math.random().toString(36).substr(2, 9) }));
  } catch (error) { return []; }
}

export async function predictBills(transactions: Transaction[]): Promise<BillPrediction[]> {
  const ai = getAIClient();
  const history = transactions.slice(-50).map(t => ({ d: t.datetime, m: t.merchant, a: t.amount }));
  const prompt = `Identify recurring bills or subscriptions from this history: ${JSON.stringify(history)}. Return JSON array of predictions.`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              merchant: { type: Type.STRING },
              estimatedAmount: { type: Type.NUMBER },
              frequency: { type: Type.STRING, enum: ['weekly', 'monthly', 'annual'] },
              nextExpectedDate: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              isSubscription: { type: Type.BOOLEAN }
            }
          }
        }
      }
    });
    return JSON.parse(result.text || "[]");
  } catch (e) { return []; }
}

export async function startFinancialChat(history: Transaction[]) {
  const ai = getAIClient();
  const summary = history.slice(-30).map(t => `${t.datetime}: ${t.merchant} $${t.amount} (${t.category})`).join('\n');
  
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `You are a financial advisor for R2R. Use the user's recent transactions to answer questions. 
      Summary: ${summary}
      Be concise, encouraging, and data-driven.`
    }
  });
}

export async function generateInsights(transactions: Transaction[]): Promise<{ leaks: Leak[], suggestions: Suggestion[] }> {
  if (transactions.length === 0) return { leaks: [], suggestions: [] };
  const ai = getAIClient();
  const summary = transactions.map(t => ({ date: t.datetime, merchant: t.merchant, amount: t.amount, category: t.category }));
  const prompt = `Analyze spending: ${JSON.stringify(summary)}. Identify 'leaks' and 'suggestions'. Return JSON.`;
  try {
    const result = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(result.text || '{"leaks": [], "suggestions": []}');
  } catch (error) { return { leaks: [], suggestions: [] }; }
}
