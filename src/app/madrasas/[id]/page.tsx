// ===================================================
// Madrasa Profile Page — মাদ্রাসা প্রোফাইল (Dynamic Route)
// Enhanced with database health check and better error handling
// ===================================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MadrasaProfileClient from "./MadrasaProfileClient";
import { MadrasaService } from "@/services/madrasa.service";

// Dynamic SEO metadata with better error handling
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const madrasa = await MadrasaService.getById(id);

    if (madrasa) {
      return {
        title: `${madrasa.name} — কওমি মাদ্রাসা ডিরেক্টরি`,
        description: madrasa.description?.slice(0, 160) || "মাদ্রাসার বিস্তারিত তথ্য",
        openGraph: {
          title: `${madrasa.name} — কওমি মাদ্রাসা ডিরেক্টরি`,
          description: madrasa.description?.slice(0, 160) || "মাদ্রাসার বিস্তারিত তথ্য",
          type: "website",
          locale: "bn_BD",
        },
        twitter: {
          card: "summary_large_image",
          title: `${madrasa.name} — কওমি মাদ্রাসা ডিরেক্টরি`,
          description: madrasa.description?.slice(0, 160) || "মাদ্রাসার বিস্তারিত তথ্য",
        },
      };
    }

    return { 
      title: "মাদ্রাসা পাওয়া যায়নি",
      description: "দুঃখিত, এই মাদ্রাসাটি খুঁজে পাওয়া যায়নি।"
    };
  } catch (error) {
    console.error("Error generating metadata for madrasa:", error);
    return { 
      title: "মাদ্রাসা প্রোফাইল",
      description: "মাদ্রাসার বিস্তারিত তথ্য"
    };
  }
}

export default async function MadrasaProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const madrasa = await MadrasaService.getById(id);

    if (madrasa) {
      console.info(`✅ Successfully loaded madrasa: ${madrasa.name} (${id})`);
      return <MadrasaProfileClient madrasa={JSON.parse(JSON.stringify(madrasa))} />;
    }

    console.warn(`❌ Madrasa with ID ${id} not found in database.`);
    notFound();
    
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "NEXT_HTTP_ERROR_FALLBACK;404") {
      throw error;
    }
    
    console.error("❌ Critical error in MadrasaProfilePage:", (error as Error).message);
    notFound();
  }
}