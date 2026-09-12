"use client";

import AdmissionTab from "@/components/profile/tabs/AdmissionTab";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function AdmissionPageClient({ madrasa }: { madrasa: any }) {
  const { content } = useSiteContent();
  return (
    <AdmissionTab 
      pc={content.profile} 
      madrasa={madrasa}
    />
  );
}
