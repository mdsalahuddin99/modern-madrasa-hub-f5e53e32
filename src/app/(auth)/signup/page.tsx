"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, UserPlus, User, Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { AuthShell, AuthIcon, AuthDivider } from "@/components/auth/AuthShell";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }

    if (password !== confirmPassword) {
      setError("পাসওয়ার্ড মিলছে না");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "রেজিস্ট্রেশন ব্যর্থ হয়েছে");
        return;
      }

      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginResult?.error) {
        router.push("/login?registered=true");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("সার্ভারে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    setGoogleLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <AuthShell>
      <Card className="bg-card rounded-[2.5rem] border border-border/40 shadow-soft overflow-hidden">
        <CardHeader className="text-center pb-0 pt-8">
          <AuthIcon variant="success">
            <UserPlus className="w-8 h-8" />
          </AuthIcon>
          <CardTitle className="text-2xl font-black tracking-tight text-foreground">নতুন অ্যাকাউন্ট</CardTitle>
          <CardDescription className="text-muted-foreground font-medium mt-1">মাদ্রাসা পোর্টালে আপনার প্রতিষ্ঠান যুক্ত করুন</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-8 sm:px-10">
          <Button
            variant="outline"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="w-full h-12 rounded-xl gap-3 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 font-bold active-scale transition-all"
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
            Google দিয়ে রেজিস্ট্রেশন
          </Button>

          <AuthDivider />

          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="rounded-2xl bg-destructive/10 text-destructive border-none">
                <AlertDescription className="font-bold text-center">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">পূর্ণ নাম</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="আপনার নাম লিখুন"
                  className="h-12 pl-11 text-sm rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-foreground font-bold placeholder:text-muted-foreground/40 focus-visible:ring-2 focus-visible:ring-primary/20 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">ইমেইল ঠিকানা</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="h-12 pl-11 text-sm rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-foreground font-bold placeholder:text-muted-foreground/40 focus-visible:ring-2 focus-visible:ring-primary/20 shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">পাসওয়ার্ড</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="h-12 pl-11 text-sm rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-foreground font-bold placeholder:text-muted-foreground/40 focus-visible:ring-2 focus-visible:ring-primary/20 shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">নিশ্চিত করুন</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••"
                    className="h-12 pl-11 text-sm rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-foreground font-bold placeholder:text-muted-foreground/40 focus-visible:ring-2 focus-visible:ring-primary/20 shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-black text-base shadow-lg shadow-primary/20 active-scale gap-2 transition-all hover:gap-3 mt-2"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "নিবন্ধন করুন"}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="text-center justify-center pb-10">
          <p className="text-sm font-bold text-muted-foreground">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link href="/login" className="text-primary hover:underline font-black">
              লগইন করুন
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthShell>
  );
}
