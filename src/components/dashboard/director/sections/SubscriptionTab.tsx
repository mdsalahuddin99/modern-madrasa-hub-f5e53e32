"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Crown, Zap, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSubscriptionPlans } from "@/actions/subscription.actions";
import { toBn, formatBDT } from "@/data/subscriptions";

interface DirectorSubscriptionTabProps {
  madrasaCreatedAt?: Date | string;
  madrasaStatus?: string;
  isSubmitting?: boolean;
}

export function SubscriptionTab({ madrasaCreatedAt, madrasaStatus }: DirectorSubscriptionTabProps) {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlans() {
      const res = await getSubscriptionPlans();
      if (res.success) {
        setPlans(res.plans || []);
      }
      setLoading(false);
    }
    loadPlans();
  }, []);

  // Calculate Free Trial Logic (7 days from creation)
  const createdAt = madrasaCreatedAt ? new Date(madrasaCreatedAt) : new Date();
  const trialEndDate = new Date(createdAt);
  trialEndDate.setDate(trialEndDate.getDate() + 7);
  const now = new Date();
  const isTrialActive = now <= trialEndDate;
  const daysLeft = Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-[32px] p-6 md:p-8 border border-border/40 shadow-2xl shadow-primary/5 bg-gradient-to-br from-background to-primary/5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center shadow-inner flex-shrink-0">
            <Crown className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-foreground mb-1">আমার সাবস্ক্রিপশন</h2>
            <p className="text-sm text-muted-foreground">আপনার মাদ্রাসার বর্তমান স্ট্যাটাস এবং সাবস্ক্রিপশন প্ল্যানসমূহ</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-background border border-border/50 shadow-sm relative overflow-hidden">
            {isTrialActive && <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full -mr-2 -mt-2 blur-xl" />}
            <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-widest">ফ্রি ট্রায়াল স্ট্যাটাস</h3>
            
            {isTrialActive ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-foreground">সক্রিয় (Active)</div>
                  <div className="text-xs text-muted-foreground">আরও {toBn(daysLeft)} দিন বাকি আছে</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-foreground">মেয়াদোত্তীর্ণ</div>
                  <div className="text-xs text-muted-foreground">দয়া করে একটি প্ল্যান আপগ্রেড করুন</div>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-background border border-border/50 shadow-sm">
            <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-widest">মাদ্রাসার স্ট্যাটাস</h3>
            <div className="flex items-center gap-3">
              {madrasaStatus === "APPROVED" ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">পাবলিক</div>
                    <div className="text-xs text-muted-foreground">আপনার মাদ্রাসাটি ওয়েবসাইটে দেখা যাচ্ছে</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">অপেক্ষমাণ (Pending)</div>
                    <div className="text-xs text-muted-foreground">এডমিন এপ্রুভালের জন্য অপেক্ষমাণ</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-foreground mb-2">সাবস্ক্রিপশন প্ল্যানসমূহ</h2>
          <p className="text-sm text-muted-foreground">যেকোনো একটি প্ল্যান বেছে নিয়ে আপনার মাদ্রাসার প্রোফাইল লাইভ রাখুন</p>
        </div>

        {loading ? (
          <div className="flex justify-center p-10">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.filter(p => p.active).map((plan, i) => (
              <div 
                key={plan.id} 
                className={`glass-card rounded-[32px] p-6 border relative transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                  i === 1 ? "border-primary shadow-lg shadow-primary/20" : "border-border/40"
                }`}
              >
                {i === 1 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                    জনপ্রিয়
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-black text-primary">{formatBDT(plan.totalPrice)}</span>
                  <span className="text-sm text-muted-foreground">/ {toBn(plan.durationYear)} বছর</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {(plan.features || []).map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full h-12 rounded-xl font-bold ${i === 1 ? "shimmer-btn" : ""}`}
                  variant={i === 1 ? "default" : "outline"}
                >
                  আপগ্রেড করুন
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
