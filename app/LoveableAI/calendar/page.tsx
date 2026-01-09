"use client";

import { Layout } from '../components/Layout';
import { ReadingCalendar } from '../components/ReadingCalendar';
import { useBooks } from '../contexts/BookContext';
import { BookCard } from '../components/BookCard';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';

export default function CalendarPage() {
  const { books } = useBooks();
  
  // Get recently finished books
  const finishedBooks = books
    .filter((book) => book.status === 'finished' && book.endDate)
    .sort((a, b) => {
      if (!a.endDate || !b.endDate) return 0;
      return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
    })
    .slice(0, 5);

  return (
    <Layout showSearch={false} title="Leesgeschiedenis">
      <div className="py-4">
        <ReadingCalendar />

        {finishedBooks.length > 0 && (
          <section>
            <h2 className="font-serif text-xl font-medium mb-4">
              Recent uitgelezen
            </h2>
            <div className="space-y-3">
              {finishedBooks.map((book) => (
                <div key={book.id} className="book-card">
                  <BookCard book={book} showStatus={false} compact />
                  {book.endDate && (
                    <p className="text-xs text-muted-foreground px-4 pb-3 -mt-2">
                      Uitgelezen op {format(parseISO(book.endDate), 'd MMMM yyyy', { locale: nl })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
