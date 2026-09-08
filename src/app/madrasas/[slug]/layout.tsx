import { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileHeaderWrapper from "@/components/profile/ProfileHeaderWrapper";
import ShareSection from "@/components/profile/ShareSection";
import ProfileNavigation from "@/components/profile/ProfileNavigation";
import { MadrasaService } from "@/services/madrasa.service";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

const getCachedMadrasaProfile = unstable_cache(
  async (slug: string) => {
    return MadrasaService.getBySlug(slug);
  },
  ["madrasa-profile"],
  { tags: ["madrasa-profile", "madrasas"], revalidate: 3600 }
);

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { slug } = await params;
  const madrasa = await getCachedMadrasaProfile(slug);

  if (!madrasa) {
    return {
      title: "মাদ্রাসা পাওয়া যায়নি",
    };
  }

  const title = `${madrasa.name} | কওমি মাদ্রাসা ডিরেক্টরি`;
  const description = madrasa.description || `${madrasa.name} এর বিস্তারিত প্রোফাইল। ক্যাটাগরি: ${madrasa.category}, বোর্ড: ${madrasa.board}।`;

  return {
    title,
    description,
    alternates: {
      canonical: `/madrasas/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "bn_BD",
      images: madrasa.bannerImage || madrasa.image ? [
        {
          url: madrasa.bannerImage || madrasa.image || "",
          width: 1200,
          height: 630,
          alt: madrasa.name,
        }
      ] : [],
    },
  };
}

export default async function MadrasaProfileLayout({ params, children }: Props) {
  const { slug } = await params;
  const madrasaRaw = await getCachedMadrasaProfile(slug);

  if (!madrasaRaw) {
    notFound();
  }

  // Parse strings into objects if necessary based on existing logic
  const madrasa = JSON.parse(JSON.stringify(madrasaRaw));
  const displayMadrasa = {
    ...madrasa,
    courses: Array.isArray(madrasa.courses) 
      ? madrasa.courses.map((c: any) => typeof c === 'string' ? c : c.name) 
      : [],
    facilities: Array.isArray(madrasa.facilities) 
      ? madrasa.facilities.map((f: any) => typeof f === 'string' ? f : f.name) 
      : [],
  };

  const hasGallery = displayMadrasa.galleryImages && displayMadrasa.galleryImages.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col selection:bg-primary/10 relative">
      {/* Premium Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[30%] h-[30%] rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px]" />
      </div>

      <Navbar />

      <main className="flex-1 pb-24 lg:pb-32 relative z-10 pt-20 lg:pt-28">
        {/* Secondary Madrasa Menu System */}
        <div className="hidden lg:block sticky top-[72px] lg:top-[88px] z-40 w-full bg-white/95 dark:bg-background/95 backdrop-blur-md border-b border-border/40 shadow-sm">
          <div className="container mx-auto px-5 max-w-7xl">
            <ProfileNavigation madrasa={displayMadrasa as any} madrasaSlug={slug} hasGallery={hasGallery} />
          </div>
        </div>

        <ProfileHeaderWrapper madrasa={displayMadrasa as any} />

        <div className="container mx-auto px-5 mt-10 lg:mt-16 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16 items-start">

            <div className="min-w-0">

              {/* Main Content Sections (Dynamic Children) */}
              <div className="flex flex-col gap-10 lg:gap-14 pb-12 min-h-[40vh]">
                {children}
              </div>

              <div className="mt-12 lg:mt-16">
                 <ShareSection madrasaId={displayMadrasa.id} madrasaName={displayMadrasa.name} />
              </div>
            </div>

            {/* Sidebar remains visible on large screens */}
            <div className="hidden lg:block sticky top-32">
              <ProfileSidebar madrasa={displayMadrasa as any} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
