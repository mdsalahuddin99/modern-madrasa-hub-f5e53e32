// ===================================================
// POST /api/auth/change-password — লগইন অবস্থায় পাসওয়ার্ড পরিবর্তন
// ===================================================

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { json, error, validateBody } from "../../_helpers";
import { sendEmail, passwordChangedEmail } from "@/lib/email";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "বর্তমান পাসওয়ার্ড দিন"),
    newPassword: z
      .string()
      .min(6, "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে")
      .max(128, "পাসওয়ার্ড সর্বোচ্চ ১২৮ অক্ষরের হতে পারে"),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "নতুন পাসওয়ার্ড বর্তমান পাসওয়ার্ডের মত হতে পারবে না",
    path: ["newPassword"],
  });

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return error("লগইন করুন", 401);

  const parsed = await validateBody(req, changePasswordSchema);
  if (parsed.response) return parsed.response;

  const { currentPassword, newPassword } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !user.hashedPassword) {
    return error(
      "এই অ্যাকাউন্টে পাসওয়ার্ড সেট করা নেই (Google দিয়ে লগইন করেছেন)",
      400
    );
  }

  const isValid = await bcrypt.compare(currentPassword, user.hashedPassword);
  if (!isValid) return error("বর্তমান পাসওয়ার্ড ভুল", 400);

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { hashedPassword },
  });

  // সিকিউরিটি নোটিফিকেশন ইমেইল
  await sendEmail({
    to: user.email,
    subject: "পাসওয়ার্ড পরিবর্তন হয়েছে — মাদ্রাসা ডিরেক্টরি",
    html: passwordChangedEmail(),
  });

  return json({ message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে" });
}
