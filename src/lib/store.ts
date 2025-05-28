import { FlashcardDeck, DeckMetadata } from '@/types/flashcard';

const STORAGE_KEY = 'flashcard-decks';

export const loadDecks = (): FlashcardDeck[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading decks:', error);
    return [];
  }
};

export const saveDeck = (deck: FlashcardDeck): void => {
  if (typeof window === 'undefined') return;
  
  const decks = loadDecks();
  const existingIndex = decks.findIndex(d => d.id === deck.id);
  
  if (existingIndex >= 0) {
    decks[existingIndex] = deck;
  } else {
    decks.push(deck);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
};

export const deleteDeck = (deckId: string): void => {
  if (typeof window === 'undefined') return;
  
  const decks = loadDecks();
  const filteredDecks = decks.filter(d => d.id !== deckId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredDecks));
};

export const getDeckMetadata = (decks: FlashcardDeck[]): DeckMetadata[] => {
  return decks.map(deck => ({
    id: deck.id,
    name: deck.name,
    cardCount: deck.cards.length,
    createdAt: deck.createdAt,
    lastModified: deck.lastModified,
  }));
}; 