"use client";

import { useParams, useRouter } from 'next/navigation';
import { useBooks } from '../../contexts/BookContext';
import { statusLabels, BookStatus } from '../../types/book';
import { Button } from '../../components/ui/button';
import { ChevronLeft, Check, BookOpen, Pause, RotateCcw, Calendar, BookMarked, Plus } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface ApiBook {
  id: string;
  title: string;
  authors: string[];
  coverId: number | null;
  description: string | null;
  isbn: string | null;
  pageCount: number | null;
  publishYear: number | null;
  publisher: string | null;
  genres: string[];
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { books, updateBook, markAsFinished, markAsStopped, startReading, addBook } = useBooks();
  const [apiBook, setApiBook] = useState<ApiBook | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showStatusSelector, setShowStatusSelector] = useState(false);

  const id = params.id as string;
  const localBook = books.find((b) => b.id === id);

  // Fetch from API if book is not in local list
  useEffect(() => {
    if (!localBook && id) {
      setIsLoading(true);
      setError(false);
      
      const fetchBook = async () => {
        try {
          const url = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/api/book-details/${id}`;
          const response = await fetch(url, { cache: "no-store" });
          
          if (!response.ok) {
            setError(true);
            return;
          }
          
          const data = await response.json();
          if (data.book) {
            setApiBook(data.book);
          } else {
            setError(true);
          }
        } catch (err) {
          console.error("Failed to fetch book:", err);
          setError(true);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchBook();
    }
  }, [id, localBook]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Laden...</p>
      </div>
    );
  }

  // Show error state
  if (error || (!localBook && !apiBook)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Boek niet gevonden</p>
      </div>
    );
  }

  // Determine which book data to use
  const book = localBook || apiBook;
  if (!book) return null;

  const isTrackedBook = !!localBook;
  
  // Get cover URL
  const getCoverUrl = () => {
    if (localBook?.coverUrl) return localBook.coverUrl;
    if (apiBook?.coverId) return `https://covers.openlibrary.org/b/id/${apiBook.coverId}-L.jpg`;
    return '/book-placeholder.png';
  };

  const handleAddBook = async (status: BookStatus) => {
    if (!apiBook) return;

    const newBook: any = {
      id: apiBook.id,
      title: apiBook.title,
      author: apiBook.authors.join(', '),
      authors: apiBook.authors,
      coverUrl: apiBook.coverId ? `https://covers.openlibrary.org/b/id/${apiBook.coverId}-L.jpg` : undefined,
      coverId: apiBook.coverId,
      status,
      pageCount: apiBook.pageCount || undefined,
      publishedYear: apiBook.publishYear || undefined,
      publishYear: apiBook.publishYear,
      publisher: apiBook.publisher || undefined,
      isbn: apiBook.isbn || undefined,
      description: apiBook.description || undefined,
      tags: apiBook.genres?.slice(0, 5) || [],
      genres: apiBook.genres || [],
      startDate: status === 'reading' ? new Date().toISOString() : undefined,
      endDate: undefined,
    };

    await addBook(newBook);
    setShowStatusSelector(false);
    
    const statusMessages = {
      'reading': 'Veel leesplezier! 📖',
      'want-to-read': 'Boek toegevoegd aan je lijst 📚',
      'finished': 'Boek gemarkeerd als uitgelezen 🎉',
      'stopped': 'Boek toegevoegd als gestopt',
    };
    
    toast.success(statusMessages[status]);
  };

  const handleStatusChange = (newStatus: BookStatus) => {
    if (!isTrackedBook) {
      toast.error('Voeg dit boek eerst toe aan je lijst');
      return;
    }
    
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
    if (!isTrackedBook) return 'bg-secondary text-secondary-foreground';
    
    switch (localBook.status) {
      case 'reading': return 'bg-accent text-accent-foreground';
      case 'finished': return 'bg-primary/20 text-primary';
      case 'want-to-read': return 'bg-secondary text-secondary-foreground';
      case 'stopped': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const displayTitle = localBook?.title || apiBook?.title || '';
  const displayAuthor = localBook?.author || apiBook?.authors?.join(', ') || '';
  const displayPageCount = localBook?.pageCount || apiBook?.pageCount;
  const displayYear = localBook?.publishedYear || apiBook?.publishYear;
  const displayDescription = localBook?.description || apiBook?.description;
  const displayPublisher = localBook?.publisher || apiBook?.publisher;
  const displayIsbn = localBook?.isbn || apiBook?.isbn;
  const displayTags = localBook?.tags || apiBook?.genres?.slice(0, 5) || [];

  const statusOptions = [
    { value: 'reading' as BookStatus, label: 'Begin met lezen', icon: BookOpen, color: 'bg-accent hover:bg-accent/90 text-accent-foreground' },
    { value: 'want-to-read' as BookStatus, label: 'Wil lezen', icon: BookMarked, color: 'bg-secondary hover:bg-secondary/90' },
    { value: 'finished' as BookStatus, label: 'Uitgelezen', icon: Check, color: 'bg-primary/20 hover:bg-primary/30 text-primary' },
    { value: 'stopped' as BookStatus, label: 'Gestopt', icon: Pause, color: 'bg-muted hover:bg-muted/90 text-muted-foreground' },
  ];

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
            <h1 className="font-medium text-sm truncate">{displayTitle}</h1>
            <p className="text-xs text-muted-foreground truncate">{displayAuthor}</p>
          </div>
          {isTrackedBook && (
            <span className={cn("text-xs px-2.5 py-1 rounded-full font-medium", getStatusColor())}>
              {statusLabels[localBook.status]}
            </span>
          )}
        </div>
      </div>

      {/* Book Cover & Quick Info */}
      <div className="px-4 pt-6">
        <div className="flex gap-5">
          {/* Cover */}
          <div className="shrink-0">
            <div className="w-28 h-40 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={getCoverUrl()}
                alt={displayTitle}
                width={28}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex-1 py-1">
            <h2 className="font-serif text-xl font-semibold leading-tight mb-1">{displayTitle}</h2>
            <p className="text-muted-foreground text-sm mb-4">{displayAuthor}</p>
            
            <div className="space-y-2">
              {displayPageCount && (
                <div className="flex items-center gap-2 text-sm">
                  <BookMarked className="w-4 h-4 text-primary/60" />
                  <span className="text-muted-foreground">{displayPageCount} pagina's</span>
                </div>
              )}
              {displayYear && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary/60" />
                  <span className="text-muted-foreground">{displayYear}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      {displayTags.length > 0 && (
        <div className="px-4 pt-4">
          <div className="flex flex-wrap gap-1.5">
            {displayTags.map((tag) => (
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

      {/* Add Book Section - Only show for non-tracked books */}
      {!isTrackedBook && (
        <div className="px-4 pt-6">
          {!showStatusSelector ? (
            <Button
              onClick={() => setShowStatusSelector(true)}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-base font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Voeg toe aan mijn lijst
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Selecteer status</p>
                <Button
                  onClick={() => setShowStatusSelector(false)}
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                >
                  Annuleer
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={option.value}
                      onClick={() => handleAddBook(option.value)}
                      className={cn("h-16 rounded-xl flex flex-col gap-1 transition-all", option.color)}
                      variant="outline"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{option.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reading Dates Card - Only show for tracked books */}
      {isTrackedBook && (
        <div className="px-4 pt-6">
          <div className="bg-card rounded-2xl p-4 border border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-0.5">Gestart</p>
                <p className="text-sm font-medium">
                  {formatDate(localBook.startDate) || (
                    <span className="text-muted-foreground/50">—</span>
                  )}
                </p>
              </div>
              <div className="w-px h-8 bg-border mx-4" />
              <div className="flex-1 text-right">
                <p className="text-xs text-muted-foreground mb-0.5">
                  {localBook.status === 'stopped' ? 'Gestopt' : 'Uitgelezen'}
                </p>
                <p className="text-sm font-medium">
                  {formatDate(localBook.endDate) || (
                    <span className="text-muted-foreground/50">—</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Button - Only show for tracked books */}
      {isTrackedBook && (
        <div className="px-4 pt-4">
          {localBook.status === 'reading' && (
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

          {localBook.status === 'want-to-read' && (
            <Button
              onClick={() => handleStatusChange('reading')}
              className="w-full h-11 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Begin met lezen
            </Button>
          )}

          {(localBook.status === 'stopped' || localBook.status === 'finished') && (
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
      )}

      {/* Description */}
      {displayDescription && (
        <div className="px-4 pt-6">
          <h3 className="text-sm font-medium mb-2">Over dit boek</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {displayDescription}
          </p>
        </div>
      )}

      {/* Additional Details */}
      {(displayPublisher || displayIsbn) && (
        <div className="px-4 pt-6">
          <h3 className="text-sm font-medium mb-3">Details</h3>
          <div className="space-y-2 text-sm">
            {displayPublisher && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Uitgever</span>
                <span>{displayPublisher}</span>
              </div>
            )}
            {displayIsbn && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">ISBN</span>
                <span className="font-mono text-xs">{displayIsbn}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}