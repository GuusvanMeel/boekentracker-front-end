"use client";

import { useState, useCallback } from 'react';
import { Book, genreEmojis } from '../types/book';
import { useBooks } from '../contexts/BookContext';
import { Button } from './ui/button';
import { Shuffle, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';

interface ConfettiPiece {
  id: number;
  emoji: string;
  left: number;
  delay: number;
  duration: number;
}

export function SpinWheel() {
  const { getBooksByStatus, startReading } = useBooks();
  const wantToReadBooks = getBooksByStatus('want-to-read');
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [showResult, setShowResult] = useState(false);

  const createConfetti = useCallback((book: Book) => {
    const genre = book.genres[0] || 'literary';
    const emojis = genreEmojis[genre] || ['📚', '✨', '🎉'];
    
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < 20; i++) {
      pieces.push({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
      });
    }
    setConfetti(pieces);
    
    // Clear confetti after animation
    setTimeout(() => setConfetti([]), 4000);
  }, []);

  const handleSpin = () => {
    if (wantToReadBooks.length === 0 || isSpinning) return;

    setIsSpinning(true);
    setShowResult(false);
    setSelectedBook(null);

    // Randomly select a book
    const randomIndex = Math.floor(Math.random() * wantToReadBooks.length);
    const chosen = wantToReadBooks[randomIndex];

    // Simulate spin animation duration
    setTimeout(() => {
      setSelectedBook(chosen);
      setShowResult(true);
      setIsSpinning(false);
      createConfetti(chosen);
    }, 2000);
  };

  const handleStartReading = () => {
    if (selectedBook) {
      startReading(selectedBook.id);
      setShowResult(false);
      setSelectedBook(null);
    }
  };

  if (wantToReadBooks.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="font-serif text-xl font-medium mb-4">Kies je volgende boek</h2>
        <div className="book-card text-center py-8">
          <Shuffle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Voeg eerst boeken toe aan je "wil nog lezen" lijst
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8 relative">
      <h2 className="font-serif text-xl font-medium mb-4">Kies je volgende boek</h2>
      
      {/* Confetti */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="fixed text-2xl pointer-events-none z-50 confetti"
          style={{
            left: `${piece.left}%`,
            top: '-10%',
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        >
          {piece.emoji}
        </div>
      ))}

      {!showResult ? (
        <div className="book-card">
          {/* Mystery wheel representation */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <div 
              className={cn(
                "w-full h-full rounded-full gradient-wheel shadow-elevated flex items-center justify-center",
                isSpinning && "animate-spin"
              )}
              style={{ animationDuration: '0.5s' }}
            >
              <div className="w-32 h-32 rounded-full bg-linear-to-br from-primary/20 to-primary/5 backdrop-blur-sm flex items-center justify-center">
                <span className="text-4xl">📚</span>
              </div>
            </div>
            
            {/* Decorative circles */}
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary/20 animate-pulse" />
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {wantToReadBooks.length} boeken in je leeslijst
            </p>
            <Button
              onClick={handleSpin}
              disabled={isSpinning}
              className="rounded-2xl h-12 px-8 gradient-hero text-white font-medium shadow-soft hover:shadow-elevated transition-all"
            >
              {isSpinning ? (
                <>Draaiend...</>
              ) : (
                <>
                  <Shuffle className="w-4 h-4 mr-2" />
                  Draai het wiel
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="book-card animate-scale-in">
          {selectedBook && (
            <>
              <div className="text-center mb-6">
                <div className="text-3xl mb-2">🎉</div>
                <h3 className="font-serif text-lg font-medium">Je volgende boek is...</h3>
              </div>
              
              <div className="flex justify-center mb-6">
                <div className="w-32 h-48 rounded-xl overflow-hidden shadow-elevated animate-bounce-subtle">
                  <img
                    src={selectedBook.coverUrl}
                    alt={selectedBook.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="text-center mb-6">
                <h4 className="font-serif text-xl font-medium mb-1">{selectedBook.title}</h4>
                <p className="text-muted-foreground">{selectedBook.author}</p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResult(false);
                    setSelectedBook(null);
                  }}
                  className="flex-1 rounded-xl h-12"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Opnieuw draaien
                </Button>
                <Button
                  onClick={handleStartReading}
                  className="flex-1 rounded-xl h-12 gradient-hero text-white"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Beginnen met lezen
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
