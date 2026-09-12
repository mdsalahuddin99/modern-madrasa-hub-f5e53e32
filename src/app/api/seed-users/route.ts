import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    await prisma.user.upsert({
      where: { email: "superadmin@madrasa.com" },
      update: { hashedPassword, role: UserRole.SUPER_ADMIN },
      create: {
        name: "Super Admin",
        email: "superadmin@madrasa.com",
        hashedPassword,
        role: UserRole.SUPER_ADMIN
      }
    });

    await prisma.user.upsert({
      where: { email: "admin@madrasa.com" },
      update: { hashedPassword, role: UserRole.INSTITUTION_ADMIN },
      create: {
        name: "Director",
        email: "admin@madrasa.com",
        hashedPassword,
        role: UserRole.INSTITUTION_ADMIN
      }
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: String(e) }, { status: 200 });
  }
}
