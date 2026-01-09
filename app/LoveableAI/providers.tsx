"use client";

import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { BookProvider } from "./contexts/BookContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <BookProvider>
        {children}
        <Toaster />
        <Sonner position="top-center" />
      </BookProvider>
    </TooltipProvider>
  );
}
