import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class CMSRepository {
  static async findBySection(section: string) {
    return prisma.siteContent.findUnique({
      where: { section },
    });
  }

  static async upsertSection(section: string, content: any) {
    return prisma.siteContent.upsert({
      where: { section },
      update: { content },
      create: { section, content },
    });
  }
}
