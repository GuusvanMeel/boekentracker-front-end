"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, BookStatus, toBookWithStatus } from '../types/book';
import type { Book as BaseBook } from '@/app/types/books';

interface BookContextType {
  books: Book[];
  addBook: (book: Book) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  removeBook: (id: string) => void;
  getBooksByStatus: (status: BookStatus) => Book[];
  markAsFinished: (id: string) => void;
  markAsStopped: (id: string) => void;
  markAsNotReadToday: () => void;
  startReading: (id: string) => void;
  loading: boolean;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

// Helper to map API status to BookStatus
function mapStatusToBookStatus(status: string): BookStatus {
  switch (status) {
    case 'READING': return 'reading';
    case 'WANT': return 'want-to-read';
    case 'READ': return 'finished';
    case 'STOPPED': return 'stopped';
    default: return 'want-to-read';
  }
}

// Helper to map BookStatus to API status
function mapBookStatusToApiStatus(status: BookStatus): string {
  switch (status) {
    case 'reading': return 'READING';
    case 'want-to-read': return 'WANT';
    case 'finished': return 'READ';
    case 'stopped': return 'STOPPED';
    default: return 'WANT';
  }
}

export function BookProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch books from API on mount
  useEffect(() => {
    async function fetchBooks() {
      try {
        // TODO: Replace with actual userId from auth/session
        const userId = 'temp-user-id'; // This should come from your auth system
        const response = await fetch(`/api/user-books?userId=${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          const userBooks = data.items || [];
          
          // Fetch book details for each user book
          const booksWithDetails = await Promise.all(
            userBooks.map(async (userBook: any) => {
              try {
                const workId = userBook.bookKey?.replace('/works/', '') || userBook.bookKey;
                const bookResponse = await fetch(`/api/book-details/${workId}`);
                
                if (bookResponse.ok) {
                  const bookData = await bookResponse.json();
                  const baseBook = bookData.book as BaseBook;
                  
                  if (baseBook) {
                    return toBookWithStatus(
                      baseBook,
                      mapStatusToBookStatus(userBook.status || 'WANT'),
                      userBook.startDate,
                      userBook.endDate
                    );
                  }
                }
              } catch (error) {
                console.error('Error fetching book details:', error);
              }
              return null;
            })
          );
          
          setBooks(booksWithDetails.filter((b): b is Book => b !== null));
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBooks();
  }, []);

  const addBook = async (book: Book) => {
    setBooks((prev) => [...prev, book]);
    
    // Update API
    try {
      const userId = 'temp-user-id'; // TODO: Get from auth
      await fetch('/api/user-books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          bookKey: book.id.startsWith('/works/') ? book.id : `/works/${book.id}`,
          status: mapBookStatusToApiStatus(book.status),
        }),
      });
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    setBooks((prev) =>
      prev.map((book) => (book.id === id ? { ...book, ...updates } : book))
    );
    
    // Update API
    try {
      const userId = 'temp-user-id'; // TODO: Get from auth
      const book = books.find(b => b.id === id);
      if (book) {
        await fetch('/api/user-books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            bookKey: book.id.startsWith('/works/') ? book.id : `/works/${book.id}`,
            status: mapBookStatusToApiStatus(updates.status || book.status),
          }),
        });
      }
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const removeBook = (id: string) => {
    setBooks((prev) => prev.filter((book) => book.id !== id));
    // TODO: Add API call to remove book
  };

  const getBooksByStatus = (status: BookStatus) => {
    return books.filter((book) => book.status === status);
  };

  const markAsFinished = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    updateBook(id, { status: 'finished', endDate: today });
  };

  const markAsStopped = (id: string) => {
    updateBook(id, { status: 'stopped' });
  };

  const markAsNotReadToday = () => {
    // This could trigger a notification or update a reading streak
    console.log('Marked as not read today for all active books');
  };

  const startReading = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    updateBook(id, { status: 'reading', startDate: today, endDate: undefined });
  };

  return (
    <BookContext.Provider
      value={{
        books,
        addBook,
        updateBook,
        removeBook,
        getBooksByStatus,
        markAsFinished,
        markAsStopped,
        markAsNotReadToday,
        startReading,
        loading,
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
}
