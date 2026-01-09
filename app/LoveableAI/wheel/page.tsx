"use client";

import { Layout } from '../components/Layout';
import { SpinWheel } from '../components/SpinWheel';
import { useBooks } from '../contexts/BookContext';
import { BookCard } from '../components/BookCard';

export default function WheelPage() {
  const { getBooksByStatus } = useBooks();
  const wantToReadBooks = getBooksByStatus('want-to-read');

  return (
    <Layout showSearch={false} title="Boekenwiel">
      <div className="py-4">
        <SpinWheel />

        {wantToReadBooks.length > 0 && (
          <section>
            <h2 className="font-serif text-xl font-medium mb-4">
              Wil nog lezen ({wantToReadBooks.length})
            </h2>
            <div className="space-y-3">
              {wantToReadBooks.map((book) => (
                <BookCard key={book.id} book={book} showStatus={false} compact />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
