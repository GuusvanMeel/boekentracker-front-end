"use client";

import { useParams, useRouter } from 'next/navigation';
import { useBooks } from '../../contexts/BookContext';
import { statusLabels, BookStatus } from '../../types/book';
import { Button } from '../../components/ui/button';
import { ChevronLeft, Check, BookOpen, Pause, RotateCcw, Calendar, BookMarked } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { books, updateBook, markAsFinished, markAsStopped, startReading } = useBooks();

  const id = params.id as string;
  const book = books.find((b) => b.id === id);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Boek niet gevonden</p>
      </div>
    );
  }

  const handleStatusChange = (newStatus: BookStatus) => {
    if (newStatus === 'finished') {
      markAsFinished(book.id);
      toast.success('Gefeliciteerd met het uitgelezen boek! 🎉');
    } else if (newStatus === 'stopped') {
      markAsStopped(book.id);
      toast.info('Boek gemarkeerd als gestopt');
    } else if (newStatus === 'reading') {
      startReading(book.id);
      toast.success('Veel leesplezier! 📖');
    } else {
      updateBook(book.id, { status: newStatus });
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    return format(parseISO(dateStr), 'd MMM yyyy', { locale: nl });
  };

  const getStatusColor = () => {
    switch (book.status) {
      case 'reading': return 'bg-accent text-accent-foreground';
      case 'finished': return 'bg-primary/20 text-primary';
      case 'want-to-read': return 'bg-secondary text-secondary-foreground';
      case 'stopped': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Compact Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-medium text-sm truncate">{book.title}</h1>
            <p className="text-xs text-muted-foreground truncate">{book.author}</p>
          </div>
          <span className={cn("text-xs px-2.5 py-1 rounded-full font-medium", getStatusColor())}>
            {statusLabels[book.status]}
          </span>
        </div>
      </div>

      {/* Book Cover & Quick Info */}
      <div className="px-4 pt-6">
        <div className="flex gap-5">
          {/* Cover */}
          <div className="flex-shrink-0">
            <div className="w-28 h-40 rounded-lg overflow-hidden shadow-lg">
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/112x160?text=📚';
                }}
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex-1 py-1">
            <h2 className="font-serif text-xl font-semibold leading-tight mb-1">{book.title}</h2>
            <p className="text-muted-foreground text-sm mb-4">{book.author}</p>
            
            <div className="space-y-2">
              {book.pageCount && (
                <div className="flex items-center gap-2 text-sm">
                  <BookMarked className="w-4 h-4 text-primary/60" />
                  <span className="text-muted-foreground">{book.pageCount} pagina's</span>
                </div>
              )}
              {book.publishedYear && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary/60" />
                  <span className="text-muted-foreground">{book.publishedYear}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      {book.tags && book.tags.length > 0 && (
        <div className="px-4 pt-4">
          <div className="flex flex-wrap gap-1.5">
            {book.tags.slice(0, 5).map((tag) => (
              <span 
                key={tag} 
                className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Reading Dates Card */}
      <div className="px-4 pt-6">
        <div className="bg-card rounded-2xl p-4 border border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-0.5">Gestart</p>
              <p className="text-sm font-medium">
                {formatDate(book.startDate) || (
                  <span className="text-muted-foreground/50">—</span>
                )}
              </p>
            </div>
            <div className="w-px h-8 bg-border mx-4" />
            <div className="flex-1 text-right">
              <p className="text-xs text-muted-foreground mb-0.5">
                {book.status === 'stopped' ? 'Gestopt' : 'Uitgelezen'}
              </p>
              <p className="text-sm font-medium">
                {formatDate(book.endDate) || (
                  <span className="text-muted-foreground/50">—</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-4 pt-4">
        {book.status === 'reading' && (
          <div className="flex gap-2">
            <Button
              onClick={() => handleStatusChange('finished')}
              className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary/90"
            >
              <Check className="w-4 h-4 mr-2" />
              Uitgelezen
            </Button>
            <Button
              onClick={() => handleStatusChange('stopped')}
              variant="outline"
              className="h-11 w-11 rounded-xl p-0"
            >
              <Pause className="w-4 h-4" />
            </Button>
          </div>
        )}

        {book.status === 'want-to-read' && (
          <Button
            onClick={() => handleStatusChange('reading')}
            className="w-full h-11 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Begin met lezen
          </Button>
        )}

        {(book.status === 'stopped' || book.status === 'finished') && (
          <Button
            onClick={() => handleStatusChange('reading')}
            variant="outline"
            className="w-full h-11 rounded-xl"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Opnieuw lezen
          </Button>
        )}
      </div>

      {/* Description */}
      {book.description && (
        <div className="px-4 pt-6">
          <h3 className="text-sm font-medium mb-2">Over dit boek</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {book.description}
          </p>
        </div>
      )}

      {/* Additional Details */}
      {(book.publisher || book.isbn) && (
        <div className="px-4 pt-6">
          <h3 className="text-sm font-medium mb-3">Details</h3>
          <div className="space-y-2 text-sm">
            {book.publisher && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Uitgever</span>
                <span>{book.publisher}</span>
              </div>
            )}
            {book.isbn && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">ISBN</span>
                <span className="font-mono text-xs">{book.isbn}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
