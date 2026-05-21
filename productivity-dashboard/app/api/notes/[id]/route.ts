import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notes } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();
    const { title, content, color, pinned } = body;

    const [updated] = await db
      .update(notes)
      .set({
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(color !== undefined && { color }),
        ...(pinned !== undefined && { pinned }),
        updatedAt: new Date(),
      })
      .where(eq(notes.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await db.delete(notes).where(eq(notes.id, id));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}
