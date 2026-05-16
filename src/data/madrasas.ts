import madrasaCampus1 from "@/assets/madrasa-campus-1.jpg";
import madrasaCampus2 from "@/assets/madrasa-campus-2.jpg";
import madrasaCampus3 from "@/assets/madrasa-campus-3.jpg";
import madrasaCampus4 from "@/assets/madrasa-campus-4.jpg";
import madrasaCampus5 from "@/assets/madrasa-campus-5.jpg";

export interface Madrasa {
  id: string;
  name: string;
  division: string;
  district: string;
  thana: string;
  category: string;
  board: string;
  established: string;
  students: number;
  teachers: number;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string | null;
  rating: number;
  featured: boolean;
  courses: string[];
  facilities: string[];
  image: string;
  tagline?: string | null;
  bannerImage?: string | null;
  history?: string | null;
  mission?: string | null;
  vision?: string | null;
  principalName?: string | null;
  principalRole?: string | null;
  principalMessage?: string | null;
  departments?: { name: string; students: string; desc: string }[] | null;
  alumniCount?: string | null;
  notableAlumni?: string | null;
  admissionRules?: string[] | null;
  galleryImages?: { id: string; url: string; order: number }[] | null;
  admissionImages?: string[] | null;
  director?: { id: string; name: string | null; email: string } | null;
}

export const divisions = ["ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা", "বরিশাল", "সিলেট", "রংপুর", "ময়মনসিংহ"];

export const categories = ["জামিয়া", "আলিয়া মাদ্রাসা", "মাদ্রাসা", "হিফজুল কুরআন", "নূরানী", "মহিলা মাদ্রাসা", "ইসলামিক স্কুল", "উচ্চতর শিক্ষা প্রতিষ্ঠান", "অন্যান্য"];

export const boards = [
  "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ (বেফাক)",
  "বেফাকুল মাদারিসিল কওমিয়া গওহরডাঙ্গা বাংলাদেশ",
  "আঞ্জুমানে ইত্তেহাদুল মাদারিস বাংলাদেশ",
  "আযাদ দ্বীনী এদারায়ে তালীম বাংলাদেশ",
  "তানজিমুল মাদারিসিদ দ্বীনিয়া বাংলাদেশ",
  "বেফাকুল মাদারিসিল দ্বীনিয়া বাংলাদেশ (জাতীয় দ্বীনি মাদ্রাসা শিক্ষা বোর্ড)",
];

export const districtsByDivision: Record<string, string[]> = {
  "ঢাকা": ["ঢাকা", "গাজীপুর", "নারায়ণগঞ্জ", "মানিকগঞ্জ", "মুন্সীগঞ্জ", "নরসিংদী", "টাঙ্গাইল", "কিশোরগঞ্জ", "ফরিদপুর", "মাদারীপুর", "শরীয়তপুর", "রাজবাড়ী", "গোপালগঞ্জ"],
  "চট্টগ্রাম": ["চট্টগ্রাম", "কক্সবাজার", "কুমিল্লা", "ব্রাহ্মণবাড়িয়া", "চাঁদপুর", "লক্ষ্মীপুর", "নোয়াখালী", "ফেনী", "খাগড়াছড়ি", "রাঙামাটি", "বান্দরবান"],
  "রাজশাহী": ["রাজশাহী", "বগুড়া", "পাবনা", "সিরাজগঞ্জ", "নওগাঁ", "নাটোর", "চাঁপাইনবাবগঞ্জ", "জয়পুরহাট"],
  "খুলনা": ["খুলনা", "যশোর", "সাতক্ষীরা", "মেহেরপুর", "নড়াইল", "কুষ্টিয়া", "চুয়াডাঙ্গা", "ঝিনাইদহ", "মাগুরা", "বাগেরহাট"],
  "বরিশাল": ["বরিশাল", "পটুয়াখালী", "ভোলা", "পিরোজপুর", "ঝালকাঠি", "বরগুনা"],
  "সিলেট": ["সিলেট", "মৌলভীবাজার", "হবিগঞ্জ", "সুনামগঞ্জ"],
  "রংপুর": ["রংপুর", "দিনাজপুর", "কুড়িগ্রাম", "লালমনিরহাট", "নীলফামারী", "গাইবান্ধা", "ঠাকুরগাঁও", "পঞ্চগড়"],
  "ময়মনসিংহ": ["ময়মনসিংহ", "জামালপুর", "শেরপুর", "নেত্রকোনা"],
};

export const madrasas: Madrasa[] = [
  {
    id: "1",
    name: "দারুল উলূম দেওবন্দ বাংলাদেশ",
    division: "ঢাকা",
    district: "ঢাকা",
    thana: "লালবাগ",
    category: "জামিয়া",
    board: "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ (বেফাক)",
    established: "১৯৮৫",
    students: 1200,
    teachers: 45,
    description: "বাংলাদেশের অন্যতম প্রাচীন ও প্রসিদ্ধ কওমি মাদ্রাসা। এখানে দাওরায়ে হাদিস পর্যন্ত শিক্ষাদান করা হয়। মাদ্রাসাটি দেওবন্দী ধারায় পরিচালিত এবং সারাদেশ থেকে শিক্ষার্থীরা এখানে আসেন।",
    address: "লালবাগ, ঢাকা-১২১১",
    phone: "০১৭১২-৩৪৫৬৭৮",
    email: "info@darululoom-bd.edu",
    rating: 4.8,
    featured: true,
    courses: ["হিফজুল কুরআন", "কিতাব বিভাগ", "দাওরায়ে হাদিস", "তাফসীর", "ফিকহ"],
    facilities: ["লাইব্রেরি", "হোস্টেল", "মসজিদ", "খেলার মাঠ", "কম্পিউটার ল্যাব"],
    image: madrasaCampus1.src,
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
    galleryImages: [
      { id: "g1", url: madrasaCampus1.src, order: 1 },
      { id: "g2", url: madrasaCampus2.src, order: 2 }
    ],
    admissionImages: [madrasaCampus3.src]
  },
  {
    id: "2",
    name: "জামিয়া মাদানিয়া বারিধারা",
    division: "ঢাকা",
    district: "ঢাকা",
    thana: "গুলশান",
    category: "জামিয়া",
    board: "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ (বেফাক)",
    established: "১৯৯২",
    students: 800,
    teachers: 35,
    description: "আধুনিক সুবিধাসম্পন্ন একটি উচ্চমানের কওমি মাদ্রাসা। শিক্ষার পাশাপাশি চরিত্র গঠনে বিশেষ গুরুত্ব দেওয়া হয়।",
    address: "বারিধারা, ঢাকা-১২২৯",
    phone: "০১৮১২-৩৪৫৬৭৮",
    email: "info@madaniyya.edu",
    rating: 4.6,
    featured: true,
    courses: ["হিফজুল কুরআন", "কিতাব বিভাগ", "দাওরায়ে হাদিস", "আরবি ভাষা"],
    facilities: ["লাইব্রেরি", "হোস্টেল", "মসজিদ", "ক্যাফেটেরিয়া"],
    image: madrasaCampus2.src,
    tagline: "আদর্শ মানুষ গড়ার কারিগর",
    principalName: "মাওলানা মাহমুদ হাসান",
    principalRole: "মুহতামিম",
  },
  {
    id: "3",
    name: "জামিয়া ইসলামিয়া পটিয়া",
    division: "চট্টগ্রাম",
    district: "চট্টগ্রাম",
    thana: "পটিয়া",
    category: "জামিয়া",
    board: "বেফাকুল মাদারিসিল আরাবিয়া",
    established: "১৯৫৭",
    students: 3500,
    teachers: 120,
    description: "এশিয়ার অন্যতম বৃহৎ কওমি মাদ্রাসা। এখানে হাজার হাজার ছাত্র দ্বীনি শিক্ষা অর্জন করে থাকে। প্রতিষ্ঠানটি তার উচ্চমানের শিক্ষা ও আলেম তৈরির জন্য সুপরিচিত।",
    address: "পটিয়া, চট্টগ্রাম",
    phone: "০১৯১২-৩৪৫৬৭৮",
    email: "info@patiya-jamia.edu",
    rating: 4.9,
    featured: true,
    courses: ["হিফজুল কুরআন", "কিতাব বিভাগ", "দাওরায়ে হাদিস", "তাফসীর", "ফিকহ", "আরবি সাহিত্য"],
    facilities: ["লাইব্রেরি", "হোস্টেল", "মসজিদ", "হাসপাতাল", "খেলার মাঠ"],
    image: madrasaCampus3.src,
  },
  {
    id: "4",
    name: "আল-জামিয়াতুল আহলিয়া দারুল উলূম মঈনুল ইসলাম",
    division: "চট্টগ্রাম",
    district: "চট্টগ্রাম",
    thana: "হাটহাজারী",
    category: "জামিয়া",
    board: "বেফাকুল মাদারিসিল আরাবিয়া",
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
    courses: ["হিফজুল কুরআন", "কিতাব বিভাগ", "দাওরায়ে হাদিস", "তাফসীর", "ফিকহ", "উসূলুল ফিকহ", "মানতিক"],
    facilities: ["লাইব্রেরি", "হোস্টেল", "মসজিদ", "হাসপাতাল", "খেলার মাঠ", "কম্পিউটার ল্যাব"],
    image: madrasaCampus4.src,
  },
  {
    id: "5",
    name: "তাহফিজুল কুরআন মাদ্রাসা",
    division: "সিলেট",
    district: "সিলেট",
    thana: "কোতোয়ালী",
    category: "হিফজুল কুরআন",
    board: "বেফাকুল মাদারিসিল আরাবিয়া",
    established: "২০০৫",
    students: 300,
    teachers: 15,
    description: "কুরআন মুখস্থ করার জন্য বিশেষায়িত প্রতিষ্ঠান। এখানে উন্নত পদ্ধতিতে হিফজ শেখানো হয়।",
    address: "কোতোয়ালী, সিলেট",
    phone: "০১৬১২-৩৪৫৬৭৮",
    email: "info@tahfiz-sylhet.edu",
    rating: 4.5,
    featured: false,
    courses: ["হিফজুল কুরআন", "নাজিরা", "তাজবীদ"],
    facilities: ["হোস্টেল", "মসজিদ"],
    image: madrasaCampus5.src,
  },
  {
    id: "6",
    name: "মহিলা মাদ্রাসা আল-খাইর",
    division: "রাজশাহী",
    district: "রাজশাহী",
    thana: "বোয়ালিয়া",
    category: "মহিলা মাদ্রাসা",
    board: "বেফাকুল মাদারিসিল আরাবিয়া",
    established: "২০১০",
    students: 450,
    teachers: 25,
    description: "মহিলাদের জন্য বিশেষায়িত দ্বীনি শিক্ষা প্রতিষ্ঠান। এখানে পর্দার সাথে উচ্চমানের ইসলামি শিক্ষা দেওয়া হয়।",
    address: "বোয়ালিয়া, রাজশাহী",
    phone: "০১৩১২-৩৪৫৬৭৮",
    email: "info@alkair-women.edu",
    rating: 4.7,
    featured: true,
    courses: ["হিফজুল কুরআন", "কিতাব বিভাগ", "আরবি ভাষা", "সেলাই ও হস্তশিল্প"],
    facilities: ["হোস্টেল", "মসজিদ", "লাইব্রেরি"],
    image: madrasaCampus1.src,
  },
  {
    id: "7",
    name: "নূরানী তা'লীমুল কুরআন মাদ্রাসা",
    division: "খুলনা",
    district: "যশোর",
    thana: "যশোর সদর",
    category: "নূরানী",
    board: "তানজিমুল মাদারিস",
    established: "২০১৫",
    students: 200,
    teachers: 10,
    description: "শিশুদের কুরআন শিক্ষার জন্য বিশেষায়িত প্রতিষ্ঠান। নূরানী পদ্ধতিতে সহজে কুরআন শেখানো হয়।",
    address: "যশোর সদর, যশোর",
    phone: "০১৪১২-৩৪৫৬৭৮",
    email: "info@nurani-jessore.edu",
    rating: 4.3,
    featured: false,
    courses: ["নূরানী কায়দা", "নাজিরা", "দ্বীনিয়াত"],
    facilities: ["মসজিদ"],
    image: madrasaCampus2.src,
  },
  {
    id: "8",
    name: "দারুস সালাম মাদ্রাসা",
    division: "রংপুর",
    district: "দিনাজপুর",
    thana: "দিনাজপুর সদর",
    category: "জামিয়া",
    board: "বেফাকুল মাদারিসিল আরাবিয়া",
    established: "১৯৯৮",
    students: 600,
    teachers: 30,
    description: "উত্তরবঙ্গের অন্যতম সেরা কওমি মাদ্রাসা। শিক্ষার মান ও পরিবেশের জন্য সুপরিচিত।",
    address: "দিনাজপুর সদর, দিনাজপুর",
    phone: "০১২১২-৩৪৫৬৭৮",
    email: "info@darussalam-dinajpur.edu",
    rating: 4.4,
    featured: false,
    courses: ["হিফজুল কুরআন", "কিতাব বিভাগ", "দাওরায়ে হাদিস"],
    facilities: ["লাইব্রেরি", "হোস্টেল", "মসজিদ"],
    image: madrasaCampus3.src,
  },
  {
    id: "9",
    name: "ইসলামিক একাডেমি বরিশাল",
    division: "বরিশাল",
    district: "বরিশাল",
    thana: "বরিশাল সদর",
    category: "ইসলামিক স্কুল",
    board: "আলিয়া বোর্ড",
    established: "২০০০",
    students: 500,
    teachers: 28,
    description: "আধুনিক ও দ্বীনি শিক্ষার সমন্বয়ে পরিচালিত একটি আদর্শ ইসলামিক স্কুল।",
    address: "বরিশাল সদর, বরিশাল",
    phone: "০১১১২-৩৪৫৬৭৮",
    email: "info@islamic-academy-barisal.edu",
    rating: 4.2,
    featured: false,
    courses: ["জেনারেল শিক্ষা", "আরবি ভাষা", "কুরআন", "হাদিস"],
    facilities: ["লাইব্রেরি", "ক্যাফেটেরিয়া", "মসজিদ", "কম্পিউটার ল্যাব"],
    image: madrasaCampus4.src,
  },
  {
    id: "10",
    name: "জামিয়া ইমদাদিয়া ময়মনসিংহ",
    division: "ময়মনসিংহ",
    district: "ময়মনসিংহ",
    thana: "ময়মনসিংহ সদর",
    category: "জামিয়া",
    board: "বেফাকুল মাদারিসিল আরাবিয়া",
    established: "১৯৭৫",
    students: 900,
    teachers: 40,
    description: "ময়মনসিংহ বিভাগের সবচেয়ে বড় কওমি মাদ্রাসা। দীর্ঘ ইতিহাস ও ঐতিহ্যের অধিকারী।",
    address: "ময়মনসিংহ সদর, ময়মনসিংহ",
    phone: "০১৫১২-৯৮৭৬৫৪",
    email: "info@imdadiya-mymensingh.edu",
    rating: 4.6,
    featured: true,
    courses: ["হিফজুল কুরআন", "কিতাব বিভাগ", "দাওরায়ে হাদিস", "ইফতা"],
    facilities: ["লাইব্রেরি", "হোস্টেল", "মসজিদ", "খেলার মাঠ"],
    image: madrasaCampus5.src,
  },
];
