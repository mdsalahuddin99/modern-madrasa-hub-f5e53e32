import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { MadrasaService } from "@/services/madrasa.service";
import StudentsTeachersTab from "@/components/profile/tabs/StudentsTeachersTab";

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

export default async function TeachersPage({ params }: Props) {
  const { slug } = await params;
  const madrasaRaw = await getCachedMadrasaProfile(slug);

  if (!madrasaRaw) {
    notFound();
  }

  const madrasa = JSON.parse(JSON.stringify(madrasaRaw));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <StudentsTeachersTab madrasa={madrasa} />
    </div>
  );
}
