import { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileHeaderWrapper from "@/components/profile/ProfileHeaderWrapper";
import ShareSection from "@/components/profile/ShareSection";
import ProfileNavigation from "@/components/profile/ProfileNavigation";
import { MadrasaService } from "@/services/madrasa.service";

interface Props {
  params: Promise<{ domain: string }>;
  children: React.ReactNode;
}

const getCachedMadrasaProfile = unstable_cache(
  async (domain: string) => {
    return MadrasaService.getByCustomDomain(domain);
  },
  ["madrasa-custom-domain"],
  { tags: ["madrasa-profile", "madrasas"], revalidate: 3600 }
);

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { domain } = await params;
  const madrasa = await getCachedMadrasaProfile(domain);

  if (!madrasa) {
    return {
      title: "মাদ্রাসা পাওয়া যায়নি",
    };
  }

  const title = `${madrasa.name}`;
  const description = madrasa.description || `${madrasa.name} এর ওয়েবসাইট।`;

  return {
    title,
    description,
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

export default async function SiteLayout({ params, children }: Props) {
  const { domain } = await params;
  const madrasaRaw = await getCachedMadrasaProfile(domain);

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

      <main className="flex-1 pb-24 lg:pb-32 relative z-10 pt-4">
        {/* Secondary Madrasa Menu System */}
        <div className="lg:sticky lg:top-0 z-40 w-full lg:bg-white/95 lg:dark:bg-background/95 lg:backdrop-blur-md lg:border-b lg:border-border/40 lg:shadow-sm">
          <div className="container mx-auto px-0 lg:px-5 max-w-7xl">
            {/* basePath="" tells the ProfileNavigation to use root path / instead of /madrasas/slug */}
            <ProfileNavigation madrasa={displayMadrasa as any} madrasaSlug={displayMadrasa.slug} hasGallery={hasGallery} basePath="" />
          </div>
        </div>

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
