import { useState, useEffect } from 'react';
import { FlashCard } from './FlashCard';
import { Flashcard } from '@/types/flashcard';
import { shuffle } from '@/utils/array';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ArrowPathIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from "framer-motion";

interface FlashCardDeckProps {
  cards: Flashcard[];
  deckId: string;
}

export function FlashCardDeck({ cards, deckId }: FlashCardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Initialize or reset the deck
  useEffect(() => {
    setShuffledCards(shuffle(cards));
    setCurrentIndex(0);
    setShowAnswer(false);
    setIsFlipped(false);
    setIsTransitioning(false);
  }, [cards, deckId]);

  const handleNext = () => {
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const handleShuffle = () => {
    setShuffledCards(shuffle(cards));
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  if (shuffledCards.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No cards in this deck
      </div>
    );
  }

  const currentCard = shuffledCards[currentIndex];
  const progress = ((currentIndex + 1) / shuffledCards.length) * 100;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${deckId}-${currentIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl px-4"
        >
          <div className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {currentCard && (
              <FlashCard
                question={currentCard.question}
                answer={currentCard.answer}
                showAnswer={showAnswer}
                onFlip={toggleAnswer}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="w-full max-w-md space-y-4 px-4">
        <Progress value={progress} className="h-2" />
        
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={currentIndex === 0 || isTransitioning}
            className="h-10 w-10"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>

          <HoverCard>
            <HoverCardTrigger>
              <div className="min-w-[4rem] text-center">
                <span className="text-lg font-medium text-gray-700">
                  {currentIndex + 1} / {shuffledCards.length}
                </span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="text-sm">
              Card {currentIndex + 1} of {shuffledCards.length}
              <div className="mt-1 text-gray-500">
                {Math.round(progress)}% complete
              </div>
            </HoverCardContent>
          </HoverCard>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex === shuffledCards.length - 1 || isTransitioning}
            className="h-10 w-10"
          >
            <ArrowRightIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleShuffle}
            disabled={isTransitioning}
            className="h-10 w-10 ml-2"
          >
            <ArrowPathIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 