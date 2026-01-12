"use client";

import { useState, useMemo } from 'react';
import { useBooks } from '../contexts/BookContext';
import { ChevronLeft, ChevronRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  parseISO,
  isToday
} from 'date-fns';
import { nl } from 'date-fns/locale';
import { cn } from '../lib/utils';
import { useRouter } from 'next/navigation';

export function ReadingCalendar() {
  const { books } = useBooks();
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const today = new Date();

  // Get books with events (start or end dates) for the current month
  const bookEvents = useMemo(() => {
    const events: Record<string, { started: typeof books; finished: typeof books }> = {};
    
    books.forEach(book => {
      if (book.startDate) {
        const dateKey = format(parseISO(book.startDate), 'yyyy-MM-dd');
        if (!events[dateKey]) events[dateKey] = { started: [], finished: [] };
        events[dateKey].started.push(book);
      }
      if (book.endDate) {
        const dateKey = format(parseISO(book.endDate), 'yyyy-MM-dd');
        if (!events[dateKey]) events[dateKey] = { started: [], finished: [] };
        events[dateKey].finished.push(book);
      }
    });
    
    return events;
  }, [books]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Calculate padding for first week (Monday = 0)
  const startDayOfWeek = monthStart.getDay();
  const paddingDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const weekDays = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <section className="mb-8">
      <h2 className="font-serif text-xl font-medium mb-4">Leesgeschiedenis</h2>
      
      <div className="book-card">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPreviousMonth}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h3 className="font-serif text-lg font-semibold capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: nl })}
          </h3>
          
          <button
            onClick={goToNextMonth}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Week Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs text-muted-foreground font-medium py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Padding for days before month starts */}
          {Array.from({ length: paddingDays }).map((_, i) => (
            <div key={`pad-${i}`} className="min-h-[72px]" />
          ))}
          
          {/* Actual days */}
          {monthDays.map(day => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayEvents = bookEvents[dateKey];
            const isTodayDate = isToday(day);
            const hasEvents = dayEvents && (dayEvents.started.length > 0 || dayEvents.finished.length > 0);
            
            return (
              <div
                key={dateKey}
                className={cn(
                  "min-h-[72px] rounded-lg p-1 transition-colors",
                  isTodayDate && "bg-primary/10 ring-1 ring-primary/30",
                  !isTodayDate && hasEvents && "bg-secondary/50"
                )}
              >
                {/* Day Number */}
                <div className={cn(
                  "text-xs font-medium text-center mb-1",
                  isTodayDate && "text-primary",
                  !isSameMonth(day, currentMonth) && "text-muted-foreground/40"
                )}>
                  {format(day, 'd')}
                </div>
                
                {/* Book Covers */}
                {hasEvents && (
                  <div className="space-y-1">
                    {/* Started books */}
                    {dayEvents.started.slice(0, 1).map(book => (
                      <button
                        key={`start-${book.id}`}
                        onClick={() => router.push(`/LoveableAI/book/${book.id}`)}
                        className="w-full group relative"
                      >
                        <div className="relative">
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-full h-7 object-cover rounded shadow-sm group-hover:shadow-md transition-shadow"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/book-placeholder.png';
                            }}
                          />
                          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-accent rounded-full flex items-center justify-center shadow-sm">
                            <BookOpen className="w-2 h-2 text-accent-foreground" />
                          </div>
                        </div>
                      </button>
                    ))}
                    
                    {/* Finished books */}
                    {dayEvents.finished.slice(0, 1).map(book => (
                      <button
                        key={`end-${book.id}`}
                        onClick={() => router.push(`/LoveableAI/book/${book.id}`)}
                        className="w-full group relative"
                      >
                        <div className="relative">
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-full h-7 object-cover rounded shadow-sm group-hover:shadow-md transition-shadow"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/book-placegolder.png';
                            }}
                          />
                          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary rounded-full flex items-center justify-center shadow-sm">
                            <CheckCircle2 className="w-2 h-2 text-primary-foreground" />
                          </div>
                        </div>
                      </button>
                    ))}
                    
                    {/* More indicator */}
                    {(dayEvents.started.length + dayEvents.finished.length) > 2 && (
                      <div className="text-[9px] text-center text-muted-foreground">
                        +{(dayEvents.started.length + dayEvents.finished.length) - 2}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
              <BookOpen className="w-2 h-2 text-accent-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">Gestart</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-2 h-2 text-primary-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">Uitgelezen</span>
          </div>
        </div>
      </div>
    </section>
  );
}
