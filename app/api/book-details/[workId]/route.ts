import { NextResponse } from "next/server";
import type { Book } from "@/app/types/books";
import { getTopGenresFromSubjects } from "@/utils/genre";

const WORK_URL = "https://openlibrary.org/works";
const SEARCH_URL = "https://openlibrary.org/search.json";
async function fetchAuthorName(authorKey: string): Promise<string | null> {
  
  const res = await fetch(`https://openlibrary.org${authorKey}.json`, {
    headers: {
      Accept: "application/json",
      "User-Agent": "BooktrackerSchool/1.0",
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();
  
  return data.name ?? null;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ workId: string }> }
) {
  const { workId: rawWorkId } = await params;
  const workId = rawWorkId.replace("/works/", "").trim();

  /* -------------------------
     1️⃣ Fetch WORK data
  --------------------------*/
  const workRes = await fetch(`${WORK_URL}/${workId}.json`, {
    headers: {
      Accept: "application/json",
      "User-Agent": "BooktrackerSchool/1.0",
    },
    cache: "no-store",
  });

  if (!workRes.ok) {
    return NextResponse.json({ book: null }, { status: 200 });
  }

  const work = await workRes.json();

  /* -------------------------
     2️⃣ Fetch ONE EDITION
  --------------------------*/
  const editionUrl = new URL(SEARCH_URL);
  editionUrl.searchParams.set("q", `key:/works/${workId}`);
  editionUrl.searchParams.set("limit", "1");
  editionUrl.searchParams.set(
    "fields",
    "isbn,number_of_pages_median,publisher,first_publish_year,cover_i"
  );

  const editionRes = await fetch(editionUrl.toString(), {
    headers: {
      Accept: "application/json",
      "User-Agent": "BooktrackerSchool/1.0",
    },
    cache: "no-store",
  });

  const editionData = editionRes.ok ? await editionRes.json() : null;
  const edition = editionData?.docs?.[0] ?? {};
  const authorKeys =
  work.authors
    ?.map((a: any) => a.author?.key)
    .filter(Boolean) ?? [];

const authors = (
  await Promise.all(authorKeys.map(fetchAuthorName))
).filter((name): name is string => Boolean(name));
  /* -------------------------
     3️⃣ Normalize → Book
  --------------------------*/
  const book: Book = {
    id: workId,

    title: work.title ?? "",

    coverId:
      work.covers?.[0] ??
      edition.cover_i ??
      null,

    authors: authors,
      

    description:
      typeof work.description === "string"
        ? work.description
        : work.description?.value ?? null,

    isbn:
      edition.isbn?.[0] ?? null,

    pageCount:
      edition.number_of_pages_median ?? null,

    publishYear:
      edition.first_publish_year ??
      work.first_publish_year ??
      null,

    publisher:
      edition.publisher?.[0] ?? null,

    genres: getTopGenresFromSubjects(work.subjects),
  };

  return NextResponse.json({ book });
}
