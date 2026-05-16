"use client";

import { useState, useEffect, useCallback } from "react";
import { getSiteContent, saveSiteContent, SiteContent, defaultSiteContent } from "@/data/siteContent";

export const useSiteContent = () => {
  // Initialize with default to avoid hydration mismatch
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    // Load actual content after hydration
    setContent(getSiteContent());

    const handler = () => setContent(getSiteContent());
    window.addEventListener("site-content-updated", handler);
    return () => window.removeEventListener("site-content-updated", handler);
  }, []);

  const updateContent = useCallback((updated: SiteContent) => {
    saveSiteContent(updated);
    setContent(updated);
  }, []);

  return { content, updateContent };
};
