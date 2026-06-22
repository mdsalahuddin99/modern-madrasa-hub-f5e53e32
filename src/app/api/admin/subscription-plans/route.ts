import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { json, error, validateBody, withErrorHandler } from "../../_helpers";
import { subscriptionPlanSchema } from "@/lib/validations";

// ── GET: সকল প্ল্যান লিস্ট (অ্যাডমিনদের জন্য) ──
export async function GET() {
  return withErrorHandler(async () => {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return error("অনুমতি নেই", 403);

    const plans = await prisma.subscriptionPlan.findMany({
      orderBy: { pricePerYear: "asc" }
    });
    return json(plans);
  });
}

// ── POST: নতুন প্ল্যান তৈরি করা ──
export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return error("অনুমতি নেই", 403);

    const parsed = await validateBody(req, subscriptionPlanSchema);
    if (parsed.response) return parsed.response;

    const plan = await prisma.subscriptionPlan.create({
      data: parsed.data
    });

    return json(plan, 201);
  });
}
