import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// PUT — Update a board
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, abbr, logoUrl, website, order, active } = body;

    const board = await prisma.educationBoard.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(abbr !== undefined && { abbr }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(website !== undefined && { website }),
        ...(order !== undefined && { order }),
        ...(active !== undefined && { active }),
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard/admin/boards");

    return NextResponse.json(board);
  } catch (error) {
    console.error("Error updating board:", error);
    return NextResponse.json({ error: "Failed to update board" }, { status: 500 });
  }
}

// DELETE — Delete a board
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.educationBoard.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting board:", error);
    return NextResponse.json({ error: "Failed to delete board" }, { status: 500 });
  }
}
