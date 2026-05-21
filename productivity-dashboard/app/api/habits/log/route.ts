import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habitLogs } from "@/lib/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { habitId, date } = await req.json();
    if (!habitId || !date) {
      return NextResponse.json({ error: "habitId and date required" }, { status: 400 });
    }

    const [log] = await db.insert(habitLogs).values({
      habitId,
      completedDate: date,
    }).onConflictDoNothing().returning();

    return NextResponse.json(log || { already_logged: true }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to log habit" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { habitId, date } = await req.json();
    await db.delete(habitLogs).where(
      and(
        eq(habitLogs.habitId, habitId),
        eq(habitLogs.completedDate, date)
      )
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to remove log" }, { status: 500 });
  }
}
