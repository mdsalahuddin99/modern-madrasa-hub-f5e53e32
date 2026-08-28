import { prisma } from "./prisma";

export async function hasInstitutionFeature(
  madrasaId: string,
  featureCode: string
): Promise<boolean> {
  // 1. Get Madrasa with active subscription
  const madrasa = await prisma.madrasa.findUnique({
    where: { id: madrasaId },
    include: {
      subscriptions: {
        where: {
          status: "ACTIVE",
          // Ensure it's not expired
          OR: [
            { endDate: null },
            { endDate: { gt: new Date() } }
          ]
        },
        include: {
          plan: {
            include: {
              planFeatures: {
                include: {
                  feature: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  if (!madrasa) return false;

  // 2. Check if any active subscription has the requested feature
  const activeSubs = madrasa.subscriptions;
  if (!activeSubs || activeSubs.length === 0) return false;

  for (const sub of activeSubs) {
    if (sub.plan && sub.plan.planFeatures) {
      const hasFeature = sub.plan.planFeatures.some(
        (pf) => pf.feature.code === featureCode && pf.feature.active
      );
      if (hasFeature) return true;
    }
  }

  return false;
}

export async function hasActiveSubscription(madrasaId: string): Promise<boolean> {
  const count = await prisma.subscription.count({
    where: {
      madrasaId,
      status: "ACTIVE",
      OR: [
        { endDate: null },
        { endDate: { gt: new Date() } }
      ]
    }
  });
  return count > 0;
}
