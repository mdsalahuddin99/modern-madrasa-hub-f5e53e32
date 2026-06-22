
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
