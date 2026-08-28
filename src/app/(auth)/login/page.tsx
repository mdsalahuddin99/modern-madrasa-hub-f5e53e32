// ===================================================
// Login Page — NextAuth Credentials + Google Sign-In
// ===================================================

"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, LogIn } from "lucide-react";
import { AuthShell, AuthIcon, AuthDivider, AuthLoadingFallback } from "@/components/auth/AuthShell";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("ইমেইল বা পাসওয়ার্ড ভুল হয়েছে");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("সার্ভারে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    signIn("google", { callbackUrl });
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: demoEmail,
        password: "password123",
        redirect: false,
      });

      if (result?.error) {
        setError("ডেমো লগইন ব্যর্থ হয়েছে। ডাটাবেস চেক করুন।");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("সার্ভারে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <Card className="auth-card border-0 shadow-none">
        <CardHeader className="text-center pb-2">
          <AuthIcon>
            <LogIn className="w-8 h-8 text-primary-foreground" />
          </AuthIcon>
          <CardTitle className="text-2xl font-extrabold tracking-tight">লগইন করুন</CardTitle>
          <CardDescription className="text-muted-foreground mt-1">মাদ্রাসা ডিরেক্টরিতে স্বাগতম</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full h-12 rounded-xl gap-3 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Google দিয়ে লগইন
          </Button>

          <AuthDivider />

          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="rounded-xl">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                ইমেইল
              </label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                  পাসওয়ার্ড
                </label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                  ভুলে গেছেন?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="পাসওয়ার্ড দিন"
                className="h-12 rounded-xl"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl gradient-btn shimmer-btn text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  লগইন হচ্ছে...
                </>
              ) : (
                "লগইন করুন"
              )}
            </Button>

            <div className="mt-6 pt-6 border-t border-border/40">
              <p className="text-xs text-center font-semibold text-muted-foreground mb-4">ডেমো অ্যাকাউন্ট (টেস্টিংয়ের জন্য)</p>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm" 
                  disabled={loading || googleLoading}
                  onClick={() => handleDemoLogin("superadmin@madrasa.com")} 
                  className="text-[10px] h-9 rounded-lg border-primary/20 hover:bg-primary/5 text-primary"
                >
                  সুপার এডমিন
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm" 
                  disabled={loading || googleLoading}
                  onClick={() => handleDemoLogin("admin@madrasa.com")} 
                  className="text-[10px] h-9 rounded-lg border-primary/20 hover:bg-primary/5 text-primary"
                >
                  মাদ্রাসা এডমিন
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm" 
                  disabled={loading || googleLoading}
                  onClick={() => handleDemoLogin("user@madrasa.com")} 
                  className="text-[10px] h-9 rounded-lg border-primary/20 hover:bg-primary/5 text-primary"
                >
                  সাধারণ ইউজার
                </Button>
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="text-center justify-center pb-8">
          <p className="text-sm text-muted-foreground">
            অ্যাকাউন্ট নেই?{" "}
            <Link href="/signup" className="text-primary hover:underline font-semibold">
              রেজিস্ট্রেশন করুন
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthLoadingFallback />}>
      <LoginForm />
    </Suspense>
  );
}
