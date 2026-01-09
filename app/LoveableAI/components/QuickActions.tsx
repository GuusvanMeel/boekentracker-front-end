"use client";

import { Book } from '../types/book';
import { useBooks } from '../contexts/BookContext';
import { Button } from './ui/button';
import { Check, X, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface QuickActionsProps {
  book: Book;
}

export function QuickActions({ book }: QuickActionsProps) {
  const { markAsFinished, markAsStopped } = useBooks();

  const handleFinished = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAsFinished(book.id);
    toast.success(`"${book.title}" gemarkeerd als uitgelezen! 🎉`);
  };

  const handleStopped = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAsStopped(book.id);
    toast.info(`"${book.title}" gemarkeerd als gestopt`);
  };

  return (
    <div className="flex gap-2 mt-3">
      <Button
        size="sm"
        variant="outline"
        onClick={handleFinished}
        className="flex-1 rounded-xl text-xs h-9 border-finished/30 text-finished hover:bg-finished hover:text-finished-foreground transition-colors"
      >
        <Check className="w-3 h-3 mr-1" />
        Uitgelezen
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={handleStopped}
        className="flex-1 rounded-xl text-xs h-9 border-stopped/30 text-stopped hover:bg-stopped hover:text-stopped-foreground transition-colors"
      >
        <X className="w-3 h-3 mr-1" />
        Gestopt
      </Button>
    </div>
  );
}
