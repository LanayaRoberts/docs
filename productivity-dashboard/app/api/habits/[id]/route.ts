import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habits } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await db.delete(habits).where(eq(habits.id, id));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete habit" }, { status: 500 });
  }
}
