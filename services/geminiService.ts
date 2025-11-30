import { GoogleGenAI } from "@google/genai";
import { Language, UserProfile } from '../types';

/**
 * Service Layer: Google Gemini AI Integration
 * -------------------------------------------
 * This module handles all interactions with the Google GenAI SDK.
 * It is designed to be:
 * 1. Resilient: Checks for API keys in multiple locations (Env vs LocalStorage).
 * 2. Context-Aware: Injects user profile data (Name, Ward) into every prompt.
 * 3. Multilingual: Maps app language codes to natural language names for the LLM.
 */

/**
 * Retrieves the GoogleGenAI client instance.
 * Priority:
 * 1. LocalStorage (User-provided key via Settings) - Allows dynamic key usage without redeploy.
 * 2. Process.env (Build-time key) - Fallback for default deployments.
 * 
 * @returns {GoogleGenAI | null} The authenticated client or null if no key is found.
 */
const getAiClient = (): GoogleGenAI | null => {
  const localKey = localStorage.getItem('gramSahayak_apiKey');
  const envKey = process.env.API_KEY;
  const key = localKey || envKey;

  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
};

/**
 * Maps ISO language codes to full English names.
 * This is crucial because LLMs follow instructions better when the target language
 * is specified by name (e.g., "Write in Telugu") rather than code (e.g., "te").
 */
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

/**
 * Generates a formal official letter based on user inputs.
 * 
 * Architecture Note:
 * This function constructs a "Few-Shot" style prompt where the context
 * (Sender Details) is strictly defined to ensure the generated output
 * is ready-to-print without manual editing.
 * 
 * @param recipient - The official designation of the receiver (e.g., BDO).
 * @param subject - The core issue.
 * @param details - Rough notes provided by the user.
 * @param userProfile - Used to generate the official signature.
 * @param tone - Adjusts the vocabulary (Formal vs Urgent).
 * @param language - The target output language.
 */
export const generateOfficialLetter = async (
  recipient: string,
  subject: string,
  details: string,
  userProfile: UserProfile,
  tone: 'Formal' | 'Urgent' | 'Request' = 'Formal',
  language: Language = 'en'
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Error: API Key is missing. Please add it in Settings.";

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
    return "Error: Could not generate draft. Please check your connection or API Key.";
  }
};

/**
 * Queries the AI for information regarding Government Schemes (Yojnas).
 * 
 * Design Decision:
 * We use Markdown formatting in the prompt instructions to ensure the
 * rendered output in the React component is structured (bullet points, bold text)
 * and easy to read on mobile devices.
 */
export const askSchemeInfo = async (query: string, language: Language = 'en'): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Error: API Key is missing. Please add it in Settings.";

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
    return "Error: Could not retrieve information. Please check your connection.";
  }
};

/**
 * Generates a social media (WhatsApp) broadcast message.
 * 
 * Feature Highlight:
 * Supports 'Hinglish' (Hindi written in English script) which is the 
 * dominant mode of digital communication in rural India.
 */
export const generateBroadcastMessage = async (
  topic: string, 
  userProfile: UserProfile,
  language: 'English' | 'Hindi' | 'Hinglish' | 'Local' = 'Hinglish',
  appLanguage: Language = 'en'
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Error: API Key is missing. Please add it in Settings.";

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