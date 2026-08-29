"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Clock, Eye, CreditCard, Phone, Calendar, AlertTriangle, Sparkles, ChevronRight, Hash, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/contexts/AdminContext";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatBDT } from "@/data/subscriptions";
import { Subscription } from "@prisma/client";
import { cn, toBn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type MadrasaSubscription = Subscription & { madrasa?: any; plan?: any; user?: any; payments?: any[]; };

interface AdminSubscriptionTabProps {
  searchQuery: string;
}

const statusConfigs = {
  "PENDING": { label: "অপেক্ষমাণ", color: "text-orange-500", bg: "bg-orange-500/10", icon: Clock },
  "ACTIVE": { label: "সক্রিয়", color: "text-primary", bg: "bg-primary/5", icon: CheckCircle2 },
  "EXPIRED": { label: "মেয়াদোত্তীর্ণ", color: "text-stone-500", bg: "bg-stone-500/10", icon: AlertTriangle },
  "REJECTED": { label: "প্রত্যাখ্যাত", color: "text-destructive", bg: "bg-destructive/10", icon: XCircle },
};

const AdminSubscriptionTab = ({ searchQuery }: AdminSubscriptionTabProps) => {
  const { toast } = useToast();
  const { subscriptions, approveSubscription, rejectSubscription, summary } = useAdmin();
  const [viewItem, setViewItem] = useState<MadrasaSubscription | null>(null);
  const [rejectTarget, setRejectTarget] = useState<MadrasaSubscription | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  const filtered = subscriptions.filter(s =>
    s.madrasa?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s as any).payments?.[0]?.transactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s as any).payments?.[0]?.payerPhone?.includes(searchQuery)
  );

  const handleApprove = (id: string) => {
    approveSubscription(id);
    setViewItem(null);
    toast({ title: "সাবস্ক্রিপশন অনুমোদিত হয়েছে" });
  };

  const handleReject = (id: string) => {
    rejectSubscription(id, rejectNote);
    setRejectTarget(null);
    setRejectNote("");
    toast({ title: "সাবস্ক্রিপশন প্রত্যাখ্যান করা হয়েছে", variant: "destructive" });
  };

  const paymentLabel = (method: string) => {
    switch (method.toLowerCase()) {
      case "bkash": return "বিকাশ";
      case "nagad": return "নগদ";
      case "rocket": return "রকেট";
      case "bank": return "ব্যাংক";
      default: return method;
    }
  };

  return (
    <div className="space-y-8">
      {/* Premium Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "অপেক্ষমাণ", val: summary.pendingSubscriptions, color: "text-orange-500", bg: "bg-orange-500/10", icon: Clock },
          { label: "সক্রিয়", val: summary.activeSubscriptions, color: "text-primary", bg: "bg-primary/5", icon: CheckCircle2 },
          { label: "মেয়াদোত্তীর্ণ", val: summary.expiredSubscriptions, color: "text-stone-500", bg: "bg-secondary", icon: AlertTriangle },
          { label: "প্রত্যাখ্যাত", val: summary.rejectedSubscriptions, color: "text-destructive", bg: "bg-destructive/5", icon: XCircle },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card p-5 rounded-[2rem] border border-border/40 shadow-soft active-scale relative overflow-hidden"
          >
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", s.bg)}>
              <s.icon className={cn("w-5 h-5", s.color)} strokeWidth={2.5} />
            </div>
            <p className="text-2xl font-black text-foreground tabular-nums">{toBn(s.val)}</p>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Payment Requests List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2 mb-2">
           <h3 className="text-xl font-black text-foreground flex items-center gap-3">
              <div className="w-1.5 h-6 bg-accent rounded-full" />
              পেমেন্ট আবেদনসমূহ
           </h3>
           <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase tracking-tighter">
              মোট {toBn(filtered.length)}টি
           </Badge>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((s, i) => {
              const payment = (s as any).payments?.[0];
              const config = statusConfigs[s.status as keyof typeof statusConfigs] || statusConfigs.PENDING;
              const StatusIcon = config.icon;

              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card p-5 sm:p-6 rounded-[2.5rem] border border-border/40 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-5 group hover:border-primary/20 transition-all active-scale"
                >
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary/40 font-black text-xl shrink-0 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-black text-foreground truncate">{s.madrasa?.name || "অজানা মাদ্রাসা"}</h4>
                        <div className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest", config.bg, config.color)}>
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                         <span className="flex items-center gap-1"><Wallet className="w-3 h-3 text-accent" /> {paymentLabel(payment?.gateway || "N/A")}</span>
                         <span className="w-1 h-1 rounded-full bg-border" />
                         <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> {payment?.transactionId || "No ID"}</span>
                         <span className="hidden sm:inline w-1 h-1 rounded-full bg-border" />
                         <span className="hidden sm:inline">জমা: {toBn(new Date(s.createdAt).toLocaleDateString("bn-BD"))}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-border/40">
                    <Button
                      variant="ghost"
                      className="h-11 w-11 p-0 rounded-xl bg-secondary/50 text-muted-foreground hover:bg-primary/10 hover:text-primary active-scale"
                      onClick={() => setViewItem(s)}
                    >
                      <Eye className="w-5 h-5" />
                    </Button>

                    {s.status === "PENDING" && (
                      <>
                        <Button
                          className="h-11 px-6 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-widest active-scale gap-2 shadow-lg shadow-primary/20"
                          onClick={() => handleApprove(s.id)}
                        >
                          <CheckCircle2 className="w-4 h-4" /> অনুমোদন
                        </Button>
                        <Button
                          variant="outline"
                          className="h-11 w-11 p-0 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/5 active-scale"
                          onClick={() => setRejectTarget(s)}
                        >
                          <XCircle className="w-5 h-5" />
                        </Button>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20 bg-card rounded-[2.5rem] border-2 border-dashed border-border/40">
               <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
               <p className="text-sm font-bold text-muted-foreground">কোনো পেমেন্ট আবেদন পাওয়া যায়নি</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Dialog - Native App Style */}
      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="font-bengali p-0 border-none rounded-[2.5rem] max-w-xl overflow-hidden shadow-2xl">
          {viewItem && (
            <div className="flex flex-col h-full max-h-[85vh]">
               <div className="bg-primary p-8 text-white relative">
                  <div className="absolute inset-0 islamic-pattern opacity-10" />
                  <div className="relative z-10 flex items-center justify-between">
                     <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-[10px] font-black uppercase tracking-widest mb-2">
                           <Sparkles className="w-3 h-3 text-accent" /> পেমেন্ট ডিটেইলস
                        </div>
                        <DialogTitle className="text-2xl font-black">{viewItem.madrasa?.name || "অজানা মাদ্রাসা"}</DialogTitle>
                     </div>
                     <div className="w-14 h-14 rounded-2xl bg-accent/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <CreditCard className="w-7 h-7 text-accent" />
                     </div>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-background">
                  {/* Plan Info Card */}
                  <div className="p-6 rounded-[2rem] bg-secondary/40 border border-border/40">
                     <div className="flex justify-between items-end">
                        <div>
                           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">সাবস্ক্রিপশন প্ল্যান</p>
                           <h4 className="text-lg font-black text-primary uppercase">{viewItem.plan?.name || viewItem.planId}</h4>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">মূল্য</p>
                           <h4 className="text-xl font-black text-foreground tabular-nums">{toBn(viewItem.plan?.totalPrice || 0)} টাকা</h4>
                        </div>
                     </div>
                  </div>

                  {/* Payment Metadata Grid */}
                  <div className="grid grid-cols-2 gap-4">
                     {[
                        { label: "পেমেন্ট গেটওয়ে", value: paymentLabel((viewItem as any).payments?.[0]?.gateway || "N/A"), icon: Wallet, color: "text-primary" },
                        { label: "ট্রানজাকশন আইডি", value: (viewItem as any).payments?.[0]?.transactionId || "N/A", icon: Hash, color: "text-accent" },
                        { label: "পেমেন্ট নম্বর", value: (viewItem as any).payments?.[0]?.payerPhone || "N/A", icon: Phone, color: "text-primary" },
                        { label: "আবেদনের তারিখ", value: toBn(new Date(viewItem.createdAt).toLocaleDateString("bn-BD")), icon: Calendar, color: "text-accent" },
                     ].map((item, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-card border border-border/40 shadow-soft">
                           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{item.label}</p>
                           <p className="text-sm font-bold text-foreground flex items-center gap-2">
                              <item.icon className={cn("w-3.5 h-3.5", item.color)} strokeWidth={2.5} />
                              {item.value}
                           </p>
                        </div>
                     ))}
                  </div>

                  {/* Status & Validity */}
                  <div className="space-y-4 pt-4 border-t border-border/40">
                     <div className="flex items-center justify-between">
                        <p className="text-sm font-black text-foreground uppercase tracking-tighter">সাবস্ক্রিপশন স্ট্যাটাস</p>
                        <div className={cn("px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest",
                          statusConfigs[viewItem.status as keyof typeof statusConfigs]?.bg,
                          statusConfigs[viewItem.status as keyof typeof statusConfigs]?.color
                        )}>
                           {statusConfigs[viewItem.status as keyof typeof statusConfigs]?.label}
                        </div>
                     </div>

                     {viewItem.status === "ACTIVE" && viewItem.startDate && viewItem.endDate && (
                        <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                           <div>
                              <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-0.5">মেয়াদের শুরু</p>
                              <p className="text-sm font-bold text-foreground tabular-nums">{toBn(new Date(viewItem.startDate).toLocaleDateString("bn-BD"))}</p>
                           </div>
                           <ChevronRight className="w-4 h-4 text-primary/30" />
                           <div className="text-right">
                              <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-0.5">মেয়াদের শেষ</p>
                              <p className="text-sm font-bold text-foreground tabular-nums">{toBn(new Date(viewItem.endDate).toLocaleDateString("bn-BD"))}</p>
                           </div>
                        </div>
                     )}

                     {viewItem.reviewNote && (
                        <div className="p-5 rounded-2xl bg-destructive/5 border border-destructive/10">
                           <p className="text-[9px] font-black text-destructive uppercase tracking-widest mb-1">অ্যাডমিন নোটস</p>
                           <p className="text-sm font-medium text-foreground italic">“{viewItem.reviewNote}”</p>
                        </div>
                     )}
                  </div>
               </div>

               {viewItem.status === "PENDING" && (
                <div className="p-8 bg-secondary/20 border-t border-border/40 flex flex-col sm:flex-row gap-3">
                  <Button
                    className="h-14 flex-1 rounded-2xl bg-primary text-white font-black uppercase tracking-widest active-scale gap-2 shadow-lg shadow-primary/20"
                    onClick={() => { handleApprove(viewItem.id); }}
                  >
                    <CheckCircle2 className="w-5 h-5" /> পেমেন্ট অ্যাপ্রুভ
                  </Button>
                  <Button
                    variant="outline"
                    className="h-14 flex-1 rounded-2xl border-destructive/20 text-destructive font-black uppercase tracking-widest active-scale"
                    onClick={() => { setRejectTarget(viewItem); setViewItem(null); }}
                  >
                    <XCircle className="w-5 h-5 mr-2" /> রিজেক্ট করুন
                  </Button>
                </div>
               )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation */}
      <AlertDialog open={!!rejectTarget} onOpenChange={() => setRejectTarget(null)}>
        <AlertDialogContent className="font-bengali rounded-[2.5rem] p-8 border-none shadow-2xl">
          <AlertDialogHeader>
            <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center text-destructive mb-4 mx-auto">
               <XCircle className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <AlertDialogTitle className="text-2xl font-black text-foreground text-center">পেমেন্ট প্রত্যাখ্যান করবেন?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base font-medium mt-3">
              আপনি কি নিশ্চিতভাবে <span className="text-primary font-black">"{rejectTarget?.madrasa?.name || "এই মাদ্রাসা"}"</span> এর পেমেন্ট আবেদন বাতিল করতে চান?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-6">
             <Input
                placeholder="প্রত্যাখ্যানের কারণ লিখুন (ঐচ্ছিক)..."
                value={rejectNote}
                onChange={e => setRejectNote(e.target.value)}
                className="h-14 rounded-2xl bg-secondary/30 border-none font-bold placeholder:text-muted-foreground/40 p-5 focus-visible:ring-2 focus-visible:ring-primary/20"
             />
          </div>
          <AlertDialogFooter className="gap-3 flex-col sm:flex-row">
            <AlertDialogCancel className="h-12 rounded-xl font-black text-xs uppercase tracking-widest border-border/60 active-scale w-full sm:w-auto">বাতিল</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => rejectTarget && handleReject(rejectTarget.id)}
              className="h-12 rounded-xl bg-destructive text-white font-black text-xs uppercase tracking-widest active-scale shadow-lg shadow-destructive/20 hover:bg-destructive w-full sm:w-auto"
            >
              নিশ্চিত করুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminSubscriptionTab;
