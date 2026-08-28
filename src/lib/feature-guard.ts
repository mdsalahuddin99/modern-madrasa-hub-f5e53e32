import { PrismaClient, SubscriptionStatus } from "@prisma/client";

// Use a global prisma instance or import from your db config if you have one
// For this MVP, we will use a new instance or a shared one.
// Prefer using the shared one if it exists.
import prisma from "@/lib/prisma";

export async function hasInstitutionFeature(madrasaId: string, featureCode: string): Promise<boolean> {
  if (!madrasaId || !featureCode) return false;

  // Check if madrasa has any ACTIVE subscriptions
  const activeSubscription = await prisma.subscription.findFirst({
    where: {
      madrasaId: madrasaId,
      status: SubscriptionStatus.ACTIVE,
      OR: [
        { endDate: null },
        { endDate: { gte: new Date() } }
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
  });

  if (activeSubscription) {
    const hasFeatureInPlan = activeSubscription.plan.planFeatures.some(
      (pf) => pf.feature.code === featureCode && pf.feature.active
    );
    if (hasFeatureInPlan) return true;
  }

  // Fallback: Check if within 7-day free trial
  const madrasa = await prisma.madrasa.findUnique({
    where: { id: madrasaId },
    select: { createdAt: true }
  });

  if (madrasa) {
    const trialDaysAgo = new Date();
    trialDaysAgo.setDate(trialDaysAgo.getDate() - 7);
    
    // If madrasa is within 7 days of creation, grant all features (Trial Mode)
    if (madrasa.createdAt >= trialDaysAgo) {
      return true;
    }
  }

  return false;
}

export async function getInstitutionFeatures(madrasaId: string): Promise<string[]> {
  if (!madrasaId) return [];

  // Check active subscription
  const activeSubscription = await prisma.subscription.findFirst({
    where: {
      madrasaId: madrasaId,
      status: SubscriptionStatus.ACTIVE,
      OR: [
        { endDate: null },
        { endDate: { gte: new Date() } }
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
    }
  });

  if (activeSubscription) {
    return activeSubscription.plan.planFeatures
      .filter(pf => pf.feature.active)
      .map(pf => pf.feature.code);
  }

  // Fallback: Free trial check
  const madrasa = await prisma.madrasa.findUnique({
    where: { id: madrasaId },
    select: { createdAt: true }
  });

  if (madrasa) {
    const trialDaysAgo = new Date();
    trialDaysAgo.setDate(trialDaysAgo.getDate() - 7);
    
    if (madrasa.createdAt >= trialDaysAgo) {
      // In trial, return all active system features
      const allFeatures = await prisma.systemFeature.findMany({ where: { active: true } });
      return allFeatures.map(f => f.code);
    }
  }

  return [];
}
