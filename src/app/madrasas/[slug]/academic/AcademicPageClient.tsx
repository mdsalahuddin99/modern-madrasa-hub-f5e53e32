"use client";

import AcademicTab from "@/components/profile/tabs/AcademicTab";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function AcademicPageClient({ madrasa }: { madrasa: any }) {
  const { content } = useSiteContent();
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AcademicTab 
        madrasa={madrasa}
        pc={content.profile} 
      />
    </div>
  );
}
