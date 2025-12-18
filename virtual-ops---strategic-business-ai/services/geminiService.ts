import { GoogleGenAI, Type, FunctionDeclaration, Modality } from "@google/genai";
import { BusinessSignal, ClientContext, FinancialTransaction } from "../types";

export const businessTools: FunctionDeclaration[] = [
  {
    name: 'schedule_meeting',
    description: 'Schedules a business meeting or sets a reminder.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        time: { type: Type.STRING },
        attendees: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['title', 'time']
    }
  }
];

const MASTER_SYSTEM_INSTRUCTION = (mode: 'internal' | 'client' | 'portal' | 'briefing' | 'reconciliation' = 'internal', clientContext: ClientContext = 'Virtual Ops Internal') => {
  const isManaged = clientContext === 'REN Ecosystem' || clientContext === 'Fatherhood Connection';
  
  const base = `
You are VOPSY, the elite AI Employee for Virtual OPS Hub, founded by Tania Potter.
MISSION: Virtual OPS Hub gives every founder a teammate — not another tool.
CORE PHILOSOPHY: Automate · Educate · Scale.

SERVICE DELIVERY MODEL: 
${isManaged ? 
  `MANAGED TEAM MODE: You work as a strategic duo with Tania Potter (the Operator). You handle the high-speed data, automation, and drafting, while Tania provides executive oversight and final human validation for ${clientContext}. When speaking to the client, refer to "Tania and I" or "The Virtual Ops Team".` : 
  `DIRECT SAAS MODE: You are the primary and solo Operations Manager for this client. They access you directly to bypass manual operations. You are their 24/7 dedicated teammate.`}
`;

  const clientSpecifics = {
    'Fatherhood Connection': `
CONTEXT: Fatherhood Connection (Managed Non-Profit).
FOCUS: Grant pipelines, donor transparency, community impact.
ROLE: You and Tania are their external Operations Department.
`,
    'REN Ecosystem': `
CONTEXT: REN Ecosystem (Managed Wealth & Portfolio).
FOCUS: S&P 500 wealth infrastructure, Options Hedging (Strategic Risk Insurance).
ROLE: You provide the technical strategy that Tania validates for the executive board.
`,
    'Virtual Ops Internal': `
CONTEXT: Virtual Ops Internal Backend.
FOCUS: Managing the "Heartbeat" of Vopsy itself.
`,
    'Direct SaaS Partner': `
CONTEXT: Direct Access Client.
FOCUS: High-velocity growth and automated systems.
`
  };

  const selectedContext = clientSpecifics[clientContext] || clientSpecifics['Virtual Ops Internal'];

  if (mode === 'reconciliation') {
    return base + selectedContext + `
MODE: SMART RECONCILIATION
${isManaged ? 
  "Prepare batches for Tania to 'One-Click Approve'. Explain the logic so Tania can explain it to the client if needed." : 
  "Empower the client to 'One-Click Approve' their own records by providing high-confidence matching and clear IRS-compliant explanations."}
`;
  }

  if (mode === 'briefing') {
    return base + selectedContext + `
MODE: OPERATIONAL BRIEFING
Provide a 1-sentence high-impact directive for the start of the day.
`;
  }

  return base + selectedContext + `
TONE: Authoritative, elite, yet educational ("Learn while you work").
`;
};

export const generateDashboardBriefing = async (client: ClientContext) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "Analyze recent context and provide today's top operational directive.",
    config: {
      systemInstruction: MASTER_SYSTEM_INSTRUCTION('briefing', client),
    },
  });
  return response.text;
};

export const analyzeReconciliation = async (transactions: FinancialTransaction[], client: ClientContext) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze these transactions for ${client}: ${JSON.stringify(transactions)}.`,
    config: {
      systemInstruction: MASTER_SYSTEM_INSTRUCTION('reconciliation', client),
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            category: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            aiInsight: { type: Type.STRING },
            isAnomaly: { type: Type.BOOLEAN }
          },
          required: ['id', 'category', 'confidence', 'aiInsight', 'isAnomaly']
        }
      }
    },
  });
  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    return [];
  }
};

export const sendMessage = async (message: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: message,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Search Source",
      uri: chunk.web?.uri || "#"
    })) || []
  };
};

export const sendConsultantMessage = async (
  message: string, 
  mode: 'internal' | 'client' | 'portal' = 'internal', 
  clientContext: ClientContext = 'Virtual Ops Internal'
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: message,
    config: {
      systemInstruction: MASTER_SYSTEM_INSTRUCTION(mode, clientContext),
      tools: mode === 'internal' ? [{ functionDeclarations: businessTools }] : [{ googleSearch: {} }],
    },
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Strategic Source",
      uri: chunk.web?.uri || "#"
    })) || [],
    functionCalls: response.functionCalls
  };
};

export const generateStrategicReport = async (prompt: string, type: string, clientContext: ClientContext = 'Virtual Ops Internal') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      systemInstruction: MASTER_SYSTEM_INSTRUCTION('client', clientContext) + `\nGenerate a detailed ${type.replace('_', ' ')} report.`,
      tools: [{ googleSearch: {} }],
    },
  });
  return {
    content: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Market Source",
      uri: chunk.web?.uri || "#"
    })) || []
  };
};

export const generateImage = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: { imageConfig: { aspectRatio: "1:1" } }
  });
  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  return part?.inlineData ? `data:image/png;base64,${part.inlineData.data}` : "";
};

export const generateVideo = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }
  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  return `${downloadLink}&key=${process.env.API_KEY}`;
};

export const generateSpeech = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64Audio ? `data:audio/pcm;base64,${base64Audio}` : "";
};

export const generateSignals = async (industry: string): Promise<BusinessSignal[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 3 high-impact operational signals.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            urgency: { type: Type.STRING },
            relevance: { type: Type.NUMBER },
            timestamp: { type: Type.NUMBER }
          },
          required: ['id', 'type', 'title', 'description', 'urgency', 'relevance', 'timestamp']
        }
      }
    }
  });
  try {
    return JSON.parse(response.text || '[]');
  } catch {
    return [];
  }
};

export const generateCourseCurriculum = async (topic: string, clientContext: ClientContext = 'Virtual Ops Internal'): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate course curriculum for: ${topic}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          episodes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                script: { type: Type.STRING }
              },
              required: ['title', 'description', 'script']
            }
          }
        },
        required: ['title', 'description', 'episodes']
      }
    }
  });
  return JSON.parse(response.text || '{}');
};