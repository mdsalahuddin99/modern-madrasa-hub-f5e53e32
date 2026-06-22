// ===================================================
// Prisma Seed — আধুনিক মাদ্রাসা হাব ডেমো ডেটা
// Run: npx prisma db seed
// ===================================================

import { PrismaClient, UserRole, MadrasaStatus, MadrasaCategory, MadrasaBoard } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with new architecture...");

  // ── 1. CLEANUP (Optional but recommended for fresh seed) ──
  await prisma.review.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.facility.deleteMany();
  await prisma.course.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.madrasa.deleteMany();
  await prisma.user.deleteMany();
  await prisma.siteContent.deleteMany();

  // ── 2. ADMIN USER ──
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.create({
    data: {
      email: "admin@madrasahub.com",
      name: "সুপার অ্যাডমিন",
      hashedPassword: adminPassword,
      role: UserRole.ADMIN,
      subscriptionActive: true,
      wizardCompleted: true,
    },
  });

  // ── 3. DIRECTOR USER ──
  const directorPassword = await bcrypt.hash("director123", 12);
  const director = await prisma.user.create({
    data: {
      email: "director@madrasahub.com",
      name: "মুহতামিম সাহেব",
      hashedPassword: directorPassword,
      role: UserRole.DIRECTOR,
      wizardCompleted: true,
    },
  });

  // ── 4. SUBSCRIPTION PLANS ──
  console.log("📦 Creating subscription plans...");
  const plans = await Promise.all([
    prisma.subscriptionPlan.create({
      data: {
        name: "বেসিক ১ বছর",
        durationYear: 1,
        pricePerYear: 1000,
        totalPrice: 1000,
        features: ["মাদ্রাসা প্রোফাইল", "কোর্স লিস্টিং", "যোগাযোগ তথ্য"],
      },
    }),
    prisma.subscriptionPlan.create({
      data: {
        name: "স্ট্যান্ডার্ড ৩ বছর",
        durationYear: 3,
        pricePerYear: 800,
        totalPrice: 2400,
        features: ["সব বেসিক ফিচার", "ফটো গ্যালারি", "ভর্তি ফরম", "সাব-ডোমেইন"],
      },
    }),
    prisma.subscriptionPlan.create({
      data: {
        name: "প্রিমিয়াম ৫ বছর",
        durationYear: 5,
        pricePerYear: 700,
        totalPrice: 3500,
        features: ["সব স্ট্যান্ডার্ড ফিচার", "সার্চে অগ্রাধিকার", "প্রিমিয়াম সাপোর্ট", "এনালিটিক্স"],
      },
    }),
  ]);

  // ── 5. SAMPLE MADRASAS (One for each category) ──
  console.log("🕌 Creating sample madrasas for all categories...");
  const madrasasData = [
    {
      name: "জামিয়া ইসলামিয়া দারুল উলূম",
      category: MadrasaCategory.JAMIA,
      division: "ঢাকা",
      district: "ঢাকা",
      thana: "লালবাগ",
      subdomain: "lalbagh-jamia",
      description: "ঐতিহ্যবাহী জামিয়া ইসলামিয়া।"
    },
    {
      name: "দারুস সুন্নাহ কওমি মাদ্রাসা",
      category: MadrasaCategory.MADRASA,
      division: "সিলেট",
      district: "সিলেট",
      thana: "দক্ষিণ সুরমা",
      subdomain: "darussunnah",
      description: "একটি আদর্শ কওমি মাদ্রাসা।"
    },
    {
      name: "তাহফিজুল কুরআন হিফজ মাদ্রাসা",
      category: MadrasaCategory.HIFZ,
      division: "চট্টগ্রাম",
      district: "চট্টগ্রাম",
      thana: "পাহাড়তলী",
      subdomain: "tahfiz-quran",
      description: "বিশুদ্ধ তিলাওয়াত ও হিফজ কেন্দ্র।"
    },
    {
      name: "আল-হেদায়া নূরানী মাদ্রাসা",
      category: MadrasaCategory.NURANI,
      division: "রাজশাহী",
      district: "রাজশাহী",
      thana: "বোয়ালিয়া",
      subdomain: "al-hidayah",
      description: "শিশুদের দ্বীনি শিক্ষার প্রাথমিক বুনিয়াদ।"
    },
    {
      name: "ফাতেমাতুজ জোহরা মহিলা মাদ্রাসা",
      category: MadrasaCategory.MOHILA,
      division: "খুলনা",
      district: "খুলনা",
      thana: "খালিশপুর",
      subdomain: "fatima-mohila",
      description: "নারীদের জন্য উচ্চতর দ্বীনি শিক্ষা প্রতিষ্ঠান।"
    },
    {
      name: "আইডিয়াল ইসলামিক ইন্টারন্যাশনাল স্কুল",
      category: MadrasaCategory.ISLAMIC_SCHOOL,
      division: "বরিশাল",
      district: "বরিশাল",
      thana: "সদর",
      subdomain: "ideal-islamic",
      description: "আধুনিক ও দ্বীনি শিক্ষার সমন্বয়।"
    },
    {
      name: "মা'হাদুল বুহুস আল-ইসলামিয়া",
      category: MadrasaCategory.HIGHER_EDU,
      division: "রংপুর",
      district: "রংপুর",
      thana: "সদর",
      subdomain: "mahadul-buhuth",
      description: "উচ্চতর গবেষণা ও ফতোয়া বিভাগ।"
    },
    {
      name: "এতিমখানা ও মাদ্রাসা কমপ্লেক্স",
      category: MadrasaCategory.OTHERS,
      division: "ময়মনসিংহ",
      district: "ময়মনসিংহ",
      thana: "সদর",
      subdomain: "orphan-complex",
      description: "অন্যান্য দ্বীনি ও সামাজিক কার্যক্রম।"
    }
  ];

  for (const m of madrasasData) {
    await prisma.madrasa.create({
      data: {
        name: m.name,
        division: m.division,
        district: m.district,
        thana: m.thana,
        category: m.category,
        board: MadrasaBoard.BEFAQ,
        established: "২০০০",
        students: 500,
        teachers: 25,
        description: m.description,
        address: `${m.thana}, ${m.district}`,
        phone: "০১৭১১০০০০০০",
        email: `info@${m.subdomain}.edu`,
        subdomain: m.subdomain,
        status: MadrasaStatus.APPROVED,
        directorId: director.id,
        courses: { create: [{ name: "সাধারণ বিভাগ" }] },
        facilities: { create: [{ name: "লাইব্রেরি" }] }
      }
    });
  }

  // ── 6. CMS CONTENT ──
  console.log("📝 Upserting site content...");
  const contents = [
    {
      section: "hero",
      content: {
        title: "আপনার মাদ্রাসাকে করুন ডিজিটাল ও আধুনিক",
        subtitle: "বাংলাদেশের সর্ববৃহৎ মাদ্রাসা ডিরেক্টরিতে আপনার প্রতিষ্ঠানকে যুক্ত করুন",
        ctaText: "মাদ্রাসা খুঁজুন",
        ctaLink: "/madrasas"
      }
    },
    {
      section: "navbar",
      content: {
        siteName: "মাদ্রাসা হাব",
        links: [
          { label: "হোম", href: "/" },
          { label: "মাদ্রাসা সমূহ", href: "/madrasas" },
          { label: "আমাদের সম্পর্কে", href: "/about" },
          { label: "যোগাযোগ", href: "/contact" }
        ]
      }
    }
  ];

  for (const item of contents) {
    await prisma.siteContent.upsert({
      where: { section: item.section },
      update: { content: item.content },
      create: item,
    });
  }

  console.log("✅ Seed complete!");
  console.log(`   Admin: admin@madrasahub.com / admin123`);
  console.log(`   Director: director@madrasahub.com / director123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
