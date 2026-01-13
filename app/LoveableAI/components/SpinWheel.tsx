"use client";

import { useState, useCallback, useRef } from 'react';
import { Book, genreEmojis } from '../types/book';
import { useBooks } from '../contexts/BookContext';
import { Button } from './ui/button';
import { BookOpen, X } from 'lucide-react';
import { WheelOverlay } from '@/app/components/wheelOverlay';
import WinnerWedge from '@/app/components/WinnerWedge';
import dynamic from 'next/dynamic';

const Wheel = dynamic(
  () => import("react-custom-roulette-r19").then((mod) => mod.Wheel),
  { ssr: false }
);

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
  
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showWinner, setShowWinner] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  
  const startY = useRef<number | null>(null);
  const startX = useRef<number | null>(null);
  const triggered = useRef(false);
  const SPIN_SWIPE_PX = 80;
  const MAX_HORIZONTAL_DRIFT = 60;

  // Create wheel data from books
  const data = wantToReadBooks.map((book) => ({
    option: book.title
  }));

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
    
    setTimeout(() => setConfetti([]), 4000);
  }, []);

  const handleSpinClick = () => {
    if (!mustSpin && wantToReadBooks.length > 0) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
      setShowWinner(false);
    }
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    setShowWinner(true);
    const chosen = wantToReadBooks[prizeNumber];
    setSelectedBook(chosen);
    createConfetti(chosen);
  };

  const handleStartReading = () => {
    if (selectedBook) {
      startReading(selectedBook.id);
      setShowWinner(false);
      setSelectedBook(null);
    }
  };

  const handleReset = () => {
    setShowWinner(false);
    setSelectedBook(null);
  };

  if (wantToReadBooks.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="font-serif text-xl font-medium mb-4">Kies je volgende boek</h2>
        <div className="book-card text-center py-8">
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

      <div className="book-card">
        <div>
          <div className="flex justify-center mb-4">
            <div 
              className="relative"
              style={{ width: "100%", maxWidth: "440px", touchAction: "none",
                userSelect: "none", }}
              onPointerDown={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const centerX = rect.width / 2;
                
                // Only activate swipe on the right half
                if (x < centerX) return;
                
                triggered.current = false;
                startY.current = e.clientY;
                startX.current = e.clientX;
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (startY.current == null || startX.current == null) return;
                if (triggered.current) return;
                const dy = e.clientY - startY.current;
                const dx = Math.abs(e.clientX - startX.current);
                if (dy > SPIN_SWIPE_PX && dx < MAX_HORIZONTAL_DRIFT) {
                  triggered.current = true;
                  e.preventDefault(); // Prevent page scroll
                  handleSpinClick();
                } else if (Math.abs(dy) > 5) {
                  // If moving vertically on right side, prevent scroll
                  e.preventDefault();
                }
              }}
              onPointerUp={() => {
                startY.current = null;
                startX.current = null;
                triggered.current = false;
              }}
              onPointerCancel={() => {
                startY.current = null;
                startX.current = null;
                triggered.current = false;
              }}
            
            >
              <div style={{ 
                position: "relative",
                width: "100%",
                paddingBottom: "100%"
              }}>
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  transform: "rotate(44deg)",
                  transformOrigin: "center"
                }}>
                  <Wheel
                    mustStartSpinning={mustSpin}
                    prizeNumber={prizeNumber}
                    data={data}
                    fontSize={10}
                    spinDuration={0.3}
                    backgroundColors={['silver', 'white']}
                    radiusLineWidth={5}
                    radiusLineColor='gray'
                    onStopSpinning={handleStopSpinning}
                    pointerProps={{style:{visibility: "hidden"}}}
                    disableInitialAnimation={true}
                  />
                </div>
                
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  zIndex: 10
                }}>
                  <WheelOverlay totalOptions={wantToReadBooks.length} />
                </div>
              
                {showWinner && selectedBook && (
                  <WinnerWedge 
                    totalOptions={wantToReadBooks.length} 
                    winnerName={data[prizeNumber].option}
                  />
                )}
              </div>
            </div>
          </div>
          
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">
              Swipe down on the right side to spin • {wantToReadBooks.length} boeken in je leeslijst
            </p>
          </div>
        </div>

        {showWinner && selectedBook && (
          <div className="mt-6 pt-6 border-t animate-scale-in">
            <div className="text-center mb-6">
              <div className="text-3xl mb-2">🎉</div>
              <h3 className="font-serif text-lg font-medium mb-4">Je volgende boek is...</h3>
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
                onClick={handleReset}
                className="flex-1 rounded-xl h-12"
              >
                <X className="w-4 h-4 mr-2" />
                Sluiten
              </Button>
              <Button
                onClick={handleStartReading}
                className="flex-1 rounded-xl h-12 gradient-hero text-white"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Beginnen met lezen
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}