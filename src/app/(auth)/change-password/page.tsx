"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ShieldCheck, ChevronLeft, Loader2, KeyRound, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthShell, AuthIcon, AuthLoadingFallback } from "@/components/auth/AuthShell";
import { cn } from "@/lib/utils";

export default function ChangePasswordPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") {
    return <AuthLoadingFallback />;
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("নতুন পাসওয়ার্ড দুটি মিলছে না");
      return;
    }

    if (currentPassword === newPassword) {
      setError("নতুন পাসওয়ার্ড বর্তমান পাসওয়ার্ডের মত হতে পারবে না");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে");
        return;
      }

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Auto redirect after success after 2 seconds
      setTimeout(() => router.push("/dashboard"), 3000);
    } catch {
      setError("সার্ভারের সাথে সংযোগ বিচ্ছিন্ন হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] active-scale ml-4 group"
        >
          <div className="w-6 h-6 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
             <ChevronLeft className="w-4 h-4" />
          </div>
          ড্যাশবোর্ডে ফিরুন
        </Link>

        <Card className="bg-card rounded-[2.5rem] border border-border/40 shadow-soft overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem]" />

          <CardHeader className="text-center pb-2 pt-10 relative z-10">
            <AuthIcon variant={success ? "success" : "default"}>
              {success ? <ShieldCheck className="w-8 h-8" /> : <KeyRound className="w-8 h-8" />}
            </AuthIcon>
            <CardTitle className="text-3xl font-black tracking-tight text-foreground">নিরাপত্তা</CardTitle>
            <CardDescription className="text-muted-foreground font-medium mt-1">আপনার অ্যাকাউন্ট সুরক্ষিত রাখুন</CardDescription>
          </CardHeader>

          <CardContent className="px-8 sm:px-10 pb-8 relative z-10">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center space-y-4"
                >
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-primary font-bold text-sm">
                    ✅ পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে। আপনাকে ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...
                  </div>
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary opacity-40" />
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 py-4">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 text-xs font-bold flex items-center gap-3"
                    >
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">বর্তমান পাসওয়ার্ড</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-14 pl-12 rounded-2xl bg-secondary/30 border-none font-bold placeholder:text-muted-foreground/30 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">নতুন পাসওয়ার্ড</label>
                    <div className="relative group">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                      <Input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="কমপক্ষে ৬ অক্ষর"
                        className="h-14 pl-12 rounded-2xl bg-secondary/30 border-none font-bold placeholder:text-muted-foreground/30 focus-visible:ring-2 focus-visible:ring-accent/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">পাসওয়ার্ড নিশ্চিত করুন</label>
                    <div className="relative group">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                      <Input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="আবার নতুন পাসওয়ার্ড দিন"
                        className="h-14 pl-12 rounded-2xl bg-secondary/30 border-none font-bold placeholder:text-muted-foreground/30 focus-visible:ring-2 focus-visible:ring-accent/20 transition-all"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-base uppercase tracking-widest shadow-lg shadow-primary/20 active-scale gap-3 transition-all hover:gap-5 mt-4"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-accent" />}
                    {loading ? "প্রসেস হচ্ছে..." : "আপডেট করুন"}
                  </Button>
                </form>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="text-center justify-center pb-10 border-t border-border/40 pt-6">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50">
               Madrasah Portal Security System
            </p>
          </CardFooter>
        </Card>
      </div>
    </AuthShell>
  );
}
