"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, KeyRound, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";
import { AuthShell, AuthIcon, AuthDivider, AuthLoadingFallback } from "@/components/auth/AuthShell";

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
        <Card className="bg-card rounded-[2.5rem] border border-border/40 shadow-soft overflow-hidden p-4">
          <CardHeader className="text-center pb-2 pt-10">
            <AuthIcon variant="success">
              <CheckCircle2 className="w-8 h-8" />
            </AuthIcon>
            <CardTitle className="text-2xl font-black tracking-tight text-foreground">ইমেইল পাঠানো হয়েছে</CardTitle>
            <CardDescription className="text-muted-foreground font-medium mt-3 px-4 leading-relaxed">
              যদি <strong className="text-primary">{email}</strong> দিয়ে কোনো অ্যাকাউন্ট থাকে, তবে আমরা সেখানে পাসওয়ার্ড রিসেট করার লিংক পাঠিয়েছি।
            </CardDescription>
          </CardHeader>
          <CardFooter className="text-center justify-center pb-10 pt-6">
            <Link href="/login" className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:underline active-scale">
              <ArrowLeft className="w-4 h-4" /> লগইনে ফিরে যান
            </Link>
          </CardFooter>
        </Card>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <Card className="bg-card rounded-[2.5rem] border border-border/40 shadow-soft overflow-hidden">
        <CardHeader className="text-center pb-2 pt-10">
          <AuthIcon>
            <KeyRound className="w-8 h-8" />
          </AuthIcon>
          <CardTitle className="text-2xl font-black tracking-tight text-foreground">পাসওয়ার্ড ভুলে গেছেন?</CardTitle>
          <CardDescription className="text-muted-foreground font-medium mt-1">আপনার ইমেইল দিন, আমরা রিসেট লিংক পাঠাব</CardDescription>
        </CardHeader>

        <CardContent className="px-8 sm:px-10 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="rounded-2xl bg-destructive/10 text-destructive border-none">
                <AlertDescription className="font-bold text-center">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">
                আপনার ইমেইল
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="h-14 pl-12 rounded-2xl bg-secondary/30 border-none font-bold placeholder:text-muted-foreground/40 focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-lg shadow-primary/20 active-scale gap-3 transition-all hover:gap-5"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "লিংক পাঠান"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center justify-center pb-10 border-t border-border/40 pt-6">
          <p className="text-sm font-bold text-muted-foreground">
            পাসওয়ার্ড মনে পড়েছে?{" "}
            <Link href="/login" className="text-primary hover:underline font-black">
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
