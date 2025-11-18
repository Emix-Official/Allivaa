import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * A simple wrapper for the Gemini API.
 */
export const gemini = {
  /**
   * Generates a text response from a prompt.
   * @param prompt The text prompt to send to the AI.
   * @returns The AI's text response.
   */
  generateText: async (prompt: string): Promise<string> => {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  },
};