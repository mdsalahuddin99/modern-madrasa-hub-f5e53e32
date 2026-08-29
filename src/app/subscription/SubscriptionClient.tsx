"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ShieldCheck, Zap, Globe, Star, ArrowRight, Sparkles, Crown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBDT } from "@/data/subscriptions";
import { cn, toBn } from "@/lib/utils";

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
    <div className="min-h-screen bg-secondary/10 flex flex-col selection:bg-primary/10">
      <Navbar />

      <main className="flex-1 pb-24">
        {/* App-Style Immersive Header */}
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-primary text-white text-center">
          <div className="absolute inset-0 islamic-pattern opacity-10" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
          
          <div className="container mx-auto px-5 sm:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-8 active-scale"
            >
              <Crown className="w-4 h-4 text-accent fill-accent" />
              <span className="text-[11px] font-black uppercase tracking-widest">Premium Membership</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-6xl font-black leading-tight tracking-tight mb-6"
            >
              আপনার মাদ্রাসাকে করুন <br />
              <span className="text-accent">ডিজিটাল ও আধুনিক</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-base md:text-xl max-w-2xl mx-auto font-medium leading-relaxed"
            >
              একটি প্রিমিয়াম প্ল্যান নিয়ে আপনার মাদ্রাসার জন্য নিজস্ব সাব-ডোমেইন, অনলাইন ভর্তি ফরম এবং শিক্ষক-শিক্ষার্থী ম্যানেজমেন্ট ফিচার আনলক করুন।
            </motion.p>
          </div>
        </section>

        {/* Pricing Grid */}
        <section className="container mx-auto px-5 sm:px-8 -mt-12 lg:-mt-20 relative z-20">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[500px] bg-card rounded-[2.5rem] border border-border/40 animate-pulse shadow-soft" />
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
                    className={cn(
                      "relative flex flex-col bg-card rounded-[3rem] p-8 lg:p-10 border-2 transition-all hover:shadow-2xl active-scale",
                      isPopular
                        ? "border-accent shadow-xl shadow-accent/5 lg:scale-105 z-10"
                        : "border-border/40 shadow-soft"
                    )}
                  >
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge className="bg-accent text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-none shadow-lg">
                          সেরা অফার
                        </Badge>
                      </div>
                    )}

                    <div className="mb-8">
                      <h3 className={cn(
                        "text-lg font-black uppercase tracking-widest mb-4",
                        isPopular ? "text-accent" : "text-primary"
                      )}>{plan.name}</h3>

                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl lg:text-5xl font-black text-foreground tracking-tighter tabular-nums">
                          {toBn(plan.totalPrice)}
                        </span>
                        <span className="text-muted-foreground font-black text-xs uppercase ml-1">টাকা / {toBn(plan.durationYear)} বছর</span>
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground mt-3 uppercase tracking-tighter">
                        এককালীন পরিশোধযোগ্য
                      </p>
                    </div>

                    <div className="space-y-5 mb-10 flex-1">
                      {plan.features.map((f, idx) => (
                        <div key={idx} className="flex items-start gap-4">
                          <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                            isPopular ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                          )}>
                            <Check className="w-3 h-3 stroke-[4px]" />
                          </div>
                          <span className="text-sm font-bold text-foreground/80 leading-tight">{f}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => window.location.href = `/dashboard?plan=${plan.id}`}
                      className={cn(
                        "w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active-scale",
                        isPopular
                          ? "bg-accent text-white shadow-accent/20"
                          : "bg-primary text-white shadow-primary/20"
                      )}
                    >
                      সিলেক্ট করুন <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 bg-card rounded-[3rem] border-2 border-dashed border-border/40">
              <p className="text-muted-foreground font-bold">দুঃখিত, বর্তমানে কোনো প্ল্যান খুঁজে পাওয়া যায়নি।</p>
            </div>
          )}
        </section>

        {/* Feature Highlights - Premium Native Style */}
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-5 sm:px-8 max-w-6xl">
            <div className="text-center mb-16 lg:mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary mb-4 active-scale">
                 <Sparkles className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest">কেন প্রিমিয়াম নেবেন?</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-foreground mb-6">আপনার মাদ্রাসার ডিজিটাল সমৃদ্ধি</h2>
              <p className="text-muted-foreground text-base lg:text-lg max-w-xl mx-auto font-medium">সবগুলো ফিচার আনলক করে আপনার প্রতিষ্ঠানকে নিয়ে যান এক নতুন উচ্চতায়</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Globe, title: "নিজস্ব সাব-ডোমেইন", desc: "আপনার মাদ্রাসার নামে আলাদা ওয়েবসাইট লিংক", color: "text-primary", bg: "bg-primary/5" },
                { icon: Zap, title: "ভর্তি ও রেজাল্ট", desc: "অনলাইনে ভর্তি এবং ডিজিটাল রেজাল্ট পাবলিশ করার সুবিধা", color: "text-accent", bg: "bg-accent/5" },
                { icon: ShieldCheck, title: "সত্যায়িত ব্যাজ", desc: "প্রোফাইলে বিশেষ ব্যাজ যা সবার বিশ্বাসযোগ্যতা বাড়ায়", color: "text-primary", bg: "bg-primary/5" },
                { icon: Star, title: "সার্চে অগ্রাধিকার", desc: "পাবলিক ডিরেক্টরিতে আপনার মাদ্রাসা সবার আগে দেখাবে", color: "text-accent", bg: "bg-accent/5" },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 bg-card rounded-[2.5rem] border border-border/40 shadow-soft hover:border-primary/20 transition-all group active-scale"
                >
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", f.bg)}>
                    <f.icon className={cn("w-7 h-7", f.color)} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg font-black text-foreground mb-3">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="container mx-auto px-5 sm:px-8">
           <div className="bg-card p-10 rounded-[3rem] border border-border/40 shadow-soft text-center max-w-3xl mx-auto group active-scale">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                 <Star className="w-6 h-6 text-accent fill-accent" />
              </div>
              <h3 className="text-xl font-black text-foreground mb-4">পেমেন্টে কোনো সমস্যা হচ্ছে?</h3>
              <p className="text-muted-foreground text-sm font-medium mb-8">আমাদের সাপোর্ট টিম সপ্তাহের ৭ দিন ২৪ ঘণ্টা আপনাকে সহায়তা করতে প্রস্তুত।</p>
              <Button variant="outline" className="rounded-xl h-11 px-8 font-bold border-border/60 active-scale">
                 সাপোর্টে কথা বলুন
              </Button>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
