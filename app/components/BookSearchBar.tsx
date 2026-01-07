"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function BookSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 250);

  const [items, setItems] = useState<BookResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const abortRef = useRef<AbortController | null>(null);

  // Fetch results when debounced query changes
  useEffect(() => {
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
        setItems(data.items ?? []);
        setActiveIndex(-1);
      })
      .catch((e) => {
        if (e?.name !== "AbortError") {
          setItems([]);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [debouncedQuery]);

  function navigateToBook(item: BookResult) {
    // Extract the work ID from "/works/OL82563W" → "OL82563W"
    const workId = item.id.split("/").pop();
    router.push(`/books/${workId}`);
    setOpen(false);
    setQuery(""); // Optional: clear search after selection
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

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 520 }}>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          // allow clicking results before closing
          setTimeout(() => setOpen(false), 120);
        }}
        onKeyDown={onKeyDown}
        placeholder="Search books..."
        style={{
          width: "100%",
          padding: "10px 12px",
          border: "1px solid #ccc",
          borderRadius: 6,
        }}
      />

      {open && query.trim().length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            border: "1px solid #ddd",
            borderRadius: 6,
            background: "white",
            color: "#111",
            overflow: "hidden",
            zIndex: 50,
          }}
        >
          {loading && (
            <div style={{ padding: 10, fontSize: 14, opacity: 0.7 }}>
              Searching…
            </div>
          )}

          {!loading && query.trim().length < 2 && (
            <div style={{ padding: 10, fontSize: 14, opacity: 0.7 }}>
              Type 2+ characters…
            </div>
          )}

          {!loading && query.trim().length >= 2 && items.length === 0 && (
            <div style={{ padding: 10, fontSize: 14, opacity: 0.7 }}>
              No results
            </div>
          )}

          {!loading && items.length > 0 && (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {items.map((b, idx) => (
                <li
                  key={b.id}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseDown={() => {
                    // onMouseDown so it fires before blur closes dropdown
                    navigateToBook(b);
                  }}
                  style={{
                    padding: "10px 12px",
                    cursor: "pointer",
                    background: idx === activeIndex ? "#f2f2f2" : "white",
                    borderTop: idx === 0 ? "none" : "1px solid #eee",
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{b.title}</div>
                  <div style={{ fontSize: 13, opacity: 0.75 }}>
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