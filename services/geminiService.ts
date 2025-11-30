

import { GoogleGenAI } from "@google/genai";
import { Language, UserProfile } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const getLanguageName = (code: string): string => {
  const map: Record<string, string> = {
    en: 'English',
    hi: 'Hindi',
    bn: 'Bengali',
    te: 'Telugu',
    mr: 'Marathi',
    ta: 'Tamil',
    gu: 'Gujarati',
    kn: 'Kannada',
    ml: 'Malayalam',
    pa: 'Punjabi'
  };
  return map[code] || 'English';
};

export const generateOfficialLetter = async (
  recipient: string,
  subject: string,
  details: string,
  userProfile: UserProfile,
  tone: 'Formal' | 'Urgent' | 'Request' = 'Formal',
  language: Language = 'en'
): Promise<string> => {
  if (!apiKey) throw new Error("API Key is missing");

  const langName = getLanguageName(language);

  const prompt = `
    You are an expert assistant for an Indian Gram Panchayat Member. 
    Write an official letter.
    
    Target Language: ${langName}
    To: ${recipient}
    Subject: ${subject}
    Tone: ${tone}
    Details of the issue/request: ${details}

    Sender Details (For Signature):
    Name: ${userProfile.name}
    Ward Number: ${userProfile.wardNumber}
    Panchayat: ${userProfile.panchayatName}

    Rules:
    1. Use standard official correspondence format suitable for Indian government offices.
    2. Be respectful but firm.
    3. Include placeholders for [Date] if not provided.
    4. Keep it concise (under 300 words).
    5. Output ONLY the letter body text, no conversational filler.
    6. Sign off clearly as:
       ${userProfile.name}
       Ward Member, Ward ${userProfile.wardNumber}
       ${userProfile.panchayatName}
    7. If an Indian language is chosen, ensure the terminology is formal (Official/Karyalaya bhasha).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Failed to generate letter.";
  } catch (error) {
    console.error("Error generating letter:", error);
    return "Error: Could not generate draft. Please check your connection.";
  }
};

export const askSchemeInfo = async (query: string, language: Language = 'en'): Promise<string> => {
  if (!apiKey) throw new Error("API Key is missing");

  const langName = getLanguageName(language);

  const prompt = `
    You are a helpful assistant for rural Indian governance. 
    The user (a Panchayat member) is asking about government schemes.
    
    Query: "${query}"
    Output Language: ${langName}

    Provide a response that:
    1. Is simple to understand.
    2. Lists Eligibility Criteria clearly.
    3. Lists Documents Required.
    4. Mentions if it is Central or State specific (general context).
    5. Format the output with clear headers and bullet points using Markdown.
    6. If in an Indian language, use easy-to-understand terms, not overly complex vocabulary.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No information found.";
  } catch (error) {
    console.error("Error fetching scheme info:", error);
    return "Error: Could not retrieve information.";
  }
};

export const generateBroadcastMessage = async (
  topic: string, 
  userProfile: UserProfile,
  language: 'English' | 'Hindi' | 'Hinglish' | 'Local' = 'Hinglish',
  appLanguage: Language = 'en'
): Promise<string> => {
  if (!apiKey) throw new Error("API Key is missing");

  let targetLang = language;
  if (language === 'Local') {
    targetLang = getLanguageName(appLanguage) as any;
  }

  const prompt = `
    You are a helpful assistant to a Gram Panchayat Member in India.
    Draft a WhatsApp message to be sent to the village community group.

    Topic/Update: ${topic}
    Language: ${targetLang}
    Sender Name: ${userProfile.name}
    Sender Ward: ${userProfile.wardNumber}

    Rules:
    1. Start with a polite greeting (e.g., Namaste / Pranam / Vanakkam).
    2. Use relevant emojis to make it engaging and readable.
    3. Keep it clear, concise, and respectful.
    4. If 'Hinglish' is selected, use Romanized Hindi mixed with English terms.
    5. If a specific Indian language is selected, use the native script.
    6. Sign off as:
       ${userProfile.name}
       Ward Member, Ward ${userProfile.wardNumber}
    7. Output ONLY the message content.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Failed to generate message.";
  } catch (error) {
    console.error("Error generating broadcast:", error);
    return "Error: Could not generate message.";
  }
};