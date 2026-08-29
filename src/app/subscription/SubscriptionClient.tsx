// ===================================================
// Subscription Client Component — প্ল্যান সিলেকশন
// ===================================================

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ShieldCheck, Zap, Globe, Star, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBDT } from "@/data/subscriptions";

interface Plan {
  id: string;
  name: string;
  totalPrice: number;
  durationYear: number;
  features: string[];
  active: boolean;
}

export default function SubscriptionClient() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subscription-plans")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setPlans(res.data || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background font-bengali">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-primary/5 rounded-full blur-3xl -z-10" />
        
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Premium Access</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight"
          >
            আপনার মাদ্রাসাকে করুন <br />
            <span className="text-primary">ডিজিটাল ও আধুনিক</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            একটি প্রিমিয়াম সাবস্ক্রিপশন নিয়ে আপনার মাদ্রাসার জন্য নিজস্ব সাব-ডোমেইন, ভর্তি ফরম, 
            শিক্ষার্থী ও শিক্ষক ম্যানেজমেন্ট সহ সকল আধুনিক ফিচার আনলক করুন।
          </motion.p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 md:pb-32 -mt-10">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[450px] bg-card rounded-lg border border-border/40 animate-pulse" />
              ))}
            </div>
          ) : plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {plans.map((plan, i) => {
                const isPopular = plan.durationYear === 3;
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className={`relative flex flex-col bg-card rounded-[32px] border-2 p-8 transition-all hover:shadow-2xl hover:shadow-primary/5 ${
                      isPopular ? "border-primary shadow-xl shadow-primary/10 scale-105 z-10" : "border-border/40"
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold border-none shadow-lg">
                          সেরা অফার
                        </Badge>
                      </div>
                    )}

                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tighter">
                          {formatBDT(plan.totalPrice)}
                        </span>
                        <span className="text-muted-foreground text-sm">/{plan.durationYear} বছর</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        এককালীন পরিশোধযোগ্য
                      </p>
                    </div>

                    <div className="space-y-4 mb-8 flex-1">
                      {plan.features.map((f, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-primary stroke-[3px]" />
                          </div>
                          <span className="text-sm text-foreground/80 leading-tight">{f}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className={`w-full h-12 rounded-lg font-bold transition-all ${
                        isPopular ? "shimmer-btn gradient-btn text-white" : "variant-outline"
                      }`}
                      onClick={() => window.location.href = `/dashboard?plan=${plan.id}`}
                    >
                      সিলেক্ট করুন <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-lg border border-dashed border-border/60">
              <p className="text-muted-foreground">দুঃখিত, বর্তমানে কোনো প্ল্যান খুঁজে পাওয়া যায়নি।</p>
            </div>
          )}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-extrabold text-foreground mb-4">কেন প্রিমিয়াম নেবেন?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">সবগুলো ফিচার আনলক করে আপনার মাদ্রাসাকে নিয়ে যান অনন্য উচ্চতায়</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Globe, title: "নিজস্ব সাব-ডোমেইন", desc: "আপনার মাদ্রাসার নামে আলাদা ওয়েবসাইট লিংক" },
              { icon: Zap, title: "ভর্তি ফরম ও রেজাল্ট", desc: "অনলাইনে ভর্তি ও রেজাল্ট পাবলিশ করার সুবিধা" },
              { icon: ShieldCheck, title: "সত্যায়িত ব্যাজ", desc: "প্রোফাইলে 'Verified' ব্যাজ যা বিশ্বাসযোগ্যতা বাড়ায়" },
              { icon: Star, title: "সার্চে অগ্রাধিকার", desc: "পাবলিক ডিরেক্টরিতে আপনার মাদ্রাসা সবার আগে দেখাবে" },
            ].map((f, i) => (
              <div key={i} className="p-6 bg-card rounded-lg border border-border/40 hover:border-primary/30 transition-all">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

