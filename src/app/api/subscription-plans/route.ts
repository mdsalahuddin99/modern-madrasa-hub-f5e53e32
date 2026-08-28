// ===================================================
// GET /api/subscription-plans — পাবলিক প্ল্যান লিস্ট
// POST /api/subscription-plans — নতুন প্ল্যান (Admin)
// ===================================================

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { json, error, validateBody, withErrorHandler } from "../_helpers";
import { subscriptionPlanSchema } from "@/lib/validations";

export async function GET() {
  return withErrorHandler(async () => {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { active: true },
      orderBy: { pricePerYear: "asc" },
    });
    return json(plans);
  });
}

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return error("অনুমোদিত নয়", 403);
    }

    const parsed = await validateBody(req, subscriptionPlanSchema);
    if (parsed.response) return parsed.response;

    const plan = await prisma.subscriptionPlan.create({
      data: {
        ...parsed.data,
        slug: parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      },
    });

    return json(plan, 201);
  });
}
