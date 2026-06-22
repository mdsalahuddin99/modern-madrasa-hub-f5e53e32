// ===================================================
// Helper — Response utilities + validation
// ===================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { Session } from "next-auth";

/**
 * সাবস্ক্রিপশন স্ট্যাটাস চেক করা
 */
export function checkSubscription(session: Session | null) {
  if (!session?.user) return { allowed: false, error: "লগইন করুন" };
  
  // অ্যাডমিনদের জন্য সব অনুমোদিত
  if (session.user.role === "ADMIN") return { allowed: true };

  const { subscriptionActive, subscriptionEndDate } = session.user;
  const isExpired = subscriptionEndDate ? new Date(subscriptionEndDate) < new Date() : true;

  if (!subscriptionActive || isExpired) {
    return { 
      allowed: false, 
      error: "আপনার সাবস্ক্রিপশন নেই বা মেয়াদ শেষ হয়ে গেছে। দয়া করে রিনিউ করুন।" 
    };
  }

  return { allowed: true };
}

/**
 * Standard API Success Response
 */
export function json<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Standard API Error Response
 */
export function error(message: string, status = 400, code?: string) {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code: code || `ERR_${status}`,
      },
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Validation Error Response
 */
export function validationError(errors: { field: string; message: string }[]) {
  return NextResponse.json(
    {
      success: false,
      error: {
        message: errors[0]?.message || "ভ্যালিডেশন ত্রুটি",
        code: "VALIDATION_ERROR",
        details: errors,
      },
      timestamp: new Date().toISOString(),
    },
    { status: 422 }
  );
}

/**
 * Parse request body with Zod schema.
 */
export async function validateBody<T>(
  req: Request,
  schema: z.ZodSchema<T>
): Promise<{ data: T; response?: never } | { data?: never; response: NextResponse }> {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return { response: validationError(errors) };
    }
    return { data: result.data };
  } catch {
    return { response: error("অবৈধ JSON বডি", 400, "INVALID_JSON") };
  }
}

/**
 * Parse URL search params with Zod schema.
 */
export function validateParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): { data: T; response?: never } | { data?: never; response: NextResponse } {
  const obj: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    obj[key] = value;
  });
  const result = schema.safeParse(obj);
  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return { response: validationError(errors) };
  }
  return { data: result.data };
}

/**
 * Global API Error Handler wrapper
 */
export async function withErrorHandler(fn: () => Promise<NextResponse>) {
  try {
    return await fn();
  } catch (err: any) {
    console.error("[API_ERROR]:", err);

    // Prisma errors
    if (err.code === "P2002") {
      return error("এই তথ্যটি ইতিমধ্যে ডাটাবেসে আছে", 409, "DUPLICATE_ENTRY");
    }
    if (err.code === "P2025") {
      return error("তথ্যটি খুঁজে পাওয়া যায়নি", 404, "NOT_FOUND");
    }

    // Default error
    return error(
      process.env.NODE_ENV === "development" ? err.message : "সার্ভারে একটি সমস্যা হয়েছে",
      500,
      "INTERNAL_SERVER_ERROR"
    );
  }
}
