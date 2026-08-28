"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";

export async function updateMadrasaStatusAction(id: string, status: "APPROVED" | "REJECTED" | "SUSPENDED" | "PENDING") {
  try {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

    await prisma.madrasa.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/madrasas");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || "Failed to update madrasa status" };
  }
}

export async function updateVerificationStatusAction(
  madrasaId: string, 
  status: "VERIFIED" | "REJECTED" | "PENDING", 
  notes?: string
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

    await prisma.institutionVerification.upsert({
      where: { madrasaId },
      update: {
        status,
        notes,
        verifiedBy: session.user.id,
        verifiedAt: new Date(),
      },
      create: {
        madrasaId,
        status,
        notes,
        verifiedBy: session.user.id,
        verifiedAt: new Date(),
      }
    });
    
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/madrasas");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || "Failed to update verification status" };
  }
}

export async function toggleFeaturedAction(id: string, featured: boolean) {
  try {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

    await prisma.madrasa.update({
      where: { id },
      data: { featured },
    });
    revalidatePath("/dashboard/madrasas");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || "Failed to toggle featured status" };
  }
}

export async function approveSubscriptionAction(id: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: { plan: true }
    });

    if (!subscription) return { success: false, error: "Subscription not found" };

    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + subscription.plan.durationYear);

    await prisma.$transaction([
      prisma.subscription.update({
        where: { id },
        data: {
          status: "ACTIVE",
          startDate,
          endDate,
        },
      }),
      prisma.paymentTransaction.updateMany({
        where: { subscriptionId: id, status: "PROCESSING" },
        data: { status: "SUCCESS" }
      })
    ]);
    
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
        status: "CANCELLED",
        reviewNote: note,
        // reviewedAt: new Date(),
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

export async function changeUserRoleAction(email: string, newRole: "SUPER_ADMIN" | "INSTITUTION_ADMIN") {
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
