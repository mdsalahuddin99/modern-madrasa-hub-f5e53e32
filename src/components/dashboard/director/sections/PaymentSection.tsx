"use client";

import { CreditCard, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { plans, formatBDT } from "@/data/subscriptions";
import SubscriptionForm from "@/components/SubscriptionForm";

interface PaymentSectionProps {
  userId: string | undefined;
  madrasaName: string;
  selectedPlan: string | null;
  onSelectPlan: (id: string) => void;
  onBack: () => void;
  onResetPlan: () => void;
}

export const PaymentSection = ({
  userId,
  madrasaName,
  selectedPlan,
  onSelectPlan,
  onBack,
  onResetPlan,
}: PaymentSectionProps) => {
  return (
    <div className="container mx-auto px-4 max-w-lg">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 text-xs">
        ← ড্যাশবোর্ডে ফিরে যান
      </Button>

      {!selectedPlan ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-xl font-extrabold text-foreground">প্ল্যান নির্বাচন করুন</h2>
            <p className="text-sm text-muted-foreground mt-1">পেমেন্ট সম্পন্ন হলে আপনার মাদ্রাসা পাবলিক ডিরেক্টরিতে যুক্ত হবে</p>
          </div>

          <div className="space-y-3">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => onSelectPlan(plan.id)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                  plan.duration === 3
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                    : "border-border/60 bg-card hover:border-primary/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    {plan.duration === 3 && (
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-1 inline-block">সবচেয়ে সাশ্রয়ী</span>
                    )}
                    <div className="text-base font-extrabold text-foreground">{plan.name}</div>
                    <div className="text-xs text-muted-foreground">বছরে {formatBDT(plan.pricePerYear)}</div>
                  </div>
                  <div className="text-lg font-extrabold text-primary">{formatBDT(plan.totalPrice)}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-muted/50 border border-border/40">
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" /> যা পাচ্ছেন
            </h3>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {["পাবলিক ডিরেক্টরিতে তালিকাভুক্তি", "কাস্টম মাদ্রাসা প্রোফাইল", "সোশ্যাল মিডিয়া শেয়ার লিংক", "সত্যায়িত প্রোফাইল ব্যাজ"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Button variant="ghost" size="sm" onClick={onResetPlan} className="mb-3 text-xs">
            ← প্ল্যান পরিবর্তন
          </Button>
          <SubscriptionForm
            madrasaId={userId || ""}
            madrasaName={madrasaName}
            preselectedPlan={selectedPlan}
          />
        </motion.div>
      )}
    </div>
  );
};
