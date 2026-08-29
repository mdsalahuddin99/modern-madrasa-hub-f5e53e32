// ===================================================
// Forgot Password Page — পাসওয়ার্ড রিসেট লিংক পাঠানো
// ===================================================

"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, KeyRound } from "lucide-react";
import { AuthShell, AuthIcon, AuthLoadingFallback } from "@/components/auth/AuthShell";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "কিছু ভুল হয়েছে");
        return;
      }

      setSent(true);
    } catch {
      setError("সার্ভারে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthShell>
        <Card className="auth-card border-0 shadow-none">
          <CardHeader className="text-center pb-2">
            <AuthIcon variant="success">
              <Mail className="w-8 h-8 text-primary" />
            </AuthIcon>
            <CardTitle className="text-xl font-extrabold tracking-tight">ইমেইল পাঠানো হয়েছে</CardTitle>
            <CardDescription className="text-muted-foreground mt-2 leading-relaxed">
              যদি <strong className="text-foreground">{email}</strong> দিয়ে অ্যাকাউন্ট থাকে, তাহলে পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে। স্প্যাম ফোল্ডারও চেক করুন।
            </CardDescription>
          </CardHeader>
          <CardFooter className="text-center justify-center pb-8">
            <Link href="/login" className="text-primary hover:underline font-semibold text-sm">
              ← লগইনে ফিরে যান
            </Link>
          </CardFooter>
        </Card>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <Card className="auth-card border-0 shadow-none">
        <CardHeader className="text-center pb-2">
          <AuthIcon>
            <KeyRound className="w-8 h-8 text-primary-foreground" />
          </AuthIcon>
          <CardTitle className="text-2xl font-extrabold tracking-tight">পাসওয়ার্ড ভুলে গেছেন?</CardTitle>
          <CardDescription className="text-muted-foreground mt-1">আপনার ইমেইল দিন, আমরা রিসেট লিংক পাঠাব</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="rounded-lg">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                ইমেইল অ্যাড্রেস
              </label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="h-12 rounded-lg"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-lg gradient-btn shimmer-btn text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  পাঠানো হচ্ছে...
                </>
              ) : (
                "রিসেট লিংক পাঠান"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center justify-center pb-8">
          <p className="text-sm text-muted-foreground">
            পাসওয়ার্ড মনে আছে?{" "}
            <Link href="/login" className="text-primary hover:underline font-semibold">
              লগইন করুন
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthShell>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<AuthLoadingFallback />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
