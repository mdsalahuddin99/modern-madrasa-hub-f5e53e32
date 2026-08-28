// ===================================================
// PATCH /api/madrasas/[id]/status — এপ্রুভ/রিজেক্ট (Admin)
// ===================================================

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { json, error, validateBody } from "../../../_helpers";
import { updateStatusSchema } from "@/lib/validations";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return error("অনুমোদিত নয়", 403);
  }

  const parsed = await validateBody(req, updateStatusSchema);
  if (parsed.response) return parsed.response;

  const { status, featured } = parsed.data;

  const madrasa = await prisma.madrasa.update({
    where: { id },
    data: {
      status,
      ...(featured !== undefined && { featured }),
    },
  });

  return json(madrasa);
}
