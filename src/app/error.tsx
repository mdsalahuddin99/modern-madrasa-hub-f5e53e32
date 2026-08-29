"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service (like Sentry)
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-lg">
        <div className="relative overflow-hidden rounded-lg border border-border/50 bg-card shadow-2xl p-8 md:p-12 text-center">
          {/* Background decoration */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-destructive/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

          <div className="relative">
            <div className="w-20 h-20 rounded-lg bg-destructive/10 text-destructive mx-auto mb-6 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-10 h-10" />
            </div>
            
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-4 tracking-tight">
              দুঃখিত, একটি সমস্যা হয়েছে!
            </h1>
            
            <p className="text-muted-foreground mb-8 text-base md:text-lg leading-relaxed max-w-sm mx-auto">
              সিস্টেমে সাময়িক ত্রুটি দেখা দিয়েছে। আমরা ইতিমধ্যে এটি সমাধানের কাজ শুরু করেছি।
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={reset} 
                size="lg"
                className="w-full sm:w-auto rounded-lg gap-2 font-bold px-8"
              >
                <RotateCcw className="w-5 h-5" /> আবার চেষ্টা করুন
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto rounded-lg gap-2 font-bold px-8"
              >
                <Link href="/">
                  <Home className="w-5 h-5" /> হোমপেজ
                </Link>
              </Button>
            </div>

            <div className="mt-12 pt-8 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-4">
                সমস্যাটি স্থায়ী হলে আমাদের সাথে যোগাযোগ করুন
              </p>
              <Button variant="link" asChild className="text-primary gap-2 h-auto p-0">
                <Link href="/contact">
                  <MessageSquare className="w-4 h-4" /> সাপোর্ট টিম
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
