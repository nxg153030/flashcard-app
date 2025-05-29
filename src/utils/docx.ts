import { GoogleGenerativeAI } from "@google/generative-ai";
import { Flashcard } from "@/types/flashcard";
import mammoth from "mammoth";
import { extractJSONFromText } from "./gemini";

const FLASHCARD_GENERATION_PROMPT = `
You are a helpful AI that creates flashcards from documents. For the given document:
1. Identify the key concepts, facts, and ideas
2. Create question-answer pairs that test understanding of these concepts
3. Make sure questions are clear and specific
4. Ensure answers are concise but complete
5. Return ONLY a JSON object in this exact format, with no markdown formatting or code blocks:
{
  "title": "Document Title",
  "cards": [
    {
      "question": "Question text here",
      "answer": "Answer text here"
    }
  ]
}
6. Create at least 10 flashcards, but no more than 20
7. Do not include any text before or after the JSON
8. Do not wrap the JSON in code blocks or markdown
`;

export async function generateFlashcardsFromDOCX(file: File): Promise<{ title: string; cards: Flashcard[] }> {
  if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    throw new Error(
      'Gemini API key not found. Please check:\n' +
      '1. Your .env.local file exists in the project root\n' +
      '2. It contains: NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key\n' +
      '3. You have restarted the Next.js development server\n' +
      '4. The API key is correctly formatted with no spaces or quotes'
    );
  }

  try {
    // Convert DOCX to HTML
    const arrayBuffer = await file.arrayBuffer();
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
    
    // Initialize Gemini AI
    const ai = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content
    const result = await model.generateContent([
      FLASHCARD_GENERATION_PROMPT,
      {
        inlineData: {
          mimeType: 'text/html',
          data: Buffer.from(html).toString('base64')
        }
      }
    ]);
    
    const response = await result.response;
    const text = response.text();

    // Extract and parse the JSON response
    try {
      console.log('Raw response:', text); // Debug log
      const jsonText = extractJSONFromText(text);
      console.log('Extracted JSON:', jsonText); // Debug log
      
      const parsedResponse = JSON.parse(jsonText);
      
      if (!parsedResponse.cards || !Array.isArray(parsedResponse.cards)) {
        throw new Error('Invalid response format: missing cards array');
      }

      return {
        title: parsedResponse.title || file.name.replace('.docx', ''),
        cards: parsedResponse.cards
      };
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      console.error('Response text:', text);
      throw new Error('Failed to parse AI response. Please try again.');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error('Error generating flashcards:', error);
    throw new Error('Failed to generate flashcards from Word document');
  }
} 