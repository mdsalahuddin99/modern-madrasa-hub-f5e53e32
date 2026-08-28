"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { MadrasaService } from "@/services/madrasa.service";
import prisma from "@/lib/prisma";

/**
 * Ownership helper: verify the authenticated user is the director of the given madrasa.
 * Returns the session or throws.
 */
async function requireOwnership(madrasaId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const madrasa = await prisma.madrasa.findUnique({
    where: { id: madrasaId },
    select: { directorId: true },
  });

  if (!madrasa) throw new Error("মাদ্রাসা পাওয়া যায়নি");

  // SUPER_ADMIN can edit any madrasa; INSTITUTION_ADMIN can only edit their own
  if (session.user.role !== "SUPER_ADMIN" && madrasa.directorId !== session.user.id) {
    throw new Error("আপনি এই মাদ্রাসার পরিচালক নন");
  }

  return session;
}

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
  try {
    const session = await requireOwnership(madrasaId);

    // Subscription & Feature guards for INSTITUTION_ADMIN
    if (session.user.role === "INSTITUTION_ADMIN") {
      const { hasInstitutionFeature } = await import("@/lib/feature-guard");
      
      const hasProfile = await hasInstitutionFeature(madrasaId, "PROFILE");
      if (!hasProfile) {
        return { success: false, error: "আপনার প্রোফাইল আপডেট করার অ্যাক্সেস নেই। অনুগ্রহ করে সাবস্ক্রিপশন রিনিউ করুন।" };
      }

      if (data.notices) {
        const hasNotice = await hasInstitutionFeature(madrasaId, "NOTICE");
        if (!hasNotice) delete data.notices;
      }

      if (data.galleryImages) {
        const hasGallery = await hasInstitutionFeature(madrasaId, "GALLERY");
        if (!hasGallery) delete data.galleryImages;
      }

      if (data.teachersList) {
        const hasStaff = await hasInstitutionFeature(madrasaId, "STAFF");
        if (!hasStaff) delete data.teachersList;
      }
      
      if (data.admissionOpen || data.admissionRules) {
        const hasAdmission = await hasInstitutionFeature(madrasaId, "ADMISSION");
        if (!hasAdmission) {
          delete data.admissionOpen;
          delete data.admissionRules;
        }
      }
    }

    const updated = await MadrasaService.update(madrasaId, data);

    revalidatePath("/dashboard");
    revalidatePath(`/madrasas/${updated.slug || madrasaId}`);
    
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error updating madrasa:", error);
    return { success: false, error: error.message || "Update failed" };
  }
}
