import { Book as BaseBook } from '@/app/types/books';

export type BookStatus = 'reading' | 'want-to-read' | 'finished' | 'stopped';

export interface Book extends BaseBook {
  status: BookStatus;
  author: string; // First author from authors array
  coverUrl: string; // Generated from coverId
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  tags?: string[]; // Alias for genres
  publishedYear?: number; // Alias for publishYear
}

export const statusLabels: Record<BookStatus, string> = {
  'reading': 'Aan het lezen',
  'want-to-read': 'Wil nog lezen',
  'finished': 'Gelezen',
  'stopped': 'Gestopt',
};

export const genreEmojis: Record<string, string[]> = {
  'fiction': ['📖', '✨', '🎭'],
  'non-fiction': ['📚', '💡', '🔍'],
  'mystery': ['🔍', '🕵️', '❓'],
  'romance': ['💕', '🌹', '💋'],
  'sci-fi': ['🚀', '👽', '🌌'],
  'fantasy': ['🧙', '🐉', '⚔️'],
  'literary': ['📚', '✨', '🎨'],
};

// Helper to convert BaseBook to Book with status
export function toBookWithStatus(baseBook: BaseBook, status: BookStatus = 'want-to-read', startDate?: string, endDate?: string): Book {
  return {
    ...baseBook,
    status,
    author: baseBook.authors[0] || 'Unknown',
    coverUrl: baseBook.coverId 
      ? `https://covers.openlibrary.org/b/id/${baseBook.coverId}-M.jpg`
      : '/book-placeholder.png',
    startDate,
    endDate,
    tags: baseBook.genres,
    publishedYear: baseBook.publishYear,
  };
}
