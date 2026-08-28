import { PrismaClient } from "@prisma/client";
import pkg from "bcryptjs";
const { hash } = pkg;

const prisma = new PrismaClient();

async function main() {
  const password = await hash("password123", 12);

  const users = [
    { email: "superadmin@madrasa.com", name: "Super Admin Demo", role: "SUPER_ADMIN" },
    { email: "admin@madrasa.com", name: "Institution Admin Demo", role: "INSTITUTION_ADMIN" },
    { email: "user@madrasa.com", name: "Regular User Demo", role: "USER" }
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { hashedPassword: password, role: u.role as any },
      create: {
        email: u.email,
        name: u.name,
        hashedPassword: password,
        role: u.role as any,
      }
    });
  }
  console.log("Demo users seeded successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
