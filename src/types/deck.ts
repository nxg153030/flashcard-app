export interface Flashcard {
  question: string;
  answer: string;
}

export interface Deck {
  id: string;
  title: string;
  cards: Flashcard[];
  timestamp: number;
} 