// ===================================================
// PATCH /api/subscriptions/[id] — অ্যাপ্রুভ/রিজেক্ট (Admin)
// ===================================================

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { json, error, validateBody } from "../../_helpers";
import { reviewSubscriptionSchema } from "@/lib/validations";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return error("অনুমোদিত নয়", 403);
  }

  const parsed = await validateBody(req, reviewSubscriptionSchema);
  if (parsed.response) return parsed.response;

  const { status, reviewNote } = parsed.data;

  // Plan duration থেকে endDate ক্যালকুলেট
  let startDate: Date | undefined;
  let endDate: Date | undefined;

  if (status === "ACTIVE") {
    const sub = await prisma.subscription.findUnique({
      where: { id },
      include: { plan: true },
    });
    if (!sub) return error("সাবস্ক্রিপশন পাওয়া যায়নি", 404);

    startDate = new Date();
    endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + sub.plan.durationYear);
  }

  const subscription = await prisma.subscription.update({
    where: { id },
    data: {
      status,
      reviewNote: reviewNote || null,
      reviewedAt: new Date(),
      ...(status === "ACTIVE" && { startDate, endDate }),
    },
    include: { plan: true },
  });

  if (status === "ACTIVE") {
    await prisma.user.update({
      where: { id: subscription.userId },
      data: { subscriptionActive: true },
    });
  }

  return json(subscription);
}
