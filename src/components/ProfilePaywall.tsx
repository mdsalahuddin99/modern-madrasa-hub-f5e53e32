"use client";

import { Lock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const ProfilePaywall = () => {
  const router = useRouter();

  return (
    <>
      {/* Sticky top banner */}
      <div className="sticky top-20 z-30 mb-4">
        <div className="bg-accent/10 border-2 border-accent/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3 shadow-lg shadow-accent/5 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-sm font-bold text-foreground">
              সাবস্ক্রিপশন প্রয়োজন
            </h3>
            <p className="text-xs text-muted-foreground">
              এই মাদ্রাসার সম্পূর্ণ তথ্য দেখতে সাবস্ক্রিপশন সক্রিয় করুন
            </p>
          </div>
          <Button
            onClick={() => router.push("/subscription")}
            size="sm"
            className="gap-1.5 rounded-xl h-9 text-xs shimmer-btn gradient-btn text-primary-foreground shadow-md shadow-primary/20"
          >
            <CreditCard className="w-3.5 h-3.5" /> সাবস্ক্রিপশন করুন
          </Button>
        </div>
      </div>

      {/* Lock icon overlays on each section */}
      <style>{`
        .locked-section .float-card,
        .locked-section > [class*="motion"] {
          position: relative;
        }
        .locked-section .float-card::after,
        .locked-section > [class*="motion"]::after {
          content: '';
          position: absolute;
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          background: hsl(var(--accent) / 0.12);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
        }
      `}</style>
    </>
  );
};

/** Small lock badge to put on individual cards/sections */
export const LockBadge = () => (
  <div className="absolute top-2 right-2 z-10 w-7 h-7 rounded-lg bg-accent/12 flex items-center justify-center">
    <Lock className="w-3.5 h-3.5 text-accent" />
  </div>
);

export default ProfilePaywall;
