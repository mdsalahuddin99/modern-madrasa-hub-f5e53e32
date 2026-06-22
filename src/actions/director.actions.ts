"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { MadrasaService } from "@/services/madrasa.service";

export async function getDirectorMadrasa() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const madrasas = await MadrasaService.getAll({ 
      directorId: session.user.id,
      status: undefined,
      page: 1,
      limit: 1
    });
    return madrasas.madrasas[0] || null;
  } catch (error) {
    console.error("Error fetching director madrasa:", error);
    return null;
  }
}

export async function updateMadrasaProfile(madrasaId: string, data: any) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  // সাবস্ক্রিপশন চেক (Server Action-এও নিরাপত্তা নিশ্চিত করা)
  const isSubscriptionActive = session.user.subscriptionActive;
  const subscriptionEndDate = session.user.subscriptionEndDate ? new Date(session.user.subscriptionEndDate) : null;
  const isExpired = subscriptionEndDate ? subscriptionEndDate < new Date() : true;

  if (session.user.role === "DIRECTOR" && (!isSubscriptionActive || isExpired)) {
    return { success: false, error: "আপনার সাবস্ক্রিপশন নেই বা মেয়াদ শেষ হয়ে গেছে।" };
  }

  try {
    const updated = await MadrasaService.update(madrasaId, data);

    revalidatePath("/dashboard");
    revalidatePath(`/madrasas/${madrasaId}`);
    
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error updating madrasa:", error);
    return { success: false, error: error.message || "Update failed" };
  }
}
