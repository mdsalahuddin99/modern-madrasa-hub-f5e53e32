// ===================================================
// Next.js Middleware — Route Protection & RBAC
// ===================================================

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { API_RATE_LIMIT, checkRateLimit } from "@/lib/rate-limit";

function withSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
}

export default auth(async (req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) {
    const key = `api:${ip}:${pathname}`;
    const limit = await checkRateLimit(key, API_RATE_LIMIT);

    if (!limit.allowed) {
      const response = NextResponse.json(
        { error: "অতিরিক্ত অনুরোধ করা হয়েছে, কিছুক্ষণ পরে আবার চেষ্টা করুন।" },
        { status: 429 }
      );
      response.headers.set("Retry-After", String(limit.retryAfterSeconds));
      response.headers.set("X-RateLimit-Limit", String(API_RATE_LIMIT.maxAttempts));
      response.headers.set("X-RateLimit-Remaining", "0");
      return withSecurityHeaders(response);
    }
  }

  // পাবলিক routes — সবার জন্য
  const publicPaths = ["/", "/madrasas", "/about", "/contact", "/login", "/signup", "/install", "/subscription", "/forgot-password", "/reset-password"];
  const isPublicPage = publicPaths.includes(pathname) || pathname.startsWith("/madrasas/");
  const isPublicApi = 
    pathname.startsWith("/api/auth") || 
    pathname.startsWith("/api/public") || 
    (pathname.startsWith("/api/madrasas") && req.method === "GET") || // শুধু GET পাবলিক
    pathname.startsWith("/api/cms") || 
    pathname.startsWith("/api/subscription-plans");

  if (isPublicPage || isPublicApi) {
    return withSecurityHeaders(NextResponse.next());
  }

  // লগইন ছাড়া protected route → redirect to login
  if (!user) {
    return withSecurityHeaders(NextResponse.redirect(new URL("/login", req.url)));
  }

  // ─── Subscription Check ──────────────────────────
  // Removed from here. Handled by API and page layout.

  // প্রিমিয়াম মডিউল রুটস (এগুলো এক্সেস করতে সাবস্ক্রিপশন লাগবে)
  const premiumPaths = [
    "/dashboard/users", // Assuming some parts are premium
  ];

  const isPremiumRoute = premiumPaths.some(path => pathname.startsWith(path));

  // Admin-only routes
  if (pathname.startsWith("/dashboard/admin") && user.role !== "SUPER_ADMIN") {
    return withSecurityHeaders(NextResponse.redirect(new URL("/dashboard", req.url)));
  }

  return withSecurityHeaders(NextResponse.next());
});

export const config = {
  matcher: ["/((?!_next|static|favicon\\.ico|api/auth).*)"],
};
