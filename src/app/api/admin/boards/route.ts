import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// GET — Public: Fetch all active boards (for marquee)
export async function GET() {
  try {
    const boards = await prisma.educationBoard.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(boards);
  } catch (error) {
    console.error("Error fetching boards:", error);
    return NextResponse.json({ error: "Failed to fetch boards" }, { status: 500 });
  }
}

// POST — Admin: Create a new board
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, abbr, logoUrl, website, order, active } = body;

    if (!name || !abbr) {
      return NextResponse.json({ error: "Name and abbreviation are required" }, { status: 400 });
    }

    const board = await prisma.educationBoard.create({
      data: {
        name,
        abbr,
        logoUrl: logoUrl || null,
        website: website || null,
        order: order ?? 0,
        active: active ?? true,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard/admin/boards");

    return NextResponse.json(board, { status: 201 });
  } catch (error) {
    console.error("Error creating board:", error);
    return NextResponse.json({ error: "Failed to create board" }, { status: 500 });
  }
}
