import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import matter from 'gray-matter';
import { Flashcard } from '@/types/flashcard';

export async function loadDeckFromMarkdown(content: string): Promise<{ title: string; cards: Flashcard[] }> {
  try {
    console.log('Parsing markdown content:', content.slice(0, 100) + '...');
    
    // Parse front matter
    const { data, content: markdownContent } = matter(content);
    console.log('Front matter:', data);
    
    // Remove the front matter separator if it's still present
    const cleanContent = markdownContent.replace(/^---\n/, '');
    console.log('Content after front matter:', cleanContent.slice(0, 100) + '...');
    
    // Split content into cards (separated by ---), filter empty entries and trim each card
    const cardContents = cleanContent
      .split(/\n---\n/)
      .map(card => card.trim())
      .filter(card => card.length > 0);
    
    console.log('Found', cardContents.length, 'cards');
    cardContents.forEach((card, i) => {
      console.log(`Card ${i + 1}:`, card.slice(0, 50) + '...');
    });
    
    if (cardContents.length === 0) {
      throw new Error('No cards found in the deck. Make sure to separate cards with "---" on its own line.');
    }
    
    // Process each card
    const cards = await Promise.all(cardContents.map(async (cardContent, index) => {
      // Split on ??? but preserve newlines around it
      const parts = cardContent.split(/\n\?\?\?\n/).map(str => str.trim());
      console.log(`Card ${index + 1} parts:`, parts);
      
      if (parts.length !== 2) {
        console.error(`Card ${index + 1} content:`, cardContent);
        console.error(`Card ${index + 1} parts:`, parts);
        throw new Error(
          `Invalid card format at card ${index + 1}. ` +
          'Each card must have exactly one question and one answer separated by "???" on its own line. ' +
          'Make sure there are newlines before and after the "???" separator.'
        );
      }
      
      const [question, answer] = parts;
      
      if (!question || !answer) {
        throw new Error(
          `Empty ${!question ? 'question' : 'answer'} at card ${index + 1}. ` +
          'Both question and answer must have content.'
        );
      }
      
      // Process markdown and math for both question and answer
      const processor = unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkRehype)  // Convert markdown AST to HTML AST
        .use(rehypeKatex)
        .use(rehypeStringify);

      const processedQuestion = await processor.process(question);
      const processedAnswer = await processor.process(answer);

      return {
        question: String(processedQuestion),
        answer: String(processedAnswer)
      };
    }));

    if (!data.title) {
      console.warn('No title found in front matter. Using "Untitled Deck".');
    }

    return {
      title: data.title || 'Untitled Deck',
      cards
    };
  } catch (error) {
    console.error('Error in loadDeckFromMarkdown:', error);
    if (error instanceof Error) {
      throw new Error(`Error parsing markdown deck: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while parsing the markdown deck.');
  }
}

// Export the original name for backward compatibility
export const parseMarkdownDeck = loadDeckFromMarkdown; 