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

export default function Home() {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Reset all state and local storage
  const resetState = () => {
    localStorage.clear(); // Clear all local storage
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
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const { title, cards } = await loadDeckFromMarkdown(content);
      const timestamp = Date.now();
      const newDeck: FlashcardDeck = {
        id: `${file.name}-${timestamp}`,
        name: title || file.name.replace('.md', ''),
        cards,
        createdAt: new Date(timestamp).toISOString(),
        lastModified: new Date(timestamp).toISOString(),
      };
      
      setDecks(prevDecks => {
        const updatedDecks = [...prevDecks, newDeck];
        saveDeck(newDeck);
        return updatedDecks;
      });
      
      setSelectedDeckId(newDeck.id);
      setError('');

      // Reset the file input to allow re-uploading the same file
      event.target.value = '';
    } catch (err) {
      setError('Error loading deck. Please ensure the file is a valid Markdown file with the correct format.');
    }
  };

  const handleDeleteDeck = (deckId: string) => {
    setDecks(prevDecks => {
      const updatedDecks = prevDecks.filter(d => d.id !== deckId);
      
      // If we're deleting the currently selected deck, select another one
      if (selectedDeckId === deckId) {
        if (updatedDecks.length > 0) {
          setSelectedDeckId(updatedDecks[0].id);
        } else {
          setSelectedDeckId(null);
        }
      }
      
      // Update local storage
      deleteDeck(deckId);
      return updatedDecks;
    });
  };

  const selectedDeck = decks.find(deck => deck.id === selectedDeckId);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex">
      {/* Mobile Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Bars3Icon className="h-6 w-6" />
      </Button>

      {/* Reset Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 right-4 z-50"
        onClick={resetState}
      >
        Reset App
      </Button>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-y-0 left-0 z-40 lg:relative"
          >
            <Sidebar
              decks={getDeckMetadata(decks)}
              selectedDeckId={selectedDeckId}
              onSelectDeck={setSelectedDeckId}
              onDeleteDeck={handleDeleteDeck}
              onClose={() => setIsSidebarOpen(false)}
              className="h-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
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
            Upload a Markdown file with question-answer pairs to create your flashcard deck
          </p>
          
          <div className="flex flex-col items-center gap-4 mb-8">
            <Button
              variant="default"
              className="relative overflow-hidden group"
              asChild
            >
              <label className="cursor-pointer">
                <span className="relative z-10">Choose Markdown File</span>
                <input
                  type="file"
                  accept=".md"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <motion.div
                  className="absolute inset-0 bg-blue-600"
                  initial={false}
                  animate={{ scale: 1.1 }}
                  transition={{
                    duration: 0.3,
                    repeat: Infinity,
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
