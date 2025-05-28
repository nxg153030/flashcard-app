import { useState } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FolderIcon, TrashIcon } from '@heroicons/react/24/outline';
import { DeckMetadata } from '@/types/flashcard';

interface SwipeableDeckItemProps {
  deck: DeckMetadata;
  isSelected: boolean;
  onSelect: (deckId: string) => void;
  onDelete: (deckId: string) => void;
}

export function SwipeableDeckItem({
  deck,
  isSelected,
  onSelect,
  onDelete
}: SwipeableDeckItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const controls = useAnimation();
  const deleteThreshold = -75;

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    
    if (offset < deleteThreshold) {
      await controls.start({ x: deleteThreshold });
      setShowDeleteButton(true);
    } else {
      await controls.start({ x: 0 });
      setShowDeleteButton(false);
    }
    
    setIsDragging(false);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    await controls.start({ 
      x: -200,
      opacity: 0,
      transition: { duration: 0.2 }
    });
    
    onDelete(deck.id);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Delete Background */}
      <div className="absolute inset-y-0 right-0 bg-red-500/10 w-20 flex items-center justify-center">
        <motion.div
          animate={{ 
            opacity: showDeleteButton ? 1 : 0,
            scale: showDeleteButton ? 1 : 0.8
          }}
          transition={{ duration: 0.2 }}
          className="cursor-pointer p-2 rounded-full hover:bg-red-500/20 active:bg-red-500/30"
          onClick={handleDelete}
        >
          <TrashIcon className="h-5 w-5 text-red-500" />
        </motion.div>
      </div>

      {/* Swipeable Item */}
      <motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{ right: 0, left: deleteThreshold }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="relative bg-white"
      >
        <div 
          className={`w-full p-2 flex items-center gap-2 ${isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'} ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'}`}
          onClick={() => !isDragging && onSelect(deck.id)}
        >
          <FolderIcon className="h-4 w-4 text-gray-500" />
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{deck.name}</div>
            <div className="text-xs text-gray-500">{deck.cardCount} cards</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 