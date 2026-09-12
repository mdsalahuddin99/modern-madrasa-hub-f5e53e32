import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { MadrasaService } from "@/services/madrasa.service";
import NoticeDetailsClient from "./NoticeDetailsClient";

interface Props {
  params: Promise<{ slug: string; noticeSlug: string }>;
}

const getCachedMadrasaProfile = unstable_cache(
  async (slug: string) => {
    return MadrasaService.getBySlug(slug);
  },
  ["madrasa-profile"],
  { tags: ["madrasa-profile", "madrasas"], revalidate: 3600 }
);

export default async function NoticeDetailsPage({ params }: Props) {
  const { slug, noticeSlug } = await params;
  const madrasaRaw = await getCachedMadrasaProfile(slug);

  if (!madrasaRaw) {
    notFound();
  }

  const madrasa = JSON.parse(JSON.stringify(madrasaRaw));
  const notice = madrasa.contents?.find((c: any) => c.slug === noticeSlug || c.title.toLowerCase().replace(/ /g, '-') === noticeSlug || noticeSlug === 'general' || noticeSlug === 'exam' || noticeSlug === 'holiday');

  if (!notice) {
    // If the slug doesn't perfectly match a dynamic notice (e.g. for static links), we can still render a fallback or generic notice
    if (['general', 'exam', 'holiday'].includes(noticeSlug)) {
        return <NoticeDetailsClient madrasa={madrasa} notice={{ title: "নোটিশ বিস্তারিত", content: "বিস্তারিত তথ্য শীঘ্রই আসছে...", createdAt: new Date().toISOString(), type: "NOTICE" }} />;
    }
    notFound();
  }

  return <NoticeDetailsClient madrasa={madrasa} notice={notice} />;
}
