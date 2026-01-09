"use client";

import { Home, Shuffle, CalendarDays, Library } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';

const navItems = [
  { path: '/LoveableAI', icon: Home, label: 'Home' },
  { path: '/LoveableAI/wheel', icon: Shuffle, label: 'Wiel' },
  { path: '/LoveableAI/calendar', icon: CalendarDays, label: 'Kalender' },
  { path: '/LoveableAI/library', icon: Library, label: 'Bibliotheek' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border safe-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = pathname === path;
          
          return (
            <Link
              key={path}
              href={path}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "animate-bounce-subtle")} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
