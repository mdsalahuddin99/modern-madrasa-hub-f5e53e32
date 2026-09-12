import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { MadrasaService } from "@/services/madrasa.service";
import GalleryTab from "@/components/profile/tabs/GalleryTab";

interface Props {
  params: Promise<{ slug: string }>;
}

const getCachedMadrasaProfile = unstable_cache(
  async (slug: string) => {
    return MadrasaService.getBySlug(slug);
  },
  ["madrasa-profile"],
  { tags: ["madrasa-profile", "madrasas"], revalidate: 3600 }
);

export default async function MadrasaGalleryPage({ params }: Props) {
  const { slug } = await params;
  const madrasaRaw = await getCachedMadrasaProfile(slug);

  if (!madrasaRaw) {
    notFound();
  }

  const madrasa = JSON.parse(JSON.stringify(madrasaRaw));

  if (!madrasa.galleryImages?.length && !madrasa.galleryVideos?.length) {
    return <div className="text-center p-10 text-muted-foreground">কোনো মিডিয়া পাওয়া যায়নি।</div>;
  }

  const images = madrasa.galleryImages?.map((img: any) => ({
    src: img.url,
    alt: img.caption || madrasa.name,
  })) || [];
  
  const videos = madrasa.galleryVideos?.map((vid: any) => ({
    url: vid.youtubeUrl,
    title: vid.title || "Video",
  })) || [];

  return <GalleryTab images={images} videos={videos} label="গ্যালারি" />;
}
