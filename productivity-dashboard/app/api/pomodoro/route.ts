import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pomodoroSessions } from "@/lib/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { taskId, duration, type = "work" } = body;
    if (!duration) return NextResponse.json({ error: "Duration required" }, { status: 400 });

    const [session] = await db.insert(pomodoroSessions).values({
      taskId: taskId || null,
      duration,
      type,
    }).returning();

    return NextResponse.json(session, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to save session" }, { status: 500 });
  }
}
