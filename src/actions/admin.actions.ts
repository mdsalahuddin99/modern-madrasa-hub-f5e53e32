"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveMadrasaAction(id: string) {
  try {
    await prisma.madrasa.update({
      where: { id },
      data: { status: "APPROVED" },
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/madrasas");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to approve madrasa" };
  }
}

export async function rejectMadrasaAction(id: string) {
  try {
    await prisma.madrasa.update({
      where: { id },
      data: { status: "REJECTED" },
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/madrasas");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to reject madrasa" };
  }
}

export async function approveSubscriptionAction(id: string) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: { plan: true }
    });

    if (!subscription) return { success: false, error: "Subscription not found" };

    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + subscription.plan.durationYear);

    await prisma.subscription.update({
      where: { id },
      data: {
        status: "ACTIVE",
        startDate,
        endDate,
        reviewedAt: new Date(),
      },
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/subscriptions");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to approve subscription" };
  }
}

export async function rejectSubscriptionAction(id: string, note?: string) {
  try {
    await prisma.subscription.update({
      where: { id },
      data: {
        status: "REJECTED",
        reviewNote: note,
        reviewedAt: new Date(),
      },
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/subscriptions");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to reject subscription" };
  }
}

export async function deleteUserAction(email: string) {
  try {
    await prisma.user.delete({
      where: { email },
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to delete user" };
  }
}

export async function changeUserRoleAction(email: string, newRole: "ADMIN" | "DIRECTOR") {
  try {
    await prisma.user.update({
      where: { email },
      data: { role: newRole },
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to change user role" };
  }
}
