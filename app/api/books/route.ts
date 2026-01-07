import { NextResponse } from "next/server";
import { booksCol } from "@/app/lib/collections";

export async function POST(req: Request) {
  const { key, title, author_name, first_publish_year, cover_i } = await req.json();

  if (!key || !title) {
    return NextResponse.json({ error: "key and title required" }, { status: 400 });
  }

  const books = await booksCol();

  // Upsert by key (so you don't create duplicates)
  await books.updateOne(
    { key },
    {
      $set: {
        key,
        title,
        author_name: author_name ?? [],
        first_publish_year: first_publish_year ?? null,
        cover_i: cover_i ?? null
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );

  return NextResponse.json({ ok: true });
}

