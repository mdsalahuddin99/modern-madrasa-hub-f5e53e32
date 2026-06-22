// ===================================================
// POST /api/auth/reset-password — নতুন পাসওয়ার্ড সেট করা
// ===================================================

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { json, error, validateBody } from "../../_helpers";
import { sendEmail, passwordChangedEmail } from "@/lib/email";
import { z } from "zod";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "টোকেন আবশ্যক"),
  email: z.string().trim().email("সঠিক ইমেইল দিন").max(255),
  password: z
    .string()
    .min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে")
    .max(128, "পাসওয়ার্ড সর্বোচ্চ ১২৮ অক্ষরের হতে পারে"),
});

export async function POST(req: NextRequest) {
  const parsed = await validateBody(req, resetPasswordSchema);
  if (parsed.response) return parsed.response;

  const { token, email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return error("অবৈধ বা মেয়াদোত্তীর্ণ টোকেন", 400);

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      userId: user.id,
      token: hashedToken,
      expiresAt: { gt: new Date() },
      used: false,
    },
  });

  if (!resetToken) return error("অবৈধ বা মেয়াদোত্তীর্ণ টোকেন", 400);

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    }),
    prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
        id: { not: resetToken.id },
      },
    }),
  ]);

  // পাসওয়ার্ড পরিবর্তনের নোটিফিকেশন ইমেইল
  await sendEmail({
    to: email,
    subject: "পাসওয়ার্ড পরিবর্তন হয়েছে — মাদ্রাসা ডিরেক্টরি",
    html: passwordChangedEmail(),
  });

  return json({ message: "পাসওয়ার্ড সফলভাবে রিসেট করা হয়েছে" });
}
