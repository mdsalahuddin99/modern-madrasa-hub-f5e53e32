import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const madrasasData = [
  {
    name: "দারুল উলূম দেওবন্দ বাংলাদেশ",
    division: "ঢাকা",
    district: "ঢাকা",
    thana: "লালবাগ",
    category: "JAMIA",
    board: "BEFAQ",
    established: "১৯৮৫",
    students: 1200,
    teachers: 45,
    description: "বাংলাদেশের অন্যতম প্রাচীন ও প্রসিদ্ধ কওমি মাদ্রাসা। এখানে দাওরায়ে হাদিস পর্যন্ত শিক্ষাদান করা হয়। মাদ্রাসাটি দেওবন্দী ধারায় পরিচালিত এবং সারাদেশ থেকে শিক্ষার্থীরা এখানে আসেন।",
    address: "লালবাগ, ঢাকা-১২১১",
    phone: "০১৭১২-৩৪৫৬৭৮",
    email: "info@darululoom-bd.edu",
    rating: 4.8,
    featured: true,
    courses: { create: [{ name: "হিফজুল কুরআন" }, { name: "কিতাব বিভাগ" }, { name: "দাওরায়ে হাদিস" }, { name: "তাফসীর" }, { name: "ফিকহ" }] },
    facilities: { create: [{ name: "লাইব্রেরি" }, { name: "হোস্টেল" }, { name: "মসজিদ" }, { name: "খেলার মাঠ" }, { name: "কম্পিউটার ল্যাব" }] },
    image: "https://images.unsplash.com/photo-1585036156171-384164a8c6c4?w=800",
    tagline: "সুন্নাহর আলোয় আলোকিত জীবন",
    history: "১৯৮৫ সালে প্রতিষ্ঠিত এই মাদ্রাসাটি দীর্ঘ ৩৯ বছর ধরে দ্বীনি শিক্ষা প্রচার করে আসছে।",
    mission: "একদল যোগ্য আলেম তৈরি করা যারা সমাজ ও জাতির কল্যাণে কাজ করবে।",
    vision: "একটি আদর্শ ইসলামি সমাজ বিনির্মাণে ভূমিকা রাখা।",
    principalName: "মাওলানা আব্দুল কাইউম",
    principalRole: "প্রধান মুহতামিম",
    principalMessage: "আমাদের লক্ষ্য হলো শিক্ষার্থীদের সুশিক্ষায় শিক্ষিত করে তোলা।",
    departments: [
      { name: "হিফজ বিভাগ", students: "৩০০", desc: "মনোরম পরিবেশে কুরআন মুখস্থ করার সুব্যবস্থা।" },
      { name: "কিতাব বিভাগ", students: "৫০০", desc: "প্রাথমিক থেকে দাওরায়ে হাদিস পর্যন্ত।" }
    ],
    alumniCount: "৫০০০+",
    notableAlumni: "মাওলানা হাফিজুর রহমান, ড. মোশতাক আহমদ",
    admissionRules: ["কমপক্ষে ১০ বছর বয়স হতে হবে", "আবেদনপত্র সংগ্রহ করতে হবে", "মৌখিক পরীক্ষায় উত্তীর্ণ হতে হবে"],
    status: "APPROVED",
  },
  {
    name: "জামিয়া মাদানিয়া বারিধারা",
    division: "ঢাকা",
    district: "ঢাকা",
    thana: "গুলশান",
    category: "JAMIA",
    board: "BEFAQ",
    established: "১৯৯২",
    students: 800,
    teachers: 35,
    description: "আধুনিক সুবিধাসম্পন্ন একটি উচ্চমানের কওমি মাদ্রাসা। শিক্ষার পাশাপাশি চরিত্র গঠনে বিশেষ গুরুত্ব দেওয়া হয়।",
    address: "বারিধারা, ঢাকা-১২২৯",
    phone: "০১৮১২-৩৪৫৬৭৮",
    email: "info@madaniyya.edu",
    rating: 4.6,
    featured: true,
    courses: { create: [{ name: "হিফজুল কুরআন" }, { name: "কিতাব বিভাগ" }, { name: "দাওরায়ে হাদিস" }, { name: "আরবি ভাষা" }] },
    facilities: { create: [{ name: "লাইব্রেরি" }, { name: "হোস্টেল" }, { name: "মসজিদ" }, { name: "ক্যাফেটেরিয়া" }] },
    image: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=800",
    tagline: "আদর্শ মানুষ গড়ার কারিগর",
    principalName: "মাওলানা মাহমুদ হাসান",
    principalRole: "মুহতামিম",
    status: "APPROVED",
  },
  {
    name: "জামিয়া ইসলামিয়া পটিয়া",
    division: "চট্টগ্রাম",
    district: "চট্টগ্রাম",
    thana: "পটিয়া",
    category: "JAMIA",
    board: "BEFAQ",
    established: "১৯৫৭",
    students: 3500,
    teachers: 120,
    description: "এশিয়ার অন্যতম বৃহৎ কওমি মাদ্রাসা। এখানে হাজার হাজার ছাত্র দ্বীনি শিক্ষা অর্জন করে থাকে। প্রতিষ্ঠানটি তার উচ্চমানের শিক্ষা ও আলেম তৈরির জন্য সুপরিচিত।",
    address: "পটিয়া, চট্টগ্রাম",
    phone: "০১৯১২-৩৪৫৬৭৮",
    email: "info@patiya-jamia.edu",
    rating: 4.9,
    featured: true,
    courses: { create: [{ name: "হিফজুল কুরআন" }, { name: "কিতাব বিভাগ" }, { name: "দাওরায়ে হাদিস" }, { name: "তাফসীর" }, { name: "ফিকহ" }, { name: "আরবি সাহিত্য" }] },
    facilities: { create: [{ name: "লাইব্রেরি" }, { name: "হোস্টেল" }, { name: "মসজিদ" }, { name: "হাসপাতাল" }, { name: "খেলার মাঠ" }] },
    image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800",
    status: "APPROVED",
  },
  {
    name: "আল-জামিয়াতুল আহলিয়া দারুল উলূম মঈনুল ইসলাম",
    division: "চট্টগ্রাম",
    district: "চট্টগ্রাম",
    thana: "হাটহাজারী",
    category: "JAMIA",
    board: "BEFAQ",
    established: "১৯০১",
    students: 5000,
    teachers: 150,
    description: "উপমহাদেশের প্রাচীনতম ও সর্ববৃহৎ কওমি মাদ্রাসাগুলোর অন্যতম। বিশ্বখ্যাত এই প্রতিষ্ঠান থেকে অসংখ্য আলেম-উলামা বের হয়েছেন।",
    address: "হাটহাজারী, চট্টগ্রাম",
    phone: "০১৫১২-৩৪৫৬৭৮",
    email: "info@hathazari.edu",
    website: "https://hathazari.edu",
    rating: 5.0,
    featured: true,
    courses: { create: [{ name: "হিফজুল কুরআন" }, { name: "কিতাব বিভাগ" }, { name: "দাওরায়ে হাদিস" }, { name: "তাফসীর" }, { name: "ফিকহ" }, { name: "উসূলুল ফিকহ" }, { name: "মানতিক" }] },
    facilities: { create: [{ name: "লাইব্রেরি" }, { name: "হোস্টেল" }, { name: "মসজিদ" }, { name: "হাসপাতাল" }, { name: "খেলার মাঠ" }, { name: "কম্পিউটার ল্যাব" }] },
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800",
    status: "APPROVED",
  },
];

async function main() {
  console.log("Seeding madrasas...");

  // Create a dummy director
  const director = await prisma.user.upsert({
    where: { email: "seed_director@example.com" },
    update: {},
    create: {
      email: "seed_director@example.com",
      name: "Seed Director",
      role: "INSTITUTION_ADMIN",
      
      hashedPassword: "dummy", // In reality, we shouldn't login as this
    },
  });

  for (const m of madrasasData) {
    await prisma.madrasa.create({
      data: {
        ...m,
        directorId: director.id,
      } as any,
    });
    console.log(`Created madrasa: ${m.name}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
