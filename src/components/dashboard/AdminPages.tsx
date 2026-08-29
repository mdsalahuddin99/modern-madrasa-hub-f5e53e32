"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AdminStats from "./admin/AdminStats";
import AdminAnalytics from "./admin/AdminAnalytics";
import AdminMadrasaTab from "./admin/AdminMadrasaTab";
import AdminUsersTab from "./admin/AdminUsersTab";
import AdminApprovalTab from "./admin/AdminApprovalTab";
import AdminSubscriptionTab from "./admin/AdminSubscriptionTab";
import BoardsManager from "./admin/BoardsManager";

export const AdminOverview = ({ initialData }: { initialData?: any }) => {
  const allUsers = initialData?.allUsers || [];
  const summary = initialData?.summary;
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const roleLabel = (role: string) => {
    const r = role?.toUpperCase();
    return r === "SUPER_ADMIN" ? "এডমিন" : r === "INSTITUTION_ADMIN" ? "পরিচালক" : "দর্শক";
  };
  const roleBadge = (role: string) => {
    const r = role?.toUpperCase();
    return r === "SUPER_ADMIN" ? "bg-destructive/10 text-destructive" : r === "INSTITUTION_ADMIN" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground";
  };

  if (showAnalytics) {
    return (
      <div className="max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-lg md:text-xl font-extrabold text-foreground">📊 উন্নত বিশ্লেষণ</h1>
            <p className="text-sm text-muted-foreground">প্ল্যাটফর্মের বিস্তারিত পরিসংখ্যান ও প্রবণতি</p>
          </div>
          <Button onClick={() => setShowAnalytics(false)} variant="outline" size="sm">
            ← ফিরে যান
          </Button>
        </div>
        <AdminAnalytics />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-lg md:text-xl font-extrabold text-foreground">📊 সারসংক্ষেপ</h1>
        <Button onClick={() => setShowAnalytics(true)} variant="outline" size="sm">
          <BarChart3 className="w-4 h-4 mr-2" />
          উন্নত বিশ্লেষণ
        </Button>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <AdminStats summary={summary} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-lg p-5">
        <h2 className="text-base font-bold text-foreground mb-3">সাম্প্রতিক কার্যক্রম</h2>
        <div className="space-y-3">
          {allUsers.slice(0, 5).map((u: any) => (
            <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-background/60 border border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{u.email}</p>
                  <p className="text-[10px] text-muted-foreground">{roleLabel(u.role)}</p>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${roleBadge(u.role)}`}>
                {roleLabel(u.role)}
              </span>
            </div>
          ))}
          {allUsers.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">কোনো ব্যবহারকারী নেই</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const SearchableWrapper = ({ children, title }: { children: (q: string) => React.ReactNode; title: string }) => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="max-w-4xl">
      <h1 className="text-lg md:text-xl font-extrabold text-foreground mb-4">{title}</h1>
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          placeholder="অনুসন্ধান করুন..." className="h-10 pl-10 rounded-lg bg-background/60 border-border/50 text-sm" />
      </div>
      {children(searchQuery)}
    </div>
  );
};

export const AdminApprovalPage = () => (
  <SearchableWrapper title="✅ অনুমোদন">{(q) => <AdminApprovalTab searchQuery={q} />}</SearchableWrapper>
);

export const AdminSubscriptionPage = () => (
  <SearchableWrapper title="💳 সাবস্ক্রিপশন">{(q) => <AdminSubscriptionTab searchQuery={q} />}</SearchableWrapper>
);

export const AdminMadrasaPage = () => (
  <SearchableWrapper title="🕌 মাদ্রাসা">{(q) => <AdminMadrasaTab searchQuery={q} />}</SearchableWrapper>
);

export const AdminUsersPage = () => (
  <SearchableWrapper title="👥 ইউজার">{(q) => <AdminUsersTab searchQuery={q} />}</SearchableWrapper>
);

export const AdminBoardsPage = () => (
  <div className="max-w-4xl">
    <BoardsManager />
  </div>
);
