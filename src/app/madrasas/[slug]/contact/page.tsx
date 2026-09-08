import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { MadrasaService } from "@/services/madrasa.service";
import ContactTab from "@/components/profile/tabs/ContactTab";

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

export default async function MadrasaContactPage({ params }: Props) {
  const { slug } = await params;
  const madrasaRaw = await getCachedMadrasaProfile(slug);

  if (!madrasaRaw) {
    notFound();
  }

  const madrasa = JSON.parse(JSON.stringify(madrasaRaw));

  return <ContactTab madrasa={madrasa} />;
}
