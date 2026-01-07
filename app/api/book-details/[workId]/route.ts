import { NextResponse } from "next/server";

const OPEN_LIBRARY_SEARCH_URL = "https://openlibrary.org/search.json";

const DETAIL_FIELDS =
  "key,title,author_name,first_publish_year,cover_i," +
  "number_of_pages_median,language,publisher,publish_year," +
  "subject,ratings_average,ratings_count,edition_count";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ workId: string }> }
) {
  console.log("=== API Route START ===");
  console.log("Params (before await):", params);
  
  // Await params in Next.js 15+
  const { workId: rawWorkId } = await params;

  
  let workId = rawWorkId.trim();


  const url = new URL(OPEN_LIBRARY_SEARCH_URL);
  url.searchParams.set("q", `key:${workId}`);
  url.searchParams.set("limit", "1");
  url.searchParams.set("fields", DETAIL_FIELDS);
  
  console.log("Fetching from OpenLibrary:", url.toString());

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "User-Agent": "BooktrackerSchool/1.0 (guusvm43@gmail.com)",
    },
    cache: "no-store",
  });

  console.log("OpenLibrary response status:", response.status);

  if (!response.ok) {
    console.log("OpenLibrary response not OK, returning null");
    return NextResponse.json({ book: null }, { status: 200 });
  }

  const data = await response.json();
  console.log("OpenLibrary data:", data);
  
  const doc = data.docs?.[0];
  console.log("First doc:", doc);

  if (!doc) {
    console.log("No doc found, returning null");
    return NextResponse.json({ book: null }, { status: 200 });
  }

  // Normalize → frontend-friendly shape
  const book = {
    id: doc.key, 
    title: doc.title,
    authors: doc.author_name ?? [],
    firstPublishYear: doc.first_publish_year ?? null,
    coverId: doc.cover_i ?? null,
    pageCount: doc.number_of_pages_median ?? null,
    languages: doc.language ?? [],
    publishers: doc.publisher ?? [],
    publishYears: doc.publish_year ?? [],
    subjects: doc.subject ?? [],
    ratingAverage: doc.ratings_average ?? null,
    ratingCount: doc.ratings_count ?? null,
    editionCount: doc.edition_count ?? null,
  };

  console.log("Returning book:", book);
  return NextResponse.json({ book });
}