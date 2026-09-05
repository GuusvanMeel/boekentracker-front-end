"use client";

import { useBooks } from '../contexts/BookContext';
import { BookCard } from './BookCard';
import { QuickActions } from './QuickActions';


export function CurrentBooks() {
  const { getBooksByStatus} = useBooks();
  const readingBooks = getBooksByStatus('reading');


  if (readingBooks.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="font-serif text-xl font-medium mb-4">Huidige boeken</h2>
        <div className="book-card text-center py-8">
          <p className="text-muted-foreground mb-2">Je leest momenteel geen boeken</p>
          <p className="text-sm text-muted-foreground">
            Gebruik het draaiwiel om je volgende boek te kiezen!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl font-medium">Huidige boeken</h2>
      </div>
      <div className="space-y-4">
        {readingBooks.map((book) => (
          <div key={book.id} className="book-card p-0 overflow-hidden">
            <BookCard book={book} showStatus={false} />
            <div className="px-4 pb-4">
              <QuickActions book={book} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
