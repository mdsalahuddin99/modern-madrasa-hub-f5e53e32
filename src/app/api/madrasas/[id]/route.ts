// ===================================================
// GET /api/madrasas/[id] — বিস্তারিত
// PUT /api/madrasas/[id] — আপডেট (Director/Admin)
// DELETE /api/madrasas/[id] — ডিলিট (Admin only)
// ===================================================

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { json, error, validateBody, checkSubscription } from "../../_helpers";
import { updateMadrasaSchema } from "@/lib/validations";
import { MadrasaService } from "@/services/madrasa.service";

// ── GET ──
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const madrasa = await MadrasaService.getById(id);

  if (!madrasa) return error("মাদ্রাসা পাওয়া যায়নি", 404);
  return json(madrasa);
}

// ── PUT ──
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  
  // ১. সাবস্ক্রিপশন চেক
  const sub = checkSubscription(session);
  if (!sub.allowed) return error(sub.error!, 403);

  const madrasa = await MadrasaService.getById(id);
  if (!madrasa) return error("মাদ্রাসা পাওয়া যায়নি", 404);

  const isOwner = madrasa.directorId === session!.user.id;
  const isAdmin = session!.user.role === "ADMIN";
  if (!isOwner && !isAdmin) return error("অনুমোদিত নয়", 403);

  const parsed = await validateBody(req, updateMadrasaSchema);
  if (parsed.response) return parsed.response;

  try {
    const updated = await MadrasaService.update(id, parsed.data);
    return json(updated);
  } catch (err: any) {
    return error(err.message || "আপডেট করতে সমস্যা হয়েছে", 400);
  }
}

// ── DELETE ──
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return error("অনুমোদিত নয়", 403);
  }

  await prisma.madrasa.delete({ where: { id } });
  return json({ success: true });
}
