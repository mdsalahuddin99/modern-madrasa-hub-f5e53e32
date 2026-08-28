// ===================================================
// GET /api/madrasas — লিস্ট (ফিল্টার ও পেজিনেশন সহ)
// POST /api/madrasas — নতুন মাদ্রাসা রেজিস্ট্রেশন
// ===================================================

import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { json, error, validateBody, validateParams, withErrorHandler } from "../_helpers";
import { madrasaFilterSchema, createMadrasaSchema } from "@/lib/validations";
import { MadrasaService } from "@/services/madrasa.service";

// ── GET: পাবলিক মাদ্রাসা লিস্ট ──
export async function GET(req: NextRequest) {
  return withErrorHandler(async () => {
    const parsed = validateParams(req.nextUrl.searchParams, madrasaFilterSchema);
    if (parsed.response) return parsed.response;

    const result = await MadrasaService.getAll(parsed.data);
    
    // Attach allowedFeatures if directorId is passed (Dashboard request)
    if (parsed.data.directorId && result.madrasas.length > 0) {
      const { getInstitutionFeatures } = await import("@/lib/feature-guard");
      const features = await getInstitutionFeatures(result.madrasas[0].id);
      (result.madrasas[0] as any).allowedFeatures = features;
    }

    return json(result);
  });
}

// ── POST: মাদ্রাসা রেজিস্ট্রেশন (Director only) ──
export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const session = await auth();
    if (!session?.user) return error("লগইন করুন", 401);

    const parsed = await validateBody(req, createMadrasaSchema);
    if (parsed.response) return parsed.response;

    const madrasa = await MadrasaService.create(parsed.data, session.user.id!);
    return json(madrasa, 201);
  });
}
