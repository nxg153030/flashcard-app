'use client';

import { useState, useEffect } from 'react';
import { FlashCardDeck } from '@/components/FlashCardDeck';
import { Sidebar } from '@/components/Sidebar';
import { Flashcard, FlashcardDeck } from '@/types/flashcard';
import { loadDecks, saveDeck, getDeckMetadata, deleteDeck } from '@/lib/store';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Bars3Icon } from '@heroicons/react/24/outline';
import { v4 as uuidv4 } from 'uuid';
import { loadDeckFromMarkdown } from '@/utils/markdown';
import { generateFlashcardsFromPDF } from '@/utils/gemini';

export default function Home() {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeyInstructions, setShowApiKeyInstructions] = useState(false);

  // Reset all state and local storage
  const resetState = () => {
    localStorage.clear();
    setDecks([]);
    setSelectedDeckId(null);
    setError('');
  };

  useEffect(() => {
    const storedDecks = loadDecks();
    setDecks(storedDecks);
    if (storedDecks.length > 0) {
      setSelectedDeckId(storedDecks[0].id);
    }
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setIsLoading(true);
    setShowApiKeyInstructions(false);
    
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      let newDeck: { title: string; cards: Flashcard[] };

      if (file.type === 'application/pdf') {
        try {
          newDeck = await generateFlashcardsFromPDF(file);
        } catch (err) {
          if (err instanceof Error && err.message.includes('Gemini API key not found')) {
            setShowApiKeyInstructions(true);
            throw new Error('API key not configured. Please check the instructions below.');
          }
          throw err;
        }
      } else if (file.name.endsWith('.md')) {
        const content = await file.text();
        newDeck = await loadDeckFromMarkdown(content);
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or Markdown file.');
      }

      const deck: FlashcardDeck = {
        id: uuidv4(),
        name: newDeck.title,
        cards: newDeck.cards,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      };

      const updatedDecks = [...decks, deck];
      setDecks(updatedDecks);
      setSelectedDeckId(deck.id);
      saveDeck(deck);
    } catch (err) {
      console.error('Error processing file:', err);
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsLoading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const selectedDeck = decks.find(deck => deck.id === selectedDeckId);

  return (
    <main className="flex min-h-screen bg-gray-50">
      <Sidebar
        decks={getDeckMetadata(decks)}
        selectedDeckId={selectedDeckId}
        onSelectDeck={setSelectedDeckId}
        onDeleteDeck={(id) => {
          deleteDeck(id);
          const updatedDecks = decks.filter(deck => deck.id !== id);
          setDecks(updatedDecks);
          if (selectedDeckId === id) {
            setSelectedDeckId(updatedDecks[0]?.id || null);
          }
        }}
        onClose={() => setIsSidebarOpen(false)}
        className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      />

      <div className="flex-1 py-12 px-4 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Flashcard App
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Upload a PDF or Markdown file to create your flashcard deck
          </p>
          
          <div className="flex flex-col items-center gap-4 mb-8">
            <Button
              variant="default"
              className="relative overflow-hidden group"
              disabled={isLoading}
              asChild
            >
              <label className="cursor-pointer">
                <span className="relative z-10">
                  {isLoading ? 'Processing...' : 'Choose File'}
                </span>
                <input
                  type="file"
                  accept=".pdf,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isLoading}
                />
                <motion.div
                  className="absolute inset-0 bg-blue-600"
                  initial={false}
                  animate={{ scale: isLoading ? 1 : 1.1 }}
                  transition={{
                    duration: 0.3,
                    repeat: isLoading ? 0 : Infinity,
                    repeatType: "reverse"
                  }}
                  style={{ opacity: 0.1 }}
                />
              </label>
            </Button>

            <Button
              variant="link"
              asChild
              className="text-blue-500 hover:text-blue-600"
            >
              <a href="/decks/sample-deck.md" download>
                Download sample deck
              </a>
            </Button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-sm"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showApiKeyInstructions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200 text-left"
              >
                <h2 className="text-lg font-semibold mb-4">Setup Instructions</h2>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Create a file named <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> in your project root</li>
                  <li>Add the following line to the file:
                    <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                      NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
                    </pre>
                  </li>
                  <li>Replace <code className="bg-gray-100 px-2 py-1 rounded">your_gemini_api_key</code> with your actual Gemini API key</li>
                  <li>Restart the development server</li>
                </ol>
                <p className="mt-4 text-sm text-gray-600">
                  You can get a Gemini API key from the{' '}
                  <a 
                    href="https://makersuite.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Google AI Studio
                  </a>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedDeck && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col justify-center w-full max-w-4xl"
            >
              <FlashCardDeck 
                cards={selectedDeck.cards} 
                deckId={selectedDeck.id}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
