"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Clock, Building2, MapPin, Phone, Users as UsersIcon, Eye, Sparkles, ChevronRight, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useAdmin } from "@/contexts/AdminContext";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Madrasa as PendingMadrasa } from "@prisma/client";
import { cn, toBn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface AdminApprovalTabProps {
  searchQuery: string;
}

const statusConfigs = {
  "PENDING": { label: "অপেক্ষমাণ", color: "text-orange-500", bg: "bg-orange-500/10", icon: Clock },
  "APPROVED": { label: "অনুমোদিত", color: "text-primary", bg: "bg-primary/5", icon: CheckCircle2 },
  "REJECTED": { label: "প্রত্যাখ্যাত", color: "text-destructive", bg: "bg-destructive/10", icon: XCircle },
};

const AdminApprovalTab = ({ searchQuery }: AdminApprovalTabProps) => {
  const { toast } = useToast();
  const { pendingMadrasas, updateMadrasaStatus } = useAdmin();
  const [viewItem, setViewItem] = useState<PendingMadrasa | null>(null);
  const [rejectTarget, setRejectTarget] = useState<PendingMadrasa | null>(null);

  const filtered = pendingMadrasas.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.districtId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = pendingMadrasas.filter(m => m.status === "PENDING").length;
  const approvedCount = pendingMadrasas.filter(m => m.status === "APPROVED").length;

  const handleApprove = async (id: string) => {
    await updateMadrasaStatus(id, "APPROVED");
    toast({ title: "আবেদন অনুমোদিত হয়েছে", variant: "default" });
  };

  const handleReject = async (id: string) => {
    await updateMadrasaStatus(id, "REJECTED");
    setRejectTarget(null);
    toast({ title: "আবেদন প্রত্যাখ্যাত হয়েছে", variant: "destructive" });
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const config = statusConfigs[status as keyof typeof statusConfigs] || statusConfigs.PENDING;
    const Icon = config.icon;
    return (
      <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", config.bg, config.color)}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Premium Stats Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-card p-6 rounded-[2rem] border border-border/40 shadow-soft relative overflow-hidden active-scale">
           <div className="absolute -top-6 -right-6 w-16 h-16 bg-orange-500/5 rounded-full blur-2xl" />
           <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
              <Clock className="w-5 h-5" strokeWidth={2.5} />
           </div>
           <p className="text-2xl font-black text-foreground tabular-nums">{toBn(pendingCount)}</p>
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">অপেক্ষমাণ আবেদন</p>
        </div>

        <div className="bg-card p-6 rounded-[2rem] border border-border/40 shadow-soft relative overflow-hidden active-scale">
           <div className="absolute -top-6 -right-6 w-16 h-16 bg-primary/5 rounded-full blur-2xl" />
           <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
           </div>
           <p className="text-2xl font-black text-foreground tabular-nums">{toBn(approvedCount)}</p>
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">অনুমোদিত মাদ্রাসা</p>
        </div>

        <div className="hidden lg:block bg-primary p-6 rounded-[2rem] text-white relative overflow-hidden shadow-lg shadow-primary/20 active-scale">
           <div className="absolute inset-0 islamic-pattern opacity-10" />
           <div className="relative z-10">
              <Sparkles className="w-6 h-6 text-primary mb-4" />
              <h4 className="text-lg font-black leading-tight">আবেদন রিভিউ প্যানেল</h4>
              <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mt-1">দ্রুত যাচাই করুন</p>
           </div>
        </div>
      </div>

      {/* Application List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2 mb-2">
           <h3 className="text-xl font-black text-foreground flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary rounded-full" />
              নিবন্ধন আবেদনসমূহ
           </h3>
           <span className="text-[10px] font-black text-muted-foreground uppercase bg-secondary px-3 py-1 rounded-full">
              মোট {toBn(filtered.length)}টি
           </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card p-5 sm:p-6 rounded-[2.5rem] border border-border/40 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-5 group hover:border-primary/20 transition-all active-scale"
              >
                <div className="flex items-start gap-4 min-w-0 flex-1">
                   <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary/60 font-black text-xl shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {m.name.slice(0, 1)}
                   </div>
                   <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                         <h4 className="text-base font-black text-foreground truncate">{m.name}</h4>
                         <StatusBadge status={m.status} />
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-bold text-muted-foreground uppercase tracking-tight">
                         <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-primary" /> {m.districtId}</span>
                         <span className="w-1 h-1 rounded-full bg-border" />
                         <span>{m.category}</span>
                         <span className="hidden sm:inline w-1 h-1 rounded-full bg-border" />
                         <span className="hidden sm:inline">জমা: {toBn(new Date(m.createdAt).toLocaleDateString("bn-BD"))}</span>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-border/40">
                  <Button
                    variant="ghost"
                    className="h-11 w-11 p-0 rounded-xl bg-primary/5 text-primary/60 hover:bg-primary/10 hover:text-primary active-scale"
                    onClick={() => setViewItem(m)}
                  >
                    <Eye className="w-5 h-5" />
                  </Button>

                  {m.status === "PENDING" && (
                    <>
                      <Button
                        className="h-11 px-6 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-widest active-scale gap-2 shadow-lg shadow-primary/20"
                        onClick={() => handleApprove(m.id)}
                      >
                        <CheckCircle2 className="w-4 h-4" /> অনুমোদন
                      </Button>
                      <Button
                        variant="outline"
                        className="h-11 w-11 p-0 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/5 active-scale"
                        onClick={() => setRejectTarget(m)}
                      >
                        <XCircle className="w-5 h-5" />
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20 bg-card rounded-[2.5rem] border-2 border-dashed border-border/40">
               <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
               <p className="text-sm font-bold text-muted-foreground">কোনো আবেদন পাওয়া যায়নি</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Dialog - Native Style Bottom Sheet Mix */}
      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="font-bengali p-0 border-none rounded-[2.5rem] max-w-xl overflow-hidden shadow-2xl">
          {viewItem && (
            <div className="flex flex-col h-full max-h-[85vh]">
               {/* Dialog Header with Pattern */}
               <div className="bg-primary p-8 text-white relative">
                  <div className="absolute inset-0 islamic-pattern opacity-10" />
                  <div className="relative z-10 flex items-center justify-between">
                     <div className="space-y-1">
                        <StatusBadge status={viewItem.status} />
                        <DialogTitle className="text-2xl font-black mt-2">{viewItem.name}</DialogTitle>
                     </div>
                     <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <Building2 className="w-7 h-7 text-primary" />
                     </div>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-background">
                  {/* Grid Stats */}
                  <div className="grid grid-cols-2 gap-4">
                     {[
                        { label: "বিভাগ", value: viewItem.divisionId, icon: MapPin },
                        { label: "জেলা", value: viewItem.districtId, icon: MapPin },
                        { label: "ক্যাটাগরি", value: viewItem.category, icon: Building2 },
                        { label: "শিক্ষার্থী", value: toBn(viewItem.students), icon: UsersIcon },
                     ].map((item, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-secondary/40 border border-border/40">
                           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{item.label}</p>
                           <p className="text-sm font-bold text-foreground flex items-center gap-2">
                              <item.icon className="w-3.5 h-3.5 text-primary" />
                              {item.value}
                           </p>
                        </div>
                     ))}
                  </div>

                  {/* Detailed Info Cards */}
                  <div className="space-y-4">
                     <div className="p-5 rounded-2xl bg-card border border-border/40 shadow-soft">
                        <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                           <Phone className="w-3 h-3" /> যোগাযোগ
                        </h5>
                        <p className="text-sm font-bold text-foreground leading-relaxed">
                           {viewItem.phone} <span className="mx-2 opacity-20">|</span> {viewItem.email}
                        </p>
                        <p className="text-xs font-medium text-muted-foreground mt-2">{viewItem.address}</p>
                     </div>

                     <div className="p-5 rounded-2xl bg-card border border-border/40 shadow-soft">
                        <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                           <User className="w-3 h-3" /> কর্তৃপক্ষ
                        </h5>
                        <p className="text-sm font-bold text-foreground">{viewItem.principalName || "দেওয়া হয়নি"}</p>
                     </div>

                     <div className="p-5 rounded-2xl bg-card border border-border/40 shadow-soft">
                        <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                           <Mail className="w-3 h-3" /> মাদ্রাসার বিবরণ
                        </h5>
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
                           {viewItem.description}
                        </p>
                     </div>
                  </div>
               </div>

               {viewItem.status === "PENDING" && (
                <div className="p-8 bg-secondary/20 border-t border-border/40 flex flex-col sm:flex-row gap-3">
                  <Button
                    className="h-14 flex-1 rounded-2xl bg-primary text-white font-black uppercase tracking-widest active-scale gap-2 shadow-lg shadow-primary/20"
                    onClick={() => { handleApprove(viewItem.id); setViewItem(null); }}
                  >
                    <CheckCircle2 className="w-5 h-5" /> অনুমোদন দিন
                  </Button>
                  <Button
                    variant="outline"
                    className="h-14 flex-1 rounded-2xl border-destructive/20 text-destructive font-black uppercase tracking-widest active-scale"
                    onClick={() => { setRejectTarget(viewItem); setViewItem(null); }}
                  >
                    <XCircle className="w-5 h-5 mr-2" /> প্রত্যাখ্যান
                  </Button>
                </div>
               )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation - Premium Style */}
      <AlertDialog open={!!rejectTarget} onOpenChange={() => setRejectTarget(null)}>
        <AlertDialogContent className="font-bengali rounded-[2.5rem] p-8 border-none shadow-2xl">
          <AlertDialogHeader>
            <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center text-destructive mb-4 mx-auto">
               <XCircle className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <AlertDialogTitle className="text-2xl font-black text-foreground text-center">আবেদন প্রত্যাখ্যান করবেন?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base font-medium mt-3">
              আপনি কি নিশ্চিতভাবে <span className="text-primary font-black">"{rejectTarget?.name}"</span> এর নিবন্ধন আবেদন বাতিল করতে চান?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3 flex-col sm:flex-row">
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

export default AdminApprovalTab;
