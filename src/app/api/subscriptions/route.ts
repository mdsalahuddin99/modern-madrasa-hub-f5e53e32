// ===================================================
// GET /api/subscriptions — লিস্ট
// POST /api/subscriptions — নতুন সাবস্ক্রিপশন আবেদন
// ===================================================

import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { json, error, validateBody } from "../_helpers";
import { createSubscriptionSchema } from "@/lib/validations";
import { SubscriptionService } from "@/services/subscription.service";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return error("লগইন করুন", 401);

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status") || undefined;

  try {
    const subscriptions = await SubscriptionService.getAll(
      session.user.id,
      session.user.role,
      status
    );
    return json(subscriptions);
  } catch (err) {
    console.error("Error fetching subscriptions:", err);
    return error("সাবস্ক্রিপশন লিস্ট লোড করতে সমস্যা হয়েছে", 500);
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return error("লগইন করুন", 401);

  const parsed = await validateBody(req, createSubscriptionSchema);
  if (parsed.response) return parsed.response;

  try {
    const subscription = await SubscriptionService.create(parsed.data, session.user.id!);
    return json(subscription, 201);
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED_OR_NOT_FOUND") {
      return error("মাদ্রাসা পাওয়া যায়নি বা অনুমোদিত নয়", 404);
    }
    if (err.message === "PLAN_NOT_FOUND") {
      return error("প্ল্যান পাওয়া যায়নি", 404);
    }
    console.error("Subscription error:", err);
    return error("সাবস্ক্রিপশন আবেদন করতে সমস্যা হয়েছে", 500);
  }
}
