// ===================================================
// Madrasa Profile Page — মাদ্রাসা প্রোফাইল (Dynamic Route)
// Enhanced with database health check and better error handling
// ===================================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MadrasaProfileClient from "./MadrasaProfileClient";
import { MadrasaService } from "@/services/madrasa.service";
import { auth } from "@/lib/auth";

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

export default async function MadrasaProfilePage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { id } = await props.params;
  const { preview } = await props.searchParams;

  try {
    const madrasa = await MadrasaService.getById(id);

    if (madrasa) {
      const session = await auth();
      const isAdmin = session?.user?.role?.toUpperCase() === "ADMIN";
      const isOwner = session?.user?.id === madrasa.directorId;

      // 7-day trial visibility logic
      const trialDays = 7;
      const trialEndDate = new Date(madrasa.createdAt);
      trialEndDate.setDate(trialEndDate.getDate() + trialDays);
      const isTrialActive = new Date() <= trialEndDate;
      const hasActiveSubscription = madrasa.director?.subscriptionActive;

      const isVisibleToPublic = isTrialActive || hasActiveSubscription;

      if ((madrasa.status !== "APPROVED" || !isVisibleToPublic) && !isAdmin && !isOwner) {
        console.warn(`🔒 Madrasa with ID ${id} is not accessible (Not approved or Subscription/Trial expired).`);
        notFound();
      }

      console.info(`✅ Successfully loaded madrasa: ${madrasa.name} (${id})`);
      return (
        <>
          {preview === "true" && (madrasa.status !== "APPROVED" || !isVisibleToPublic) && (
            <div className="bg-amber-500 text-amber-950 px-4 py-2 text-center text-sm font-bold shadow-sm z-50 relative">
              ⚠️ এটি একটি প্রিভিউ ভিউ। আপনার প্রোফাইলটি এখনো অনুমোদিত হয়নি বা সাবস্ক্রিপশন মেয়াদোত্তীর্ণ হওয়ায় পাবলিক ওয়েবসাইটে দৃশ্যমান নয়।
            </div>
          )}
          <MadrasaProfileClient madrasa={JSON.parse(JSON.stringify(madrasa))} />
        </>
      );
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