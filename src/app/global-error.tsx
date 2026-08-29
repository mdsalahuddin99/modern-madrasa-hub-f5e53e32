"use client";

import Link from "next/link";
import { AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  console.error("Global error boundary:", error);

  return (
    <html lang="bn">
      <body className="min-h-screen bg-background font-bengali antialiased">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg border border-border/50 bg-card p-6 text-center">
            <div className="w-12 h-12 rounded-lg bg-destructive/10 text-destructive mx-auto mb-4 flex items-center justify-center">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-2">সার্ভিস সাময়িকভাবে ব্যস্ত</h2>
            <p className="text-sm text-muted-foreground mb-5">
              কিছু সময় পরে আবার চেষ্টা করুন।
            </p>
            <Button asChild className="rounded-lg">
              <Link href="/">হোমপেজে ফিরে যান</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
