"use client";

import AdmissionTab from "@/components/profile/tabs/AdmissionTab";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function AdmissionPageClient({ 
  admissionFile, 
  admissionFileType 
}: { 
  admissionFile?: string; 
  admissionFileType?: string; 
}) {
  const { content } = useSiteContent();
  return (
    <AdmissionTab 
      pc={content.profile} 
      admissionFile={admissionFile} 
      admissionFileType={admissionFileType} 
    />
  );
}
