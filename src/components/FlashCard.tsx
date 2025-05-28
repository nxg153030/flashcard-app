import { useState } from 'react';
import { cn } from '../utils/cn';
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface FlashCardProps {
  question: string;
  answer: string;
  showAnswer: boolean;
  onFlip: () => void;
}

export function FlashCard({ question, answer, showAnswer, onFlip }: FlashCardProps) {
  return (
    <div
      className="w-full aspect-[4/3] perspective-1000 cursor-pointer"
      onClick={onFlip}
    >
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: showAnswer ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Question Side */}
        <div
          className={`absolute inset-0 backface-hidden bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center overflow-hidden ${
            showAnswer ? "invisible" : ""
          }`}
        >
          <div className="flex-grow flex items-center justify-center w-full">
            <div 
              className="prose prose-lg max-w-none w-full"
              dangerouslySetInnerHTML={{ __html: question }}
            />
          </div>
          <div className="mt-4 pt-2 text-sm text-gray-400 border-t w-full">
            Click to reveal answer
          </div>
        </div>

        {/* Answer Side */}
        <div
          className={`absolute inset-0 backface-hidden bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center overflow-hidden ${
            !showAnswer ? "invisible" : ""
          }`}
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="flex-grow flex items-center justify-center w-full">
            <div 
              className="prose prose-lg max-w-none w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-4"
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          </div>
          <div className="mt-4 pt-2 text-sm text-gray-400 border-t w-full">
            Click to show question
          </div>
        </div>
      </motion.div>
    </div>
  );
} 