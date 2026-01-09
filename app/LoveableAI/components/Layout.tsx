"use client";

import { ReactNode } from 'react';
import { SearchBar } from './SearchBar';
import { BottomNav } from './BottomNav';
import BookSearchBar from '@/app/components/BookSearchBar';

interface LayoutProps {
  children: ReactNode;
  showSearch?: boolean;
  title?: string;
  
}

export function Layout({ children, showSearch = true, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg safe-top">
        <div className="px-4 pt-4 pb-3 max-w-md mx-auto">
          {title && (
            <h1 className="font-serif text-2xl font-bold text-foreground mb-3">{title}</h1>
          )}
          {showSearch && <BookSearchBar />}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pb-24 max-w-md mx-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
