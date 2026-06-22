// ===================================================
// POST /api/madrasas/[id]/gallery — গ্যালারি ইমেজ যোগ
// DELETE /api/madrasas/[id]/gallery — গ্যালারি ইমেজ মুছা
// ===================================================

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { json, error, validateBody, checkSubscription } from "../../../_helpers";
import { addGalleryImageSchema } from "@/lib/validations";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  
  // সাবস্ক্রিপশন চেক
  const sub = checkSubscription(session);
  if (!sub.allowed) return error(sub.error!, 403);

  const madrasa = await prisma.madrasa.findUnique({ where: { id } });
  if (!madrasa) return error("মাদ্রাসা পাওয়া যায়নি", 404);

  const isOwner = madrasa.directorId === session!.user.id;
  const isAdmin = session!.user.role === "ADMIN";
  if (!isOwner && !isAdmin) return error("অনুমোদিত নয়", 403);

  const parsed = await validateBody(req, addGalleryImageSchema);
  if (parsed.response) return parsed.response;

  const { url, caption, order } = parsed.data;

  const image = await prisma.galleryImage.create({
    data: { url, caption: caption || null, order, madrasaId: id },
  });

  return json(image, 201);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  
  // সাবস্ক্রিপশন চেক
  const sub = checkSubscription(session);
  if (!sub.allowed) return error(sub.error!, 403);

  const { searchParams } = req.nextUrl;
  const imageId = searchParams.get("imageId");
  if (!imageId || imageId.length > 100) return error("সঠিক imageId দিন", 400);

  const image = await prisma.galleryImage.findUnique({
    where: { id: imageId },
    include: { madrasa: true },
  });
  if (!image) return error("ইমেজ পাওয়া যায়নি", 404);

  const isOwner = image.madrasa.directorId === session!.user.id;
  const isAdmin = session!.user.role === "ADMIN";
  if (!isOwner && !isAdmin) return error("অনুমোদিত নয়", 403);

  await prisma.galleryImage.delete({ where: { id: imageId } });
  return json({ success: true });
}
