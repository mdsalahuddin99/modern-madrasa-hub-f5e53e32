"use client";

import { useSiteContent } from "@/hooks/useSiteContent";
import AboutTab from "@/components/profile/tabs/AboutTab";
import StudentsTeachersTab from "@/components/profile/tabs/StudentsTeachersTab";
import AdmissionTab from "@/components/profile/tabs/AdmissionTab";
import GalleryTab from "@/components/profile/tabs/GalleryTab";
import NoticeTab from "@/components/profile/tabs/NoticeTab";
import ContactTab from "@/components/profile/tabs/ContactTab";

export default function HomePageClient({ madrasa }: { madrasa: any }) {
  const { content } = useSiteContent();
  const pc = content.profile;

  return (
    <div className="flex flex-col gap-16 pb-12">
      <section id="about" className="scroll-mt-32">
        <AboutTab madrasa={madrasa} pc={pc} />
      </section>

      <div className="w-full h-px bg-border/40" />

      <section id="academic" className="scroll-mt-32">
        <StudentsTeachersTab madrasa={madrasa} />
      </section>

      <div className="w-full h-px bg-border/40" />

      <section id="admission" className="scroll-mt-32">
        <AdmissionTab pc={pc} madrasa={madrasa} />
      </section>

      {madrasa.galleryImages && madrasa.galleryImages.length > 0 && (
        <>
          <div className="w-full h-px bg-border/40" />
          <section id="gallery" className="scroll-mt-32">
            <GalleryTab 
              images={madrasa.galleryImages.map((img: any) => ({ src: img.url, alt: img.caption || madrasa.name }))} 
              label="গ্যালারি" 
            />
          </section>
        </>
      )}

      {madrasa.contents && madrasa.contents.length > 0 && (
        <>
          <div className="w-full h-px bg-border/40" />
          <section id="notices" className="scroll-mt-32">
            <NoticeTab contents={madrasa.contents} />
          </section>
        </>
      )}

      <div className="w-full h-px bg-border/40" />
      
      <section id="contact" className="scroll-mt-32">
        <ContactTab madrasa={madrasa} />
      </section>
    </div>
  );
}
