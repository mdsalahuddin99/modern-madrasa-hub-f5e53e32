import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const divisions = [
  { nameEn: "Dhaka", nameBn: "ঢাকা", slug: "dhaka" },
  { nameEn: "Chattogram", nameBn: "চট্টগ্রাম", "slug": "chattogram" },
  { nameEn: "Rajshahi", nameBn: "রাজশাহী", "slug": "rajshahi" },
  { nameEn: "Khulna", nameBn: "খুলনা", "slug": "khulna" },
  { nameEn: "Barishal", nameBn: "বরিশাল", "slug": "barishal" },
  { nameEn: "Sylhet", nameBn: "সিলেট", "slug": "sylhet" },
  { nameEn: "Rangpur", nameBn: "রংপুর", "slug": "rangpur" },
  { nameEn: "Mymensingh", nameBn: "ময়মনসিংহ", "slug": "mymensingh" }
];

async function main() {
  console.log("Seeding divisions...");
  for (const div of divisions) {
    await prisma.division.upsert({
      where: { slug: div.slug },
      update: {},
      create: div
    });
  }
  console.log("Divisions seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
