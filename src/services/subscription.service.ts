import { SubscriptionRepository } from "@/repositories/subscription.repository";
import { MadrasaRepository } from "@/repositories/madrasa.repository";
import { createSubscriptionSchema } from "@/lib/validations";
import { z } from "zod";

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;

export class SubscriptionService {
  static async getAll(userId?: string, role?: string, status?: string) {
    const where: any = {};
    if (role !== "SUPER_ADMIN" && userId) {
      where.madrasa = { directorId: userId };
    }
    if (status) {
      where.status = status.toUpperCase();
    }

    return SubscriptionRepository.findMany({
      where,
      include: {
        madrasa: { select: { id: true, name: true, director: { select: { id: true, email: true, name: true } } } },
        plan: true,
        payments: { orderBy: { createdAt: "desc" }, take: 1 }
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async create(data: CreateSubscriptionInput, userId: string) {
    // Check madrasa ownership
    const madrasa = await MadrasaRepository.findUnique({
      where: { id: data.madrasaId },
    });
    
    if (!madrasa || madrasa.directorId !== userId) {
      throw new Error("UNAUTHORIZED_OR_NOT_FOUND");
    }

    // Check plan
    const plan = await SubscriptionRepository.findPlanById(data.planId);
    if (!plan || !plan.active) {
      throw new Error("PLAN_NOT_FOUND");
    }

    return SubscriptionRepository.create({
      data: {
        madrasaId: data.madrasaId,
        planId: data.planId,
        status: "PENDING",
        payments: {
          create: {
            amount: plan.pricePerYear,
            gateway: data.paymentMethod.toUpperCase() as any,
            transactionId: data.transactionId,
            payerPhone: data.payerPhone,
            status: "PROCESSING"
          }
        }
      },
      include: { plan: true, madrasa: { select: { name: true } } },
    });
  }
}
