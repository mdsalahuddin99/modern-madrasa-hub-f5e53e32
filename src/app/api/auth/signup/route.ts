// ===================================================
// POST /api/auth/signup — নতুন অ্যাকাউন্ট তৈরি
// ===================================================

import { NextRequest } from "next/server";
import { json, error, validateBody } from "../../_helpers";
import { sendEmail, welcomeEmail } from "@/lib/email";
import { checkRateLimit, SIGNUP_RATE_LIMIT } from "@/lib/rate-limit";
import { signupSchema } from "@/lib/validations";
import { UserService } from "@/services/user.service";

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);

  const ipLimit = await checkRateLimit(`signup:ip:${ip}`, SIGNUP_RATE_LIMIT);
  if (!ipLimit.allowed) {
    return error(
      `অনেক বেশি রিকোয়েস্ট। ${ipLimit.retryAfterSeconds} সেকেন্ড পর আবার চেষ্টা করুন`,
      429,
      "RATE_LIMIT_EXCEEDED"
    );
  }

  const parsed = await validateBody(req, signupSchema);
  if (parsed.response) return parsed.response;

  try {
    const user = await UserService.createUser(parsed.data);

    // Welcome email (non-blocking)
    sendEmail({
      to: user.email,
      subject: "স্বাগতম — মাদ্রাসা ডিরেক্টরি",
      html: welcomeEmail(user.name || "ইউজার", "/login"),
    }).catch((err) => console.error("[SIGNUP] Welcome email failed:", err));

    return json({ user }, 201);
  } catch (err: any) {
    if (err.message === "ALREADY_EXISTS") {
      return error("এই ইমেইল দিয়ে আগে থেকে অ্যাকাউন্ট আছে", 409, "USER_ALREADY_EXISTS");
    }
    console.error("Signup error:", err);
    return error("অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে", 500);
  }
}
