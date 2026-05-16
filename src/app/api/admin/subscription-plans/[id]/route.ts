import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { json, error, validateBody, withErrorHandler } from "../../../_helpers";
import { subscriptionPlanSchema } from "@/lib/validations";

// ── PATCH: প্ল্যান আপডেট করা ──
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandler(async () => {
    const { id } = await params;
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return error("অনুমতি নেই", 403);

    const parsed = await validateBody(req, subscriptionPlanSchema.partial());
    if (parsed.response) return parsed.response;

    const plan = await prisma.subscriptionPlan.update({
      where: { id },
      data: parsed.data
    });

    return json(plan);
  });
}

// ── DELETE: প্ল্যান ডিলিট করা ──
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandler(async () => {
    const { id } = await params;
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return error("অনুমতি নেই", 403);

    // চেক করা হচ্ছে কোনো সাবস্ক্রিপশন এই প্ল্যান ব্যবহার করছে কি না
    const count = await prisma.subscription.count({
      where: { planId: id }
    });

    if (count > 0) {
      return error("এই প্ল্যানটি ব্যবহারকারী আছে, তাই ডিলিট করা সম্ভব নয়। আপনি এটি ইন-অ্যাক্টিভ করতে পারেন।", 400);
    }

    await prisma.subscriptionPlan.delete({
      where: { id }
    });

    return json({ message: "প্ল্যানটি ডিলিট করা হয়েছে" });
  });
}
