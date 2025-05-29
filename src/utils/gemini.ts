import { GoogleGenerativeAI } from "@google/generative-ai";
import { Flashcard } from "@/types/flashcard";

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

function extractJSONFromText(text: string): string {
  // Try to find JSON between code blocks first
  const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1];
  }

  // If no code blocks, try to find the first occurrence of { and last occurrence of }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    return text.slice(firstBrace, lastBrace + 1);
  }

  // If no JSON-like structure found, return the original text
  return text;
}

export async function generateFlashcardsFromPDF(pdfFile: File): Promise<{ title: string; cards: Flashcard[] }> {
  // Debug information
  console.log('Environment variables:', {
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY ? 'Set' : 'Not set',
    NODE_ENV: process.env.NODE_ENV,
  });

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
    const ai = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Convert PDF to base64
    const buffer = await pdfFile.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');

    // Generate content
    const result = await model.generateContent([
      FLASHCARD_GENERATION_PROMPT,
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: base64Data
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
        title: parsedResponse.title || pdfFile.name.replace('.pdf', ''),
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
    throw new Error('Failed to generate flashcards from PDF');
  }
} 