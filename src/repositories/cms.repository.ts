import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class CMSRepository {
  static async findBySection(section: string) {
    const setting = await prisma.platformSetting.findUnique({
      where: { key: section },
    });
    if (!setting) return null;
    return { section, content: setting.value };
  }

  static async upsertSection(section: string, content: any) {
    const setting = await prisma.platformSetting.upsert({
      where: { key: section },
      update: { value: content as any },
      create: { key: section, value: content as any, description: section },
    });
    return { section, content: setting.value };
  }
}
