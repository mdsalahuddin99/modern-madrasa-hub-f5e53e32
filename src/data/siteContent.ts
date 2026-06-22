// Central content store for ALL public pages — editable from Admin panel

export interface HeroContent {
  subtitle: string;
  title: string;
  titleHighlight: string;
  description: string;
  searchBtnText: string;
  registerBtnText: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export interface CategoryItem {
  name: string;
  count: string;
  desc: string;
}

export interface StepItem {
  num: string;
  title: string;
  desc: string;
}

export interface BoardItem {
  name: string;
  abbr: string;
}

export interface CTAContent {
  title: string;
  titleLine2: string;
  description: string;
  benefits: string[];
  buttonText: string;
}

export interface FooterContent {
  siteName: string;
  siteDescription: string;
  phone: string;
  email: string;
  address: string;
  copyright: string;
  linksTitle: string;
  servicesTitle: string;
  contactTitle: string;
  serviceLinks: { label: string; href: string }[];
}

export interface FeaturedSectionContent {
  badge: string;
  title: string;
  viewAllText: string;
  detailsText: string;
}

export interface HowItWorksContent {
  badge: string;
  title: string;
}

export interface CategoriesContent {
  badge: string;
  title: string;
  subtitle: string;
}

export interface BoardsSectionContent {
  badge: string;
  title: string;
  subtitle: string;
}

export interface SearchSectionContent {
  badge: string;
  title: string;
  subtitle: string;
  buttonText: string;
}

export interface PageHeader {
  title: string;
  subtitle: string;
}

export interface NavbarContent {
  siteName: string;
  links: { label: string; href: string }[];
}

export interface DepartmentItem {
  name: string;
  students: string;
  desc: string;
}

export interface GalleryImageItem {
  src: string;
  alt: string;
}

export interface ProfileContent {
  principalMessageTitle: string;
  principalMessage: string;
  principalName: string;
  principalRole: string;
  departmentsTitle: string;
  departments: DepartmentItem[];
  admissionTitle: string;
  admissionRules: string[];
  galleryImages: GalleryImageItem[];
  sectionLabels: {
    intro: string;
    courses: string;
    gallery: string;
    facilities: string;
  };
}

export interface AboutPageContent {
  title: string;
  subtitle: string;
  mission: { title: string; description: string };
  vision: { title: string; description: string };
  features: { title: string; items: { title: string; desc: string }[] };
}

export interface ContactPageContent {
  title: string;
  subtitle: string;
  formTitle: string;
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  buttonText: string;
  infoTitle: string;
  phone: string;
  email: string;
  address: string;
  officeHours: string;
}

export interface MadrasaListPageContent {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  noResultTitle: string;
  noResultDesc: string;
  clearFilterText: string;
  resultCountPrefix: string;
  resultCountSuffix: string;
}

export interface SiteContent {
  hero: HeroContent;
  stats: StatItem[];
  categories: CategoriesContent & { items: CategoryItem[] };
  howItWorks: HowItWorksContent & { steps: StepItem[] };
  boards: BoardsSectionContent & { items: BoardItem[] };
  featured: FeaturedSectionContent;
  cta: CTAContent;
  footer: FooterContent;
  search: SearchSectionContent;
  navbar: NavbarContent;
  profile: ProfileContent;
  pages: {
    madrasaList: MadrasaListPageContent;
    about: AboutPageContent;
    contact: ContactPageContent;
    register: PageHeader;
    subscription: PageHeader;
    install: PageHeader & { description: string };
    login: { title: string; subtitle: string };
    signup: { title: string; subtitle: string; buttonText: string };
  };
}

export const defaultSiteContent: SiteContent = {
  hero: {
    subtitle: "বাংলাদেশের সর্ববৃহৎ মাদ্রাসা ডিরেক্টরি",
    title: "দ্বীনি শিক্ষার",
    titleHighlight: "সঠিক ঠিকানা",
    description: "সকল কওমি মাদ্রাসার তথ্য এক জায়গায়। সহজেই খুঁজে নিন আপনার কাঙ্ক্ষিত দ্বীনি শিক্ষা প্রতিষ্ঠান।",
    searchBtnText: "মাদ্রাসা খুঁজুন",
    registerBtnText: "নিবন্ধন করুন",
  },
  stats: [
    { value: 500, suffix: "+", label: "নিবন্ধিত মাদ্রাসা" },
    { value: 10000, suffix: "+", label: "তালিবে ইলম" },
    { value: 64, suffix: "", label: "জেলায় বিস্তৃত" },
    { value: 100, suffix: "%", label: "সত্যয়িত তথ্য" },
  ],
  categories: {
    badge: "বিভাগসমূহ",
    title: "মাদ্রাসা বিভাগসমূহ",
    subtitle: "আপনার প্রয়োজন অনুযায়ী বিভাগ নির্বাচন করুন",
    items: [
      { name: "জামিয়া", count: "১২০+", desc: "উচ্চতর দ্বীনি শিক্ষা প্রতিষ্ঠান" },
      { name: "আলিয়া মাদ্রাসা", count: "৯০+", desc: "সরকারি সিলেবাসভুক্ত মাদ্রাসা" },
      { name: "মাদ্রাসা", count: "২০০+", desc: "সাধারণ দ্বীনি শিক্ষা প্রতিষ্ঠান" },
      { name: "হিফজুল কুরআন", count: "৮৫+", desc: "কুরআন মুখস্থকরণ বিভাগ" },
      { name: "নূরানী", count: "১৫০+", desc: "প্রাথমিক কুরআন শিক্ষা" },
      { name: "মহিলা মাদ্রাসা", count: "৬০+", desc: "মহিলাদের জন্য বিশেষায়িত" },
      { name: "ইসলামিক স্কুল", count: "৪৫+", desc: "আধুনিক ও দ্বীনি মিশ্র শিক্ষা" },
      { name: "উচ্চতর শিক্ষা প্রতিষ্ঠান", count: "৩০+", desc: "ইফতা, হাদিস, তাফসীর, আদব বিভাগ" },
      { name: "অন্যান্য", count: "৪০+", desc: "অন্যান্য ধরনের প্রতিষ্ঠান" },
    ],
  },
  howItWorks: {
    badge: "কিভাবে কাজ করে",
    title: "সহজ ৩ ধাপে শুরু করুন",
    steps: [
      { num: "০১", title: "মাদ্রাসা খুঁজুন", desc: "বিভাগ, জেলা বা থানা অনুযায়ী আপনার পছন্দের মাদ্রাসাটি সার্চ করুন।" },
      { num: "০২", title: "তথ্য যাচাই", desc: "মাদ্রাসার বিস্তারিত প্রোফাইল ও শিক্ষার মান সম্পর্কে নিশ্চিত হোন।" },
      { num: "০৩", title: "যোগাযোগ করুন", desc: "প্রদত্ত নম্বরে কল করে ভর্তি বা অন্যান্য বিষয়ে কথা বলুন।" },
    ],
  },
  boards: {
    badge: "অনুমোদিত",
    title: "শিক্ষা বোর্ডসমূহ",
    subtitle: "বাংলাদেশের স্বীকৃত সকল শিক্ষা বোর্ডের তালিকা",
    items: [
      { name: "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ", abbr: "বেফাক" },
      { name: "বেফাকুল মাদারিসিল কওমিয়া গওহরডাঙ্গা বাংলাদেশ", abbr: "গওহরডাঙ্গা" },
      { name: "আঞ্জুমানে ইত্তেহাদুল মাদারিস বাংলাদেশ", abbr: "ইত্তেহাদ" },
      { name: "আযাদ দ্বীনী এদারায়ে তালীম বাংলাদেশ", abbr: "আযাদ" },
      { name: "তানজিমুল মাদারিসিদ দ্বীনিয়া বাংলাদেশ", abbr: "তানজিম" },
      { name: "বেফাকুল মাদারিসিল দ্বীনিয়া বাংলাদেশ (জাতীয় দ্বীনি মাদ্রাসা শিক্ষা বোর্ড)", abbr: "জাতীয়" },
    ],
  },
  featured: {
    badge: "শীর্ষ প্রতিষ্ঠান",
    title: "শীর্ষ মাদ্রাসাসমূহ",
    viewAllText: "সকল দেখুন",
    detailsText: "বিস্তারিত দেখুন",
  },
  cta: {
    title: "আপনার মাদ্রাসা",
    titleLine2: "তালিকাভুক্ত করুন",
    description: "দেশের সর্ববৃহৎ কওমি মাদ্রাসা ডিরেক্টরিতে আপনার প্রতিষ্ঠানের তথ্য যুক্ত করুন।",
    benefits: ["বিনামূল্যে তালিকাভুক্তি", "২৪/৭ সাপোর্ট", "১ মিনিটেই নিবন্ধন", "সত্যয়িত প্রোফাইল ব্যাজ"],
    buttonText: "মাদ্রাসা যুক্ত করুন",
  },
  footer: {
    siteName: "মাদ্রাসা ডিরেক্টরি",
    siteDescription: "বাংলাদেশের সর্ববৃহৎ কওমি মাদ্রাসা ডিরেক্টরি প্ল্যাটফর্ম।",
    phone: "+৮৮০ ১৭০০-০০০০০০",
    email: "info@madrasa.bd",
    address: "ঢাকা, বাংলাদেশ",
    copyright: "© ২০২৬ মাদ্রাসা ডিরেক্টরি। সর্বস্বত্ব সংরক্ষিত।",
    linksTitle: "লিংক",
    servicesTitle: "সেবা",
    contactTitle: "যোগাযোগ",
    serviceLinks: [
      { label: "ভর্তি তথ্য", href: "#" },
      { label: "শিক্ষা বোর্ড", href: "#" },
      { label: "প্রশ্নোত্তর", href: "#" },
    ],
  },
  search: {
    badge: "অনুসন্ধান",
    title: "আপনার পছন্দের মাদ্রাসা খুঁজুন",
    subtitle: "বিভাগ, জেলা, থানা বা ক্যাটাগরি অনুযায়ী ফিল্টার করে সহজেই আপনার কাঙ্ক্ষিত মাদ্রাসা খুঁজে নিন।",
    buttonText: "অনুসন্ধান করুন",
  },
  profile: {
    principalMessageTitle: "মুহতামিমের বাণী",
    principalMessage: "আমাদের প্রতিষ্ঠানে শিক্ষার্থীদের দ্বীনি ও দুনিয়াবি উভয় শিক্ষায় পারদর্শী করে তোলাই আমাদের মূল লক্ষ্য। আমরা বিশ্বাস করি, উন্নত চরিত্র গঠন ও জ্ঞান অর্জনের মাধ্যমে একটি আদর্শ সমাজ গড়ে তোলা সম্ভব। আমাদের অভিজ্ঞ শিক্ষকমণ্ডলী প্রতিটি শিক্ষার্থীর সর্বোত্তম বিকাশে নিরলসভাবে কাজ করে যাচ্ছেন।",
    principalName: "মুহতামিম সাহেব",
    principalRole: "প্রধান পরিচালক",
    departmentsTitle: "বিভাগসমূহ",
    departments: [
      { name: "হিফজুল কুরআন বিভাগ", students: "৩০০+", desc: "পবিত্র কুরআন হিফজের জন্য বিশেষায়িত বিভাগ" },
      { name: "কিতাব বিভাগ", students: "৫০০+", desc: "ইসলামি জ্ঞানের বিভিন্ন শাখায় গভীর অধ্যয়ন" },
      { name: "দাওরায়ে হাদিস", students: "২০০+", desc: "হাদিস শাস্ত্রে সর্বোচ্চ স্তরের শিক্ষা" },
      { name: "নূরানী বিভাগ", students: "২০০+", desc: "শিশুদের প্রাথমিক কুরআন শিক্ষা" },
    ],
    admissionTitle: "ভর্তির নিয়মাবলী",
    admissionRules: [
      "ভর্তি পরীক্ষায় উত্তীর্ণ হতে হবে",
      "পূর্ববর্তী শ্রেণির সনদপত্র জমা দিতে হবে",
      "অভিভাবকের সম্মতিপত্র আবশ্যক",
      "ভর্তি ফি ও মাসিক বেতন নির্ধারিত সময়ে পরিশোধ করতে হবে",
      "প্রতিষ্ঠানের নিয়মাবলী মেনে চলতে সম্মত হতে হবে",
    ],
    galleryImages: [],
    sectionLabels: {
      intro: "পরিচিতি",
      courses: "কোর্সসমূহ",
      gallery: "ক্যাম্পাস গ্যালারি",
      facilities: "সুবিধাসমূহ",
    },
  },
  navbar: {
    siteName: "মাদ্রাসা ডিরেক্টরি",
    links: [
      { label: "হোম", href: "/" },
      { label: "তালিকা", href: "/madrasas" },
      { label: "নিবন্ধন", href: "/signup" },
      { label: "সম্পর্কে", href: "/about" },
      { label: "যোগাযোগ", href: "/contact" },
    ],
  },
  pages: {
    madrasaList: {
      title: "মাদ্রাসা তালিকা",
      subtitle: "বাংলাদেশের সকল নিবন্ধিত মাদ্রাসার তালিকা ও বিস্তারিত তথ্য",
      searchPlaceholder: "মাদ্রাসার নাম...",
      noResultTitle: "কোনো মাদ্রাসা পাওয়া যায়নি",
      noResultDesc: "আপনার ফিল্টার অনুযায়ী কোনো মাদ্রাসা খুঁজে পাওয়া যায়নি।",
      clearFilterText: "সকল ফিল্টার মুছুন",
      resultCountPrefix: "মোট",
      resultCountSuffix: "টি মাদ্রাসা পাওয়া গেছে",
    },
    about: {
      title: "আমাদের সম্পর্কে",
      subtitle: "বাংলাদেশের সর্ববৃহৎ কওমি মাদ্রাসা ডিরেক্টরি প্ল্যাটফর্ম",
      mission: {
        title: "আমাদের মিশন",
        description: "বাংলাদেশের সকল কওমি মাদ্রাসার তথ্য একটি কেন্দ্রীয় প্ল্যাটফর্মে সংগ্রহ করে দ্বীনি শিক্ষা প্রতিষ্ঠানসমূহের প্রচার ও প্রসারে সহায়তা করা। অভিভাবক ও শিক্ষার্থীদের সঠিক মাদ্রাসা নির্বাচনে সাহায্য করা আমাদের প্রধান লক্ষ্য।",
      },
      vision: {
        title: "আমাদের ভিশন",
        description: "একটি ডিজিটাল বাংলাদেশ গড়ে তোলা যেখানে প্রতিটি দ্বীনি শিক্ষা প্রতিষ্ঠান আধুনিক প্রযুক্তির মাধ্যমে সকলের কাছে পরিচিত ও সহজলভ্য হবে।",
      },
      features: {
        title: "আমাদের সেবাসমূহ",
        items: [
          { title: "সত্যায়িত তথ্য", desc: "প্রতিটি মাদ্রাসার তথ্য যাচাই করে প্রকাশ করা হয়" },
          { title: "সহজ অনুসন্ধান", desc: "বিভাগ, জেলা, থানা অনুযায়ী সহজে মাদ্রাসা খুঁজুন" },
          { title: "বিনামূল্যে তালিকাভুক্তি", desc: "যেকোনো মাদ্রাসা বিনামূল্যে তালিকাভুক্ত হতে পারে" },
          { title: "২৪/৭ সাপোর্ট", desc: "যেকোনো সমস্যায় আমাদের সাথে যোগাযোগ করুন" },
        ],
      },
    },
    contact: {
      title: "যোগাযোগ করুন",
      subtitle: "আমাদের সাথে যোগাযোগ করতে নিচের ফর্মটি পূরণ করুন অথবা সরাসরি কল করুন",
      formTitle: "মেসেজ পাঠান",
      nameLabel: "আপনার নাম",
      emailLabel: "ইমেইল ঠিকানা",
      messageLabel: "আপনার মেসেজ",
      buttonText: "মেসেজ পাঠান",
      infoTitle: "যোগাযোগের তথ্য",
      phone: "+৮৮০ ১৭০০-০০০০০০",
      email: "info@madrasa.bd",
      address: "ঢাকা, বাংলাদেশ",
      officeHours: "শনিবার - বৃহস্পতিবার: সকাল ৯টা - বিকাল ৫টা",
    },
    register: {
      title: "মাদ্রাসা নিবন্ধন",
      subtitle: "আপনার মাদ্রাসার তথ্য দিন এবং আমাদের ডিরেক্টরিতে যুক্ত হন",
    },
    subscription: {
      title: "সাবস্ক্রিপশন",
      subtitle: "আপনার মাদ্রাসার প্রোফাইল পাবলিক করতে সাবস্ক্রিপশন প্ল্যান নির্বাচন করুন",
    },
    install: {
      title: "অ্যাপটি ইনস্টল করুন",
      subtitle: "মাদ্রাসা ডিরেক্টরি অ্যাপটি আপনার ফোনে ইনস্টল করে নেটিভ অ্যাপের মতো ব্যবহার করুন — দ্রুত, অফলাইন সক্ষম।",
      description: "মাদ্রাসা ডিরেক্টরি অ্যাপটি আপনার ফোনে ইনস্টল করে নেটিভ অ্যাপের মতো ব্যবহার করুন — দ্রুত, অফলাইন সক্ষম।",
    },
    login: {
      title: "স্বাগতম",
      subtitle: "আপনার অ্যাকাউন্টে লগইন করুন",
    },
    signup: {
      title: "অ্যাকাউন্ট তৈরি করুন",
      subtitle: "মাদ্রাসা পরিচালক হিসেবে নিবন্ধন করুন",
      buttonText: "রেজিস্ট্রেশন করুন",
    },
  },
};

export const getSiteContent = (): SiteContent => defaultSiteContent;
export const saveSiteContent = (content: SiteContent) => {
  // Placeholder since data is being migrated to Prisma DB
  console.log("saveSiteContent is disabled. Please migrate to database updates.");
};
