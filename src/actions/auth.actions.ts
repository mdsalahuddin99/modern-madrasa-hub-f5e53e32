"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { signupSchema, loginSchema } from "@/lib/validations";
import {
  checkRateLimit,
  resetRateLimit,
  LOGIN_RATE_LIMIT,
  SIGNUP_RATE_LIMIT,
} from "@/lib/rate-limit";
import { headers } from "next/headers";
import { UserService } from "@/services/user.service";

async function getClientIP(): Promise<string> {
  const headersList = await headers();
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * সাইন আপ অ্যাকশন
 */
export async function signupAction(formData: FormData) {
  const ip = await getClientIP();

  const limit = await checkRateLimit(`signup:ip:${ip}`, SIGNUP_RATE_LIMIT);
  if (!limit.allowed) {
    return {
      error: `অনেক বেশি রিকোয়েস্ট। ${limit.retryAfterSeconds} সেকেন্ড পর আবার চেষ্টা করুন`,
    };
  }

  const raw = Object.fromEntries(formData.entries());
  const validated = signupSchema.safeParse(raw);
  
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "ভ্যালিডেশন ত্রুটি" };
  }

  try {
    await UserService.createUser(validated.data);
    
    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      redirectTo: "/dashboard",
    });

    return { success: true };
  } catch (err: any) {
    if (err.message === "ALREADY_EXISTS") {
      return { error: "এই ইমেইল দিয়ে আগে থেকে অ্যাকাউন্ট আছে" };
    }
    if (err instanceof AuthError) {
      return { error: "অটো লগইন ব্যর্থ, ম্যানুয়ালি লগইন করুন" };
    }
    console.error("Signup Action Error:", err);
    return { error: "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে" };
  }
}

/**
 * লগইন অ্যাকশন
 */
export async function loginAction(formData: FormData) {
  const ip = await getClientIP();
  const raw = Object.fromEntries(formData.entries());
  const email = (raw.email as string)?.toLowerCase()?.trim();

  // Rate limits
  const ipLimit = await checkRateLimit(`login:ip:${ip}`, LOGIN_RATE_LIMIT);
  if (!ipLimit.allowed) {
    return { error: `অনেক বেশি চেষ্টা। ${ipLimit.retryAfterSeconds} সেকেন্ড পর আবার চেষ্টা করুন` };
  }

  if (email) {
    const emailLimit = await checkRateLimit(`login:email:${email}`, LOGIN_RATE_LIMIT);
    if (!emailLimit.allowed) {
      return { error: `এই অ্যাকাউন্টে অনেক বেশি চেষ্টা হয়েছে। ${emailLimit.retryAfterSeconds} সেকেন্ড পর আবার চেষ্টা করুন` };
    }
  }

  const validated = loginSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "ভ্যালিডেশন ত্রুটি" };
  }

  try {
    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      redirectTo: "/dashboard",
    });

    await resetRateLimit(`login:ip:${ip}`);
    if (email) await resetRateLimit(`login:email:${email}`);
    
    return { success: true };
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "ইমেইল বা পাসওয়ার্ড ভুল" };
        default:
          return { error: "লগইন করতে সমস্যা হয়েছে" };
      }
    }
    throw err; // Next.js redirect handles this
  }
}
