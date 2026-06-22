import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class SubscriptionRepository {
  static async findMany(args: Prisma.SubscriptionFindManyArgs) {
    return prisma.subscription.findMany(args);
  }

  static async findUnique(args: Prisma.SubscriptionFindUniqueArgs) {
    return prisma.subscription.findUnique(args);
  }

  static async create(args: Prisma.SubscriptionCreateArgs) {
    return prisma.subscription.create(args);
  }

  static async update(args: Prisma.SubscriptionUpdateArgs) {
    return prisma.subscription.update(args);
  }

  static async findPlanById(id: string) {
    return prisma.subscriptionPlan.findUnique({ where: { id } });
  }

  static async findPlans(args: Prisma.SubscriptionPlanFindManyArgs) {
    return prisma.subscriptionPlan.findMany(args);
  }
}
