import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habits, habitLogs } from "@/lib/schema";
import { desc, gte } from "drizzle-orm";
import { format, subDays } from "date-fns";

export async function GET() {
  try {
    const sevenDaysAgo = format(subDays(new Date(), 7), "yyyy-MM-dd");
    const [allHabits, allLogs] = await Promise.all([
      db.select().from(habits).orderBy(desc(habits.createdAt)),
      db.select().from(habitLogs).where(gte(habitLogs.completedDate, sevenDaysAgo)),
    ]);
    return NextResponse.json({ habits: allHabits, logs: allLogs });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch habits" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, color = "#f4c55a", icon = "⚡", frequency = "daily" } = body;
    if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

    const [habit] = await db.insert(habits).values({
      name, description, color, icon, frequency,
    }).returning();

    return NextResponse.json(habit, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create habit" }, { status: 500 });
  }
}
