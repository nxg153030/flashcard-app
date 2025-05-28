import fs from 'fs/promises';
import path from 'path';
import { parseMarkdownDeck } from './markdown';
import { Deck } from '@/types/deck';

export async function loadDecks(): Promise<Deck[]> {
  const decksDir = path.join(process.cwd(), 'public/decks');
  
  try {
    const files = await fs.readdir(decksDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    const decks = await Promise.all(
      markdownFiles.map(async (filename) => {
        const filePath = path.join(decksDir, filename);
        const content = await fs.readFile(filePath, 'utf-8');
        const { title, cards } = await parseMarkdownDeck(content);
        
        return {
          id: path.basename(filename, '.md'),
          title,
          cards,
          timestamp: Date.now()
        };
      })
    );
    
    return decks;
  } catch (error) {
    console.error('Error loading decks:', error);
    return [];
  }
} 