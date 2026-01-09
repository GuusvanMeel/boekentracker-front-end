"use client";

import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

type BookResult = {
  id: string;      // "/works/OL....W"
  title: string;
  author: string | null;
  year: number | null;
  coverId: number | null;
};

function useDebouncedValue<T>(value: T, delayMs = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export function SearchBar({ onSearch, placeholder = "Zoek een boek..." }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 250);

  const [items, setItems] = useState<BookResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const abortRef = useRef<AbortController | null>(null);
  const isNavigatingRef = useRef(false);

  // Fetch results when debounced query changes
  useEffect(() => {
    // Don't fetch if we're navigating
    if (isNavigatingRef.current) return;

    const q = debouncedQuery.trim();

    // Reset when query too short
    if (q.length < 2) {
      abortRef.current?.abort();
      setItems([]);
      setLoading(false);
      setActiveIndex(-1);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);

    fetch(`/api/book-search?q=${encodeURIComponent(q)}&limit=8`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return (await r.json()) as { items: BookResult[] };
      })
      .then((data) => {
        if (!isNavigatingRef.current) {
          setItems(data.items ?? []);
          setActiveIndex(-1);
        }
      })
      .catch((e) => {
        if (e?.name !== "AbortError" && !isNavigatingRef.current) {
          setItems([]);
        }
      })
      .finally(() => {
        if (!isNavigatingRef.current) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  function navigateToBook(item: BookResult) {
    // Prevent further API calls
    isNavigatingRef.current = true;
    abortRef.current?.abort();
    
    // Extract the work ID from "/works/OL82563W" → "OL82563W"
    const workId = item.id.split("/").pop();
    
    // Clean up state before navigation
    setOpen(false);
    setQuery("");
    setItems([]);
    setLoading(false);
    
    // Navigate
    router.push(`/LoveableAI/book/${workId}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;

    if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, items.length - 1));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      return;
    }

    if (e.key === "Enter") {
      const item = items[activeIndex];
      if (item) {
        navigateToBook(item);
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setOpen(true);
    onSearch?.(value);
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
      <Input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          // allow clicking results before closing
          setTimeout(() => setOpen(false), 120);
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="pl-10 h-12 rounded-2xl bg-card border-border/50 shadow-soft focus:shadow-elevated transition-shadow"
      />

      {open && query.trim().length > 0 && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 border border-border/50 rounded-2xl bg-card overflow-hidden z-50 shadow-elevated">
          {loading && (
            <div className="p-3 text-sm text-muted-foreground">
              Searching…
            </div>
          )}

          {!loading && query.trim().length < 2 && (
            <div className="p-3 text-sm text-muted-foreground">
              Type 2+ characters…
            </div>
          )}

          {!loading && query.trim().length >= 2 && items.length === 0 && (
            <div className="p-3 text-sm text-muted-foreground">
              No results
            </div>
          )}

          {!loading && items.length > 0 && (
            <ul className="list-none m-0 p-0">
              {items.map((b, idx) => (
                <li
                  key={b.id}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseDown={() => {
                    // onMouseDown so it fires before blur closes dropdown
                    navigateToBook(b);
                  }}
                  className={`p-3 cursor-pointer border-t first:border-t-0 border-border/30 transition-colors ${
                    idx === activeIndex ? 'bg-accent/50' : 'bg-card hover:bg-accent/30'
                  }`}
                >
                  <div className="font-semibold">{b.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {b.author ?? "Unknown author"}
                    {b.year ? ` • ${b.year}` : ""}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}