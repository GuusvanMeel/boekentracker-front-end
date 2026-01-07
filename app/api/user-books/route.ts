import { NextResponse } from "next/server";
import { userBooksCol } from "@/app/lib/collections";
import { ObjectId } from "mongodb";

const VALID = new Set(["WANT", "READING", "READ", "STOPPED"]);

export async function POST(req: Request) {
  const { userId, bookKey, status } = await req.json();

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
      $set: { status, updatedAt: new Date() },
      $setOnInsert: { addedAt: new Date() },
    },
    { upsert: true }
  );

  return NextResponse.json({ ok: true });
}
