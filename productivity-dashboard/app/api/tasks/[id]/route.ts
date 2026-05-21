import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tasks } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();
    const { status, priority, title, description } = body;

    const [updated] = await db
      .update(tasks)
      .set({
        ...(status && { status }),
        ...(priority && { priority }),
        ...(title && { title }),
        ...(description !== undefined && { description }),
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await db.delete(tasks).where(eq(tasks.id, id));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
