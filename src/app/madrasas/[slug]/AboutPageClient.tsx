"use client";

import AboutTab from "@/components/profile/tabs/AboutTab";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function AboutPageClient({ madrasa }: { madrasa: any }) {
  const { content } = useSiteContent();
  return <AboutTab madrasa={madrasa} pc={content.profile} />;
}
