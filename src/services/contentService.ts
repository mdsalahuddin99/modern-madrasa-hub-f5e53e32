// Content management service — abstracts CMS operations
// Currently localStorage-based, ready for database migration

import { getSiteContent, saveSiteContent, SiteContent, defaultSiteContent } from "@/data/siteContent";

export const contentService = {
  async getContent(): Promise<SiteContent> {
    return getSiteContent();
  },

  async saveContent(content: SiteContent): Promise<void> {
    saveSiteContent(content);
  },

  async resetContent(): Promise<void> {
    saveSiteContent(defaultSiteContent);
  },

  async updateSection<K extends keyof SiteContent>(
    section: K,
    data: SiteContent[K]
  ): Promise<void> {
    const current = getSiteContent();
    const updated = { ...current, [section]: data };
    saveSiteContent(updated);
  },
};
