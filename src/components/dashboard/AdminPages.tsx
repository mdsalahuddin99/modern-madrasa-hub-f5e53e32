"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, BarChart3, Sparkles, ChevronRight, Activity, Clock, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import AdminStats from "./admin/AdminStats";

const AdminAnalytics = dynamic(() => import("./admin/AdminAnalytics"), {
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
});

import AdminMadrasaTab from "./admin/AdminMadrasaTab";
import AdminUsersTab from "./admin/AdminUsersTab";
import AdminApprovalTab from "./admin/AdminApprovalTab";
import AdminSubscriptionTab from "./admin/AdminSubscriptionTab";
import BoardsManager from "./admin/BoardsManager";
import { cn, toBn } from "@/lib/utils";

export const AdminOverview = ({ initialData }: { initialData?: any }) => {
  const allUsers = initialData?.allUsers || [];
  const summary = initialData?.summary;
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const roleLabel = (role: string) => {
    const r = role?.toUpperCase();
    return r === "SUPER_ADMIN" ? "এডমিন" : r === "INSTITUTION_ADMIN" ? "পরিচালক" : "দর্শক";
  };

  const roleBadgeStyle = (role: string) => {
    const r = role?.toUpperCase();
    if (r === "SUPER_ADMIN") return "bg-primary/10 text-primary border-primary/20";
    if (r === "INSTITUTION_ADMIN") return "bg-primary/10 text-primary border-primary/20";
    return "bg-secondary text-muted-foreground border-border/40";
  };

  if (showAnalytics) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-foreground flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary rounded-full" />
              উন্নত বিশ্লেষণ
            </h1>
            <p className="text-sm font-bold text-muted-foreground mt-1">প্ল্যাটফর্মের বিস্তারিত পরিসংখ্যান ও প্রবণতি</p>
          </div>
          <Button
            onClick={() => setShowAnalytics(false)}
            variant="outline"
            className="rounded-xl font-black text-xs uppercase tracking-widest border-border/60 active-scale"
          >
            ← ফিরে যান
          </Button>
        </div>
        <AdminAnalytics />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-foreground flex items-center gap-3">
            <div className="w-1.5 h-8 bg-primary rounded-full" />
            সারসংক্ষেপ
          </h1>
          <p className="text-sm font-bold text-muted-foreground mt-1 opacity-80 uppercase tracking-tighter">সিস্টেম স্ট্যাটাস ও রিপোর্ট</p>
        </div>
        <Button
          onClick={() => setShowAnalytics(true)}
          className="h-12 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-widest active-scale gap-2 shadow-lg shadow-primary/20"
        >
          <BarChart3 className="w-4 h-4" />
          উন্নত বিশ্লেষণ
        </Button>
      </div>

      {/* Stats Widgets */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <AdminStats summary={summary} />
      </motion.div>

      {/* Recent Activity Card - Desktop Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-[2.5rem] border border-border/40 shadow-soft overflow-hidden"
      >
        <div className="px-8 py-6 border-b border-border/40 flex items-center justify-between bg-secondary/20">
          <div className="flex items-center gap-3">
             <Activity className="w-5 h-5 text-primary" />
             <h2 className="text-lg font-black text-foreground">সাম্প্রতিক ব্যবহারকারী</h2>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest">
             <Clock className="w-3.5 h-3.5" /> রিয়েল-টাইম
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-2">
          {allUsers.length > 0 ? (
            allUsers.slice(0, 6).map((u: any, i: number) => (
              <div key={u.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-secondary/30 transition-all border border-transparent hover:border-border/40 group active-scale">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{u.email}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{toBn(new Date().toLocaleDateString("bn-BD"))}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={cn("text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-tighter border", roleBadgeStyle(u.role))}>
                    {roleLabel(u.role)}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
               <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
               <p className="text-sm font-bold text-muted-foreground">বর্তমানে কোনো ব্যবহারকারী নেই</p>
            </div>
          )}
        </div>

        {allUsers.length > 0 && (
          <div className="p-6 border-t border-border/40 bg-secondary/10 text-center">
             <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline active-scale">
                সকল ব্যবহারকারী দেখুন
             </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const SearchableWrapper = ({ children, title, icon: Icon }: { children: (q: string) => React.ReactNode; title: string; icon?: any }) => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
          <div className="w-1.5 h-8 bg-primary rounded-full" />
          {title}
        </h1>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="অনুসন্ধান করুন..."
            className="h-12 pl-11 rounded-2xl bg-card border-border/60 font-bold placeholder:text-muted-foreground/50 shadow-sm focus-visible:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="animate-fade-up">
        {children(searchQuery)}
      </div>
    </div>
  );
};

export const AdminApprovalPage = () => (
  <SearchableWrapper title="অনুমোদন পেন্ডিং">{(q) => <AdminApprovalTab searchQuery={q} />}</SearchableWrapper>
);

export const AdminSubscriptionPage = () => (
  <SearchableWrapper title="সাবস্ক্রিপশন লিস্ট">{(q) => <AdminSubscriptionTab searchQuery={q} />}</SearchableWrapper>
);

export const AdminMadrasaPage = () => (
  <SearchableWrapper title="মাদ্রাসা ম্যানেজমেন্ট">{(q) => <AdminMadrasaTab searchQuery={q} />}</SearchableWrapper>
);

export const AdminUsersPage = () => (
  <SearchableWrapper title="ইউজার ডাটাবেস">{(q) => <AdminUsersTab searchQuery={q} />}</SearchableWrapper>
);

export const AdminBoardsPage = () => (
  <div className="max-w-6xl mx-auto">
    <div className="mb-10">
       <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
          <div className="w-1.5 h-8 bg-primary rounded-full" />
          শিক্ষা বোর্ডসমূহ
       </h1>
       <p className="text-sm font-bold text-muted-foreground mt-2 uppercase tracking-tighter ml-4.5">স্বীকৃত বোর্ড ম্যানেজমেন্ট</p>
    </div>
    <BoardsManager />
  </div>
);
