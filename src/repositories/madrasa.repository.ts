import { prisma } from "@/lib/prisma";
import { Prisma, MadrasaStatus } from "@prisma/client";

export class MadrasaRepository {
  static async findMany(args: Prisma.MadrasaFindManyArgs) {
    return prisma.madrasa.findMany(args);
  }

  static async findUnique(args: Prisma.MadrasaFindUniqueArgs) {
    return prisma.madrasa.findUnique(args);
  }

  static async count(args: Prisma.MadrasaCountArgs) {
    return prisma.madrasa.count(args);
  }

  static async create(args: Prisma.MadrasaCreateArgs) {
    return prisma.madrasa.create(args);
  }

  static async update(args: Prisma.MadrasaUpdateArgs) {
    return prisma.madrasa.update(args);
  }

  static async delete(args: Prisma.MadrasaDeleteArgs) {
    return prisma.madrasa.delete(args);
  }

  // Specific queries if needed
  static async findByStatus(status: MadrasaStatus, limit = 10) {
    return prisma.madrasa.findMany({
      where: { status },
      take: limit,
      orderBy: { createdAt: "desc" }
    });
  }
}
