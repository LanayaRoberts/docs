import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notes } from "@/lib/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const all = await db.select().from(notes).orderBy(desc(notes.pinned), desc(notes.updatedAt));
    return NextResponse.json(all);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, color = "#f4c55a" } = body;
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content required" }, { status: 400 });
    }

    const [note] = await db.insert(notes).values({ title, content, color }).returning();
    return NextResponse.json(note, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
