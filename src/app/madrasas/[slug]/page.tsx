import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import MadrasaProfileClient from "./MadrasaProfileClient";
import { MadrasaService } from "@/services/madrasa.service";

interface Props {
  params: Promise<{ slug: string }>;
}

const getCachedMadrasaProfile = unstable_cache(
  async (slug: string) => {
    return MadrasaService.getBySlug(slug);
  },
  ["madrasa-profile"], // The slug is automatically appended by unstable_cache, but we can be explicit if we want
  { tags: ["madrasa-profile", "madrasas"], revalidate: 3600 }
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

export default async function MadrasaProfilePage({ params }: Props) {
  const { slug } = await params;
  const madrasa = await getCachedMadrasaProfile(slug);

  if (!madrasa) {
    notFound();
  }

  return <MadrasaProfileClient madrasa={JSON.parse(JSON.stringify(madrasa))} />;
}
