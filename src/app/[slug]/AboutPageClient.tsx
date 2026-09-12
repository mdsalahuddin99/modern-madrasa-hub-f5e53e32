"use client";

import AboutTab from "@/components/profile/tabs/AboutTab";
import StudentsTeachersTab from "@/components/profile/tabs/StudentsTeachersTab";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function AboutPageClient({ madrasa }: { madrasa: any }) {
  const { content } = useSiteContent();
  return (
    <div className="flex flex-col gap-12 lg:gap-16">
      <div id="about">
        <AboutTab madrasa={madrasa} pc={content.profile} />
      </div>
      
      <div id="teachers" className="scroll-mt-24 pt-4 border-t border-border/30">
        <StudentsTeachersTab madrasa={madrasa} />
      </div>
    </div>
  );
}
