import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { MadrasaService } from "@/services/madrasa.service";
import AboutPageClient from "../AboutPageClient";

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

export default async function MadrasaAboutPage({ params }: Props) {
  const { slug } = await params;
  const madrasaRaw = await getCachedMadrasaProfile(slug);

  if (!madrasaRaw) {
    notFound();
  }

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

  return <AboutPageClient madrasa={displayMadrasa} />;
}
