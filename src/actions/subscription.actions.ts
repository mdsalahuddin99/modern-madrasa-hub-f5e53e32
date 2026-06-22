"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSubscriptionPlans() {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      orderBy: { durationYear: "asc" },
    });
    return { success: true, plans };
  } catch (error: any) {
    console.error("Error fetching plans:", error);
    return { success: false, error: "প্ল্যান ফেচ করতে সমস্যা হয়েছে" };
  }
}

export async function createSubscriptionPlan(data: any) {
  try {
    const plan = await prisma.subscriptionPlan.create({
      data: {
        name: data.name,
        durationYear: parseInt(data.durationYear),
        pricePerYear: parseInt(data.pricePerYear),
        totalPrice: parseInt(data.totalPrice),
        features: data.features,
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
        name: data.name,
        durationYear: parseInt(data.durationYear),
        pricePerYear: parseInt(data.pricePerYear),
        totalPrice: parseInt(data.totalPrice),
        features: data.features,
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
