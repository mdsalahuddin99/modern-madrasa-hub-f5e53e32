import { CMSRepository } from "@/repositories/cms.repository";

export class CMSService {
  static async getSection(section: string) {
    if (section.length > 50) {
      throw new Error("INVALID_SECTION_NAME");
    }

    const content = await CMSRepository.findBySection(section);
    if (!content) {
      throw new Error("SECTION_NOT_FOUND");
    }

    return content.content;
  }

  static async updateSection(section: string, content: any) {
    if (section.length > 50) {
      throw new Error("INVALID_SECTION_NAME");
    }

    const updated = await CMSRepository.upsertSection(section, content);
    return updated.content;
  }
}
