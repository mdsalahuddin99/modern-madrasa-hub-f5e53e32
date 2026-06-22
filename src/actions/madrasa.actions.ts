"use server";

import { revalidatePath } from "next/cache";
import { createMadrasaSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { MadrasaService } from "@/services/madrasa.service";

export async function createMadrasaAction(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    // Extract form data into a plain object
    const rawData = Object.fromEntries(formData.entries());
    
    // Parse JSON fields if they exist
    const payload = {
      ...rawData,
      students: rawData.students ? parseInt(rawData.students as string) : 0,
      teachers: rawData.teachers ? parseInt(rawData.teachers as string) : 0,
      courses: rawData.courses ? JSON.parse(rawData.courses as string) : [],
      facilities: rawData.facilities ? JSON.parse(rawData.facilities as string) : [],
      admissionRules: rawData.admissionRules ? JSON.parse(rawData.admissionRules as string) : [],
      departments: rawData.departments ? JSON.parse(rawData.departments as string) : [],
    };

    // Validate using Zod
    const validated = createMadrasaSchema.safeParse(payload);

    if (!validated.success) {
      return { 
        success: false, 
        error: "Validation failed", 
        issues: validated.error.flatten() 
      };
    }

    const newMadrasa = await MadrasaService.create(validated.data, session.user.id!);

    revalidatePath("/madrasas");
    revalidatePath("/dashboard");
    
    return { success: true, data: newMadrasa };
  } catch (error) {
    console.error("❌ Error creating madrasa:", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function deleteMadrasaAction(id: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };
    await MadrasaService.delete(id);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/madrasas");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to delete madrasa" };
  }
}

export async function editMadrasaAction(id: string, edits: any) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "DIRECTOR") return { success: false, error: "Unauthorized" };
    // NOTE: If DIRECTOR, ideally we should verify ownership first, but for admin MVP this is sufficient.
    await MadrasaService.update(id, edits);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/madrasas");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to edit madrasa" };
  }
}
