import { NextResponse } from "next/server";
import { userBooksCol } from "@/app/lib/collections";
import { ObjectId } from "mongodb";

const VALID = new Set(["WANT", "READING", "READ", "STOPPED"]);

export async function POST(req: Request) {
  const { userId, bookKey, status, endDate } = await req.json();

  if (!userId || !bookKey || !VALID.has(status)) {
    return NextResponse.json(
      { error: "userId, bookKey, valid status required" },
      { status: 400 }
    );
  }

  const userBooks = await userBooksCol();

  await userBooks.updateOne(
    { userId: new ObjectId(userId), bookKey },
    {
      $set: { status, updatedAt: new Date(),...(endDate && { endDate: new Date(endDate) }), },
      $setOnInsert: { addedAt: new Date() },
    },
    { upsert: true }
  );

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
  const userBooks = await userBooksCol();
  const books = await userBooks
    .find({ userId: new ObjectId(userId) })
    .toArray();
  return NextResponse.json({ items: books });
}

