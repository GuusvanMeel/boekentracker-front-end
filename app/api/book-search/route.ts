import { NextResponse } from "next/server";

const OPEN_LIBRARY_SEARCH_URL = "https://openlibrary.org/search.json";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const q = (searchParams.get("q") || "").trim();
  const limit = Math.min(Number(searchParams.get("limit") || 8), 20);

  // Hard guard: don't allow empty / 1-char searches
  if (q.length < 2) {
    return NextResponse.json({ items: [] });
  }

  const url = new URL(OPEN_LIBRARY_SEARCH_URL);
  url.searchParams.set("q", q);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set(
    "fields",
    "key,title,author_name,first_publish_year,cover_i"
  );

  const response = await fetch(url.toString(), {
    headers: {
      "Accept": "application/json",
      "User-Agent": "BooktrackerSchool/1.0 (guusvm43@gmail.com)", // polite, optional
    },
    cache: "no-store", // important for live search
  });

  if (!response.ok) {
    return NextResponse.json(
      { items: [] },
      { status: 200 } // fail silently for typeahead
    );
  }

  const data = await response.json();

  // Normalize Open Library response → frontend-friendly shape
  const items = (data.docs || []).map((doc: any) => ({
    id: doc.key, // e.g. "/works/OL12345W"
    title: doc.title,
    author: doc.author_name?.[0] ?? null,
    year: doc.first_publish_year ?? null,
    coverId: doc.cover_i ?? null,
  }));

  return NextResponse.json({ items });
}
