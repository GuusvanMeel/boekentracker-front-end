// import { NextResponse } from "next/server";
// import { userBooksCol } from "@/app/lib/collections";
// import { ObjectId } from "mongodb";

// const VALID = new Set(["WANT", "READING", "READ", "STOPPED"]);

// export async function POST(req: Request) {
//   const { userId, bookKey, status, endDate } = await req.json();

//   if (!userId || !bookKey || !VALID.has(status)) {
//     return NextResponse.json(
//       { error: "userId, bookKey, valid status required" },
//       { status: 400 }
//     );
//   }

//   const userBooks = await userBooksCol();

//   await userBooks.updateOne(
//     { userId: new ObjectId(userId), bookKey },
//     {
//       $set: { status, updatedAt: new Date(),...(endDate && { endDate: new Date(endDate) }), },
//       $setOnInsert: { addedAt: new Date() },
//     },
//     { upsert: true }
//   );

//   return NextResponse.json({ ok: true });
// }
// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const userId = searchParams.get("userId");
//   if (!userId) {
//     return NextResponse.json(
//       { error: "userId required" },
//       { status: 400 }
//     );
//   }
//   const userBooks = await userBooksCol();
//   const books = await userBooks
//     .find({ userId: new ObjectId(userId) })
//     .toArray();
//   return NextResponse.json({ items: books });
// }

import { NextResponse } from "next/server";
import { createClient } from "@/app/LoveableAI/lib/supabase/client";

const VALID = new Set(["WANT", "READING", "READ", "STOPPED"]);

export async function POST(req: Request) {
  const { userId, bookKey, status, endDate } = await req.json();

  if (!userId || !bookKey || !VALID.has(status)) {
    return NextResponse.json(
      { error: "userId, bookKey, valid status required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("user_books")
    .upsert(
      {
        user_id: userId,
        book_key: bookKey,
        status,
        updated_at: new Date().toISOString(),
        ...(endDate && {
          end_date: new Date(endDate).toISOString(),
        }),
      },
      {
        onConflict: "user_id,book_key",
      }
    );

  if (error) {
    console.error("Failed to update user book:", error.message);

    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "userId required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data: books, error } = await supabase
    .from("user_books")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to fetch user books:", error.message);

    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }

  const mappedBooks = books.map((book) => ({
    id: book.id,
    userId: book.user_id,
    bookKey: book.book_key,
    status: book.status,
    addedAt: book.added_at,
    updatedAt: book.updated_at,
    endDate: book.end_date,
  }));

  return NextResponse.json({ items: mappedBooks });
}