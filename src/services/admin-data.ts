import prisma from "@/lib/prisma";

export async function getAdminData() {
  const [
    allUsers,
    allMadrasas,
    pendingMadrasas,
    subscriptions,
    totalUsers,
    totalMadrasas,
    totalDirectors,
    activeSubscriptions,
    pendingSubscriptions,
    expiredSubscriptions,
    rejectedSubscriptions,
  ] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    }),
    prisma.madrasa.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        verification: true,
        division: true,
        district: true,
        thana: true,
      }
    }),
    prisma.madrasa.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include: {
        verification: true,
        division: true,
        district: true,
        thana: true,
      }
    }),
    prisma.subscription.findMany({
      include: {
        plan: true,
        madrasa: { select: { name: true, director: { select: { email: true } } } },
        payments: { orderBy: { createdAt: "desc" }, take: 1 }
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count(),
    prisma.madrasa.count(),
    prisma.user.count({ where: { role: "INSTITUTION_ADMIN" } }),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.subscription.count({ where: { status: "PENDING" } }),
    prisma.subscription.count({ where: { status: "EXPIRED" } }),
    prisma.subscription.count({ where: { status: "CANCELLED" } }),
  ]);

  return {
    allUsers,
    allMadrasas,
    pendingMadrasas,
    subscriptions,
    summary: {
      totalMadrasas,
      totalUsers,
      totalDirectors,
      pendingApprovals: pendingMadrasas.length,
      activeSubscriptions,
      pendingSubscriptions,
      expiredSubscriptions,
      rejectedSubscriptions,
    },
  };
}
