export interface Flashcard {
  question: string;
  answer: string;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  cards: Flashcard[];
  createdAt: string;
  lastModified: string;
}

export interface DeckMetadata {
  id: string;
  name: string;
  cardCount: number;
  createdAt: string;
  lastModified: string;
} 