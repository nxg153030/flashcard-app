import { DeckMetadata } from '@/types/flashcard';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { SwipeableDeckItem } from './SwipeableDeckItem';

interface SidebarProps {
  decks: DeckMetadata[];
  selectedDeckId: string | null;
  onSelectDeck: (deckId: string) => void;
  onDeleteDeck: (deckId: string) => void;
  onClose?: () => void;
  className?: string;
}

export function Sidebar({
  decks,
  selectedDeckId,
  onSelectDeck,
  onDeleteDeck,
  onClose,
  className
}: SidebarProps) {
  return (
    <div className={cn('w-64 bg-white border-r border-gray-200 flex flex-col', className)}>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">Your Decks</h2>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <XMarkIcon className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {decks.length === 0 ? (
            <div className="text-center py-8 px-4">
              <p className="text-sm text-gray-500">No decks yet</p>
              <p className="text-xs text-gray-400 mt-1">Upload a Markdown file to create your first deck</p>
            </div>
          ) : (
            <div className="space-y-1">
              {decks.map((deck) => (
                <SwipeableDeckItem
                  key={deck.id}
                  deck={deck}
                  isSelected={selectedDeckId === deck.id}
                  onSelect={onSelectDeck}
                  onDelete={onDeleteDeck}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
} 