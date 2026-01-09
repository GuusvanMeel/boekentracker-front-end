"use client";

import { Book, statusLabels } from '../types/book';
import Link from 'next/link';
import { cn } from '../lib/utils';

interface BookCardProps {
  book: Book;
  showStatus?: boolean;
  compact?: boolean;
}

export function BookCard({ book, showStatus = true, compact = false }: BookCardProps) {

  const statusClass = {
    reading: 'status-reading',
    'want-to-read': 'status-want-to-read',
    finished: 'status-finished',
    stopped: 'status-stopped',
  }[book.status];

  return (
    <Link
      href={`/LoveableAI/book/${book.id}`}
      className={cn(
        "book-card cursor-pointer flex gap-4 animate-fade-in",
        compact ? "p-3" : "p-4"
      )}
    >
      <div className={cn(
        "flex-shrink-0 rounded-lg overflow-hidden shadow-soft",
        compact ? "w-16 h-24" : "w-20 h-28"
      )}>
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x112?text=📚';
          }}
        />
      </div>
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <h3 className={cn(
          "font-serif font-medium text-foreground truncate",
          compact ? "text-sm" : "text-base"
        )}>
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground truncate">{book.author}</p>
        {showStatus && (
          <span className={cn("status-badge mt-2 w-fit", statusClass)}>
            {statusLabels[book.status]}
          </span>
        )}
      </div>
    </Link>
  );
}
