import { NextResponse } from "next/server";
import { usersCol } from "@/app/lib/collections";

export async function POST(req: Request) {
  const { username, email } = await req.json();

  if (!username || !email) {
    return NextResponse.json({ error: "username and email required" }, { status: 400 });
  }

  const users = await usersCol();

  try {
    const res = await users.insertOne({
      username,
      email: String(email).toLowerCase(),
      createdAt: new Date(),
    });

    return NextResponse.json({ id: res.insertedId });
  } catch (e: any) {
    // Duplicate key (unique index)
    if (e?.code === 11000) {
      return NextResponse.json({ error: "email already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "failed to create user" }, { status: 500 });
  }
}
