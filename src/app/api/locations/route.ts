import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const parentId = searchParams.get("parentId"); // divisionId for districts, districtId for thanas

    if (type === "divisions") {
      const divisions = await prisma.division.findMany({
        orderBy: { nameBn: "asc" }
      });
      return NextResponse.json({ data: divisions });
    }

    if (type === "districts") {
      if (!parentId) {
        return NextResponse.json({ error: "Missing divisionId (parentId)" }, { status: 400 });
      }
      const districts = await prisma.district.findMany({
        where: { divisionId: parentId },
        orderBy: { nameBn: "asc" }
      });
      return NextResponse.json({ data: districts });
    }

    if (type === "thanas") {
      if (!parentId) {
        return NextResponse.json({ error: "Missing districtId (parentId)" }, { status: 400 });
      }
      const thanas = await prisma.thana.findMany({
        where: { districtId: parentId },
        orderBy: { nameBn: "asc" }
      });
      return NextResponse.json({ data: thanas });
    }

    return NextResponse.json({ error: "Invalid type. Use divisions, districts, or thanas" }, { status: 400 });

  } catch (error) {
    console.error("Location API Error:", error);
    return NextResponse.json(
      { error: "Internal server error fetching locations" }, 
      { status: 500 }
    );
  }
}
