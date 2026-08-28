import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class AdminRepository {
  /**
   * ড্যাশবোর্ড স্ট্যাটস পাওয়ার জন্য
   */
  static async getDashboardStats() {
    const [
      totalMadrasas,
      pendingMadrasas,
      approvedMadrasas,
      totalUsers,
      totalSubscriptions,
      activeSubscriptions,
      pendingSubscriptions,
    ] = await Promise.all([
      prisma.madrasa.count(),
      prisma.madrasa.count({ where: { status: "PENDING" } }),
      prisma.madrasa.count({ where: { status: "APPROVED" } }),
      prisma.user.count(),
      prisma.subscription.count(),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.subscription.count({ where: { status: "PENDING" } }),
    ]);

    return {
      totalMadrasas,
      pendingMadrasas,
      approvedMadrasas,
      rejectedMadrasas: totalMadrasas - pendingMadrasas - approvedMadrasas,
      totalUsers,
      totalSubscriptions,
      activeSubscriptions,
      pendingSubscriptions,
    };
  }

  /**
   * মাদ্রাসা লিস্ট (Admin view)
   */
  static async findAllMadrasas() {
    return prisma.madrasa.findMany({
      include: {
        facilities: true,
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });
  }

  /**
   * ইউজার লিস্ট (Admin view)
   */
  static async findAllUsers(where: Prisma.UserWhereInput = {}) {
    return prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: { select: { madrasas: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
