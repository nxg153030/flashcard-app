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
          className={`absolute inset-0 backface-hidden bg-white rounded-xl shadow-lg p-8 flex flex-col ${
            showAnswer ? "invisible" : ""
          }`}
        >
          <div className="flex-1 min-h-0 flex flex-col">
            <div 
              className="prose prose-lg max-w-none w-full flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-4"
              dangerouslySetInnerHTML={{ __html: question }}
            />
          </div>
          <div className="mt-4 pt-2 text-sm text-gray-400 border-t w-full text-center">
            Click to reveal answer
          </div>
        </div>

        {/* Answer Side */}
        <div
          className={`absolute inset-0 backface-hidden bg-white rounded-xl shadow-lg p-8 flex flex-col ${
            !showAnswer ? "invisible" : ""
          }`}
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="flex-1 min-h-0 flex flex-col">
            <div 
              className="prose prose-lg max-w-none w-full flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-4"
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          </div>
          <div className="mt-4 pt-2 text-sm text-gray-400 border-t w-full text-center">
            Click to show question
          </div>
        </div>
      </motion.div>
    </div>
  );
} 