// ===================================================
// POST /api/auth/forgot-password — পাসওয়ার্ড রিসেট টোকেন তৈরি ও ইমেইল পাঠানো
// ===================================================

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { json, error, validateBody } from "../../_helpers";
import { sendEmail } from "@/lib/email";
import { checkRateLimit, FORGOT_PASSWORD_RATE_LIMIT } from "@/lib/rate-limit";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("সঠিক ইমেইল দিন").max(255),
});

const GENERIC_RESPONSE = {
  message: "যদি এই ইমেইলে অ্যাকাউন্ট থাকে, তাহলে রিসেট লিংক পাঠানো হয়েছে",
};

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function passwordResetEmailSimple(resetUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="bn" dir="ltr">
<head><meta charset="UTF-8" /></head>
<body style="margin:0; padding:0; background-color:#f5f5f7; font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f7; padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:480px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,#047857,#059669); padding:28px 32px; text-align:center;">
          <h1 style="margin:0; color:#ffffff; font-size:20px; font-weight:700;">মাদ্রাসা ডিরেক্টরি</h1>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 8px; font-size:16px; color:#1a1a1a; font-weight:600;">আসসালামু আলাইকুম,</p>
          <p style="margin:0 0 20px; font-size:14px; color:#555; line-height:1.6;">
            আপনার মাদ্রাসা ডিরেক্টরি অ্যাকাউন্টের পাসওয়ার্ড রিসেট করার অনুরোধ পাওয়া গেছে।
            নিচের বাটনে ক্লিক করে নতুন পাসওয়ার্ড সেট করুন:
          </p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding:8px 0 24px;">
              <a href="${resetUrl}" style="display:inline-block; background:#047857; color:#ffffff; text-decoration:none; padding:14px 36px; border-radius:8px; font-size:15px; font-weight:600;">
                পাসওয়ার্ড রিসেট করুন
              </a>
            </td></tr>
          </table>
          <p style="margin:0 0 8px; font-size:13px; color:#888; line-height:1.5;">
            এই লিংকটি <strong>১ ঘণ্টা</strong> পর্যন্ত কার্যকর থাকবে।
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);

  const ipLimit = await checkRateLimit(`forgot-pwd:ip:${ip}`, FORGOT_PASSWORD_RATE_LIMIT);
  if (!ipLimit.allowed) {
    return error(
      `অনেক বেশি রিকোয়েস্ট। ${ipLimit.retryAfterSeconds} সেকেন্ড পর আবার চেষ্টা করুন`,
      429
    );
  }

  const parsed = await validateBody(req, forgotPasswordSchema);
  if (parsed.response) return parsed.response;

  const { email } = parsed.data;

  const emailLimit = await checkRateLimit(
    `forgot-pwd:email:${email.toLowerCase()}`,
    FORGOT_PASSWORD_RATE_LIMIT
  );
  if (!emailLimit.allowed) {
    return json(GENERIC_RESPONSE);
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.hashedPassword) {
    return json(GENERIC_RESPONSE);
  }

  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
    prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt: expires,
      },
    }),
  ]);

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  const emailResult = await sendEmail({
    to: email,
    subject: "পাসওয়ার্ড রিসেট — মাদ্রাসা ডিরেক্টরি",
    html: passwordResetEmailSimple(resetUrl),
  });

  if (!emailResult.success) {
    console.error(`[FORGOT-PASSWORD] Email failed for ${email}:`, emailResult.error);
  }

  return json(GENERIC_RESPONSE);
}
