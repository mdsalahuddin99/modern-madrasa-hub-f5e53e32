"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CheckCircle2,
  Building2,
  Users,
  CreditCard,
  Settings,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, toBn } from "@/lib/utils";

interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function DashboardClient({ user }: { user: DashboardUser }) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const isAdmin = user.role === "SUPER_ADMIN";
  const isDirector = user.role === "INSTITUTION_ADMIN";

  const adminStats = [
    { label: "মোট মাদ্রাসা", value: "৫২৪", icon: Building2, color: "text-primary", bg: "bg-primary/5" },
    { label: "অনুমোদন বাকি", value: "১২", icon: Clock, color: "text-accent", bg: "bg-accent/5" },
    { label: "মোট ইউজার", value: "৮৫০", icon: Users, color: "text-primary", bg: "bg-primary/5" },
    { label: "সক্রিয় সাবস্ক্রিপশন", value: "৪৫", icon: CreditCard, color: "text-accent", bg: "bg-accent/5" },
  ];

  return (
    <div className="min-h-screen bg-secondary/10 pb-20 lg:pb-0">
      <div className="container mx-auto px-5 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">

          {/* Desktop Sidebar - Premium App Style */}
          <aside className="hidden lg:flex flex-col gap-6 sticky top-24">
            <div className="bg-card p-6 rounded-[2.5rem] border border-border/40 shadow-soft overflow-hidden relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-[3rem]" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/20">
                  <span className="text-2xl font-black">{user.name?.charAt(0) || "U"}</span>
                </div>
                <h2 className="text-lg font-black text-foreground truncate">{user.name || user.email.split('@')[0]}</h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-accent">
                    {isAdmin ? "চিফ অ্যাডমিন" : "মাদ্রাসা পরিচালক"}
                  </span>
                </div>
              </div>
            </div>

            <nav className="bg-card p-4 rounded-[2.5rem] border border-border/40 shadow-soft space-y-1">
              <Link href="/dashboard" className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 text-primary font-black text-sm active-scale group">
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-5 h-5" />
                  ওভারভিউ
                </div>
                <ChevronRight className="w-4 h-4" />
              </Link>

              {isAdmin && (
                <>
                  <Link href="/dashboard/approval" className="flex items-center justify-between p-4 rounded-2xl text-muted-foreground hover:bg-secondary/50 font-bold text-sm active-scale transition-all">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5" />
                      অনুমোদন
                    </div>
                  </Link>
                  <Link href="/dashboard/madrasas" className="flex items-center justify-between p-4 rounded-2xl text-muted-foreground hover:bg-secondary/50 font-bold text-sm active-scale transition-all">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5" />
                      মাদ্রাসা ম্যানেজমেন্ট
                    </div>
                  </Link>
                </>
              )}

              {isDirector && (
                <Link href="/dashboard/my-madrasa" className="flex items-center justify-between p-4 rounded-2xl text-muted-foreground hover:bg-secondary/50 font-bold text-sm active-scale transition-all">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5" />
                    আমার মাদ্রাসা
                  </div>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-4 rounded-2xl text-destructive hover:bg-destructive/5 font-bold text-sm active-scale transition-all mt-4 border-t border-border/40 pt-6"
              >
                <LogOut className="w-5 h-5" />
                লগআউট করুন
              </button>
            </nav>
          </aside>

          {/* Main Dashboard Content */}
          <main className="space-y-8">
            {/* Welcome Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary p-8 sm:p-10 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-primary/20"
            >
              <div className="absolute inset-0 islamic-pattern opacity-10" />
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />

              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-accent border border-white/10 mb-4 text-[10px] font-black uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    আজকের আপডেট
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight">
                    আসসালামু আলাইকুম, <br />
                    <span className="text-accent">{user.name || "ব্যবহারকারী"}!</span>
                  </h1>
                  <p className="text-white/70 mt-3 font-medium">আপনার ড্যাশবোর্ডে আজকের সংক্ষিপ্ত রিপোর্ট দেখুন।</p>
                </div>

                <div className="w-24 h-24 rounded-[2rem] bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md shadow-xl">
                   <div className="text-center">
                      <p className="text-2xl font-black tabular-nums">{toBn(new Date().getDate())}</p>
                      <p className="text-[10px] font-black uppercase opacity-60">মার্চ</p>
                   </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid - App Style Widgets */}
            {isAdmin ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {adminStats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card p-5 sm:p-6 rounded-[2rem] border border-border/40 shadow-soft active-scale group hover:border-primary/20 transition-all"
                  >
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", stat.bg)}>
                      <stat.icon className={cn("w-6 h-6", stat.color)} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl sm:text-3xl font-black text-foreground tabular-nums tracking-tighter">
                        {toBn(stat.value)}
                      </span>
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">
                        {stat.label}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card p-8 rounded-[2.5rem] border border-border/40 shadow-soft active-scale relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-[4rem]" />
                  <Building2 className="w-10 h-10 text-accent mb-6" />
                  <h2 className="text-xl font-black text-foreground mb-3">আপনার মাদ্রাসা</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    আপনার মাদ্রাসার তথ্য, গ্যালারি ও ভর্তি নির্দেশিকা আপডেট করুন।
                  </p>
                  <Button className="mt-8 rounded-xl h-11 px-6 font-bold bg-primary text-white active-scale group-hover:gap-3 transition-all">
                    ম্যানেজ করুন <ChevronRight className="w-4 h-4" />
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card p-8 rounded-[2.5rem] border border-border/40 shadow-soft active-scale relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem]" />
                  <Settings className="w-10 h-10 text-primary mb-6" />
                  <h2 className="text-xl font-black text-foreground mb-3">অ্যাকাউন্ট সেটিংস</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    প্রোফাইল পাসওয়ার্ড পরিবর্তন এবং সিকিউরিটি সেটিংস কনফিগার করুন।
                  </p>
                  <Button variant="outline" className="mt-8 rounded-xl h-11 px-6 font-bold border-border/40 active-scale">
                    সেটিংস ওপেন করুন
                  </Button>
                </motion.div>
              </div>
            )}

            {/* Recent Notifications / Tasks Section */}
            <div className="bg-card rounded-[2.5rem] border border-border/40 shadow-soft overflow-hidden">
               <div className="px-8 py-6 border-b border-border/40 flex items-center justify-between">
                  <h3 className="text-lg font-black text-foreground">রিসেন্ট অ্যাক্টিভিটি</h3>
                  <button className="text-xs font-black text-primary uppercase tracking-wider">সব দেখুন</button>
               </div>
               <div className="p-4 space-y-2">
                  {[
                    { title: "নতুন মাদ্রাসা নিবন্ধিত হয়েছে", time: "১০ মিনিট আগে", type: "success" },
                    { title: "সাবস্ক্রিপশন পেমেন্ট সফল হয়েছে", time: "২ ঘণ্টা আগে", type: "info" },
                    { title: "প্রোফাইল ফটো আপডেট করা হয়েছে", time: "৫ ঘণ্টা আগে", type: "info" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-secondary/30 transition-colors cursor-pointer group active-scale">
                       <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center shrink-0">
                          <LayoutDashboard className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">{item.title}</p>
                          <p className="text-[10px] font-medium text-muted-foreground uppercase">{toBn(item.time)}</p>
                       </div>
                       <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
                    </div>
                  ))}
               </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
