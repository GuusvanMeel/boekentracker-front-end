"use client";

import { useState } from 'react';
import { Layout } from '../components/Layout';
import { useBooks } from '../contexts/BookContext';
import { BookCard } from '../components/BookCard';
import { BookStatus, statusLabels } from '../types/book';
import { cn } from '../lib/utils';

const statusFilters: { value: BookStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Alles' },
  { value: 'reading', label: 'Aan het lezen' },
  { value: 'want-to-read', label: 'Wil nog lezen' },
  { value: 'finished', label: 'Gelezen' },
  { value: 'stopped', label: 'Gestopt' },
];

export default function LibraryPage() {
  const { books } = useBooks();
  const [activeFilter, setActiveFilter] = useState<BookStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = books.filter((book) => {
    const matchesStatus = activeFilter === 'all' || book.status === activeFilter;
    const matchesSearch = searchQuery === '' || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <Layout title="Bibliotheek">
      <div className="py-4">
        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {statusFilters.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setActiveFilter(value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                activeFilter === value
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-card text-muted-foreground hover:bg-secondary"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Book Count */}
        <p className="text-sm text-muted-foreground mb-4">
          {filteredBooks.length} {filteredBooks.length === 1 ? 'boek' : 'boeken'}
        </p>

        {/* Books List */}
        {filteredBooks.length === 0 ? (
          <div className="book-card text-center py-12">
            <p className="text-muted-foreground">Geen boeken gevonden</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
