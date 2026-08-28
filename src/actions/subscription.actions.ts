"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSubscriptionPlans() {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      orderBy: { durationYear: "asc" },
      include: {
        planFeatures: {
          include: { feature: true }
        }
      }
    });
    return { success: true, plans };
  } catch (error: any) {
    console.error("Error fetching plans:", error);
    return { success: false, error: "প্ল্যান ফেচ করতে সমস্যা হয়েছে" };
  }
}

export async function getMadrasaSubscription(madrasaId: string) {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: { madrasaId, status: "ACTIVE" },
      include: { plan: true },
      orderBy: { createdAt: "desc" }
    });
    return { success: true, subscription };
  } catch (error: any) {
    return { success: false, error: "সাবস্ক্রিপশন ফেচ করতে সমস্যা হয়েছে" };
  }
}

export async function submitManualPayment(madrasaId: string, planId: string, transactionId: string, payerPhone: string) {
  try {
    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan) throw new Error("Plan not found");

    // Create a PENDING subscription
    const subscription = await prisma.subscription.create({
      data: {
        madrasaId,
        planId,
        status: "PENDING",
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + plan.durationYear)),
      }
    });

    // Create Payment Transaction
    await prisma.paymentTransaction.create({
      data: {
        subscriptionId: subscription.id,
        amount: plan.totalPrice,
        gateway: "MANUAL",
        transactionId,
        payerPhone,
        status: "PROCESSING"
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: "পেমেন্ট সাবমিট করতে সমস্যা হয়েছে" };
  }
}

export async function getPendingPayments() {
  try {
    const payments = await prisma.paymentTransaction.findMany({
      where: { status: "PROCESSING", gateway: "MANUAL" },
      include: {
        subscription: {
          include: { madrasa: true, plan: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return { success: true, payments };
  } catch (error: any) {
    return { success: false, error: "পেমেন্ট ফেচ করতে সমস্যা হয়েছে" };
  }
}

export async function approvePayment(transactionId: string) {
  try {
    const payment = await prisma.paymentTransaction.findUnique({
      where: { id: transactionId },
      include: { subscription: true }
    });
    if (!payment) throw new Error("Payment not found");

    await prisma.$transaction([
      prisma.paymentTransaction.update({
        where: { id: transactionId },
        data: { status: "SUCCESS" }
      }),
      prisma.subscription.update({
        where: { id: payment.subscriptionId },
        data: { status: "ACTIVE" }
      })
    ]);

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "পেমেন্ট এপ্রুভ করতে সমস্যা হয়েছে" };
  }
}

export async function createSubscriptionPlan(data: any) {
  try {
    const plan = await prisma.subscriptionPlan.create({
      data: {
        name: data.name, slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        durationYear: parseInt(data.durationYear),
        pricePerYear: parseInt(data.pricePerYear),
        totalPrice: parseInt(data.totalPrice),
        
        active: data.active ?? true,
      },
    });
    revalidatePath("/dashboard");
    return { success: true, plan };
  } catch (error: any) {
    console.error("Error creating plan:", error);
    return { success: false, error: "প্ল্যান তৈরি করতে সমস্যা হয়েছে" };
  }
}

export async function updateSubscriptionPlan(id: string, data: any) {
  try {
    const plan = await prisma.subscriptionPlan.update({
      where: { id },
      data: {
        name: data.name, slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        durationYear: parseInt(data.durationYear),
        pricePerYear: parseInt(data.pricePerYear),
        totalPrice: parseInt(data.totalPrice),
        
        active: data.active,
      },
    });
    revalidatePath("/dashboard");
    return { success: true, plan };
  } catch (error: any) {
    console.error("Error updating plan:", error);
    return { success: false, error: "প্ল্যান আপডেট করতে সমস্যা হয়েছে" };
  }
}

export async function deleteSubscriptionPlan(id: string) {
  try {
    await prisma.subscriptionPlan.delete({
      where: { id },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting plan:", error);
    return { success: false, error: "প্ল্যান ডিলিট করতে সমস্যা হয়েছে" };
  }
}
