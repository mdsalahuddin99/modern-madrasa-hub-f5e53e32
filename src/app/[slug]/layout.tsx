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
      canonical: `/${slug}`,
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

// We don't import Navbar and Footer here anymore. We will use a minimal header.
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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

  const hasGallery = (displayMadrasa.galleryImages && displayMadrasa.galleryImages.length > 0) || (displayMadrasa.galleryVideos && displayMadrasa.galleryVideos.length > 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col selection:bg-primary/10 relative">
      {/* Premium Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[30%] h-[30%] rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px]" />
      </div>

      {/* Unified Header & Navigation */}
      <div className="sticky top-0 z-50 w-full bg-white/95 dark:bg-background/95 backdrop-blur-lg border-b border-border/40 shadow-sm">
        <div className="container mx-auto px-4 max-w-[1400px] flex items-center justify-between gap-4">
          <Link 
            href="/madrasas" 
            className="shrink-0 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-muted/30 px-3 py-1.5 rounded-full hover:bg-muted/60 my-2 lg:my-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ফিরে যান</span>
          </Link>
          
          <div className="flex-1 flex justify-end lg:justify-center">
            <ProfileNavigation madrasa={displayMadrasa as any} madrasaSlug={slug} hasGallery={hasGallery} />
          </div>
          
          <div className="shrink-0 text-xs font-semibold text-muted-foreground/60 hidden sm:block tracking-wide">
            MODERN MADRASA HUB
          </div>
        </div>
      </div>

      <main className="flex-1 pb-24 lg:pb-32 relative z-10">

        <ProfileHeaderWrapper madrasa={displayMadrasa as any} />

        <div className="container mx-auto px-5 mt-10 lg:mt-16 max-w-7xl">
          <div className="flex flex-col gap-10 lg:gap-14 pb-12 min-h-[40vh]">
            {children}
          </div>

          <div className="mt-12 lg:mt-16">
             <ShareSection madrasaId={displayMadrasa.id} madrasaName={displayMadrasa.name} />
          </div>
        </div>
      </main>
    </div>
  );
}
