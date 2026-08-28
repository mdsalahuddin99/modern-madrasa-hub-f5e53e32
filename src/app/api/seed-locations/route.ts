import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const divisions = [
  { nameEn: "Dhaka", nameBn: "ঢাকা", slug: "dhaka" },
  { nameEn: "Chattogram", nameBn: "চট্টগ্রাম", slug: "chattogram" },
  { nameEn: "Rajshahi", nameBn: "রাজশাহী", slug: "rajshahi" },
  { nameEn: "Khulna", nameBn: "খুলনা", slug: "khulna" },
  { nameEn: "Barishal", nameBn: "বরিশাল", slug: "barishal" },
  { nameEn: "Sylhet", nameBn: "সিলেট", slug: "sylhet" },
  { nameEn: "Rangpur", nameBn: "রংপুর", slug: "rangpur" },
  { nameEn: "Mymensingh", nameBn: "ময়মনসিংহ", slug: "mymensingh" }
];

export async function GET() {
  try {
    for (const div of divisions) {
      await prisma.division.upsert({
        where: { slug: div.slug },
        update: {},
        create: div
      });
    }
    return NextResponse.json({ success: true, message: "Divisions seeded" });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
