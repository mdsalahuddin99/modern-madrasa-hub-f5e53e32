"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2, ShieldCheck, Star, FileText, CheckCircle2, Ban, PauseCircle, Clock, SlidersHorizontal, ChevronRight, MapPin, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { cn, toBn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const statusMap = {
  "PENDING": { label: "অপেক্ষমান", color: "text-orange-500", bg: "bg-orange-500/10", icon: Clock },
  "APPROVED": { label: "অনুমোদিত", color: "text-primary", bg: "bg-primary/5", icon: CheckCircle2 },
  "REJECTED": { label: "বাতিল", color: "text-destructive", bg: "bg-destructive/10", icon: Ban },
  "SUSPENDED": { label: "স্থগিত", color: "text-stone-500", bg: "bg-stone-500/10", icon: PauseCircle },
};

interface AdminMadrasaTabProps {
  searchQuery: string;
}

export default function AdminMadrasaTab({ searchQuery }: AdminMadrasaTabProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { allMadrasas, deleteMadrasa, updateMadrasaStatus, updateVerificationStatus, toggleFeatured } = useAdmin();

  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED">("ALL");
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [verifyingMadrasa, setVerifyingMadrasa] = useState<any | null>(null);
  const [verifyNotes, setVerifyNotes] = useState("");

  const filtered = allMadrasas.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (m.districtId && m.districtId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTab = activeTab === "ALL" || m.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleDelete = (madrasa: any) => {
    deleteMadrasa(madrasa.id);
    setDeleteTarget(null);
    toast({ title: "মাদ্রাসা মুছে ফেলা হয়েছে", description: madrasa.name });
  };

  const handleStatusChange = async (id: string, status: any) => {
    await updateMadrasaStatus(id, status);
    toast({ title: "স্ট্যাটাস আপডেট করা হয়েছে" });
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    await toggleFeatured(id, featured);
    toast({ title: featured ? "Featured করা হয়েছে" : "Featured থেকে সরানো হয়েছে" });
  };

  const submitVerification = async (status: "VERIFIED" | "REJECTED" | "PENDING") => {
    if (!verifyingMadrasa) return;
    await updateVerificationStatus(verifyingMadrasa.id, status, verifyNotes);
    setVerifyingMadrasa(null);
    toast({ title: "ভেরিফিকেশন স্ট্যাটাস আপডেট হয়েছে" });
  };

  return (
    <div className="space-y-8">
      {/* Premium Filter Pill Bar */}
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pb-2 -mx-2 px-2">
        {(["ALL", "PENDING", "APPROVED", "REJECTED", "SUSPENDED"] as const).map(tab => {
          const isActive = activeTab === tab;
          const count = tab === "ALL" ? allMadrasas.length : allMadrasas.filter(m => m.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active-scale border",
                isActive
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                  : "bg-card text-muted-foreground border-border/40 hover:border-primary/20"
              )}
            >
              {tab === "ALL" ? "সকল মাদ্রাসা" : statusMap[tab].label}
              <span className={cn(
                "ml-1 px-2 py-0.5 rounded-lg text-[10px] font-black",
                isActive ? "bg-white/20 text-white" : "bg-secondary text-muted-foreground"
              )}>
                {toBn(count)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Madrasa List - Premium Card Layout */}
      <div className="grid grid-cols-1 gap-4 lg:gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((m, i) => {
            const status = statusMap[m.status as keyof typeof statusMap] || statusMap.PENDING;
            const StatusIcon = status.icon;
            const isVerified = m.verification?.status === "VERIFIED";

            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-[2.5rem] border border-border/40 shadow-soft p-5 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-primary/20 transition-all group"
              >
                {/* Info Section */}
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-[1.5rem] overflow-hidden flex-shrink-0 bg-primary/5 border border-primary/10">
                    {m.image ? (
                      <Image src={m.image} alt={m.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-black text-primary/20 text-2xl uppercase">{m.name.slice(0, 1)}</div>
                    )}
                  </div>
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base lg:text-xl font-black text-foreground truncate">{m.name}</h3>
                      {isVerified && <div className="bg-primary/10 p-1 rounded-lg" title="Verified"><ShieldCheck className="w-4 h-4 text-primary" strokeWidth={2.5} /></div>}
                      {m.featured && <div className="bg-primary/10 p-1 rounded-lg" title="Featured"><Star className="w-4 h-4 text-primary fill-primary" /></div>}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", status.bg, status.color)}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        {m.districtId}
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                        <Layers className="w-3.5 h-3.5 text-primary" />
                        {m.category}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Action Controls */}
                <div className="flex flex-wrap items-center gap-4 lg:gap-6 pt-5 lg:pt-0 border-t lg:border-t-0 border-border/40">
                  
                  {/* Quick Status Select */}
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1 mb-1">স্ট্যাটাস</p>
                    <Select value={m.status} onValueChange={(val) => handleStatusChange(m.id, val)}>
                      <SelectTrigger className="h-10 rounded-xl text-xs font-bold w-[130px] bg-secondary/30 border-none active-scale">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="PENDING" className="font-bold">অপেক্ষমান</SelectItem>
                        <SelectItem value="APPROVED" className="font-bold text-primary">অনুমোদিত</SelectItem>
                        <SelectItem value="REJECTED" className="font-bold text-destructive">বাতিল</SelectItem>
                        <SelectItem value="SUSPENDED" className="font-bold">স্থগিত</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="hidden lg:block w-px h-10 bg-border/60 mx-1" />

                  {/* Icon Buttons Group */}
                  <div className="flex items-center gap-2">
                    {/* Verify Button */}
                    <button
                      onClick={() => { setVerifyingMadrasa(m); setVerifyNotes(m.verification?.notes || ""); }}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all active-scale shadow-sm border",
                        isVerified ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-border/40 hover:bg-primary/5 hover:text-primary"
                      )}
                      title="ভেরিফিকেশন"
                    >
                      <ShieldCheck className="w-5 h-5" strokeWidth={2.5} />
                    </button>

                    {/* Featured Toggle Switch Container */}
                    <div className="flex items-center gap-3 bg-secondary/30 px-4 h-10 rounded-xl border border-border/40">
                      <Star className={cn("w-4 h-4", m.featured ? "text-primary fill-primary" : "text-muted-foreground")} />
                      <Switch 
                        checked={m.featured} 
                        onCheckedChange={(checked) => handleToggleFeatured(m.id, checked)}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>

                    {/* View Button */}
                    <button
                      onClick={() => router.push(`/${m.slug}`)}
                      className="w-10 h-10 rounded-xl bg-card text-muted-foreground border border-border/40 flex items-center justify-center active-scale hover:bg-secondary/50 transition-all"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => setDeleteTarget(m)}
                      className="w-10 h-10 rounded-xl bg-destructive/5 text-destructive border border-destructive/10 flex items-center justify-center active-scale hover:bg-destructive hover:text-white transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-24 bg-card rounded-[3rem] border-2 border-dashed border-border/40">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <SlidersHorizontal className="w-10 h-10 text-primary/60 opacity-80" />
            </div>
            <h3 className="text-xl font-black text-foreground mb-2">কোনো মাদ্রাসা পাওয়া যায়নি</h3>
            <p className="text-sm font-medium text-muted-foreground">আপনার সার্চ বা ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
          </div>
        )}
      </div>

      {/* Verification Modal - Premium Style */}
      <Dialog open={!!verifyingMadrasa} onOpenChange={() => setVerifyingMadrasa(null)}>
        <DialogContent className="font-bengali sm:max-w-xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-primary p-8 text-white relative">
            <div className="absolute inset-0 islamic-pattern opacity-10" />
            <DialogTitle className="text-2xl font-black relative z-10">ভেরিফিকেশন রিভিউ</DialogTitle>
            <p className="text-white/70 text-sm mt-2 relative z-10 font-medium">{verifyingMadrasa?.name}</p>
          </div>
          
          <div className="p-8 space-y-8 bg-background">
            {verifyingMadrasa?.verification?.documentUrl ? (
              <div className="p-6 rounded-[2rem] border border-primary/20 bg-primary/5 flex items-center justify-between group active-scale cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <FileText className="w-6 h-6" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-foreground">ডকুমেন্ট আপলোড করা হয়েছে</h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">প্রমাণপত্র যাচাই করুন</p>
                  </div>
                </div>
                <a 
                  href={verifyingMadrasa.verification.documentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </a>
              </div>
            ) : (
              <div className="p-8 rounded-[2rem] border-2 border-dashed border-border/40 bg-secondary/20 text-center">
                <p className="text-sm font-bold text-muted-foreground">কোনো ভেরিফিকেশন ডকুমেন্ট পাওয়া যায়নি</p>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">অ্যাডমিন নোটস (Internal)</label>
              <Textarea 
                value={verifyNotes}
                onChange={(e) => setVerifyNotes(e.target.value)}
                placeholder="ভেরিফিকেশন সংক্রান্ত কোনো তথ্য থাকলে এখানে লিখে রাখুন..."
                className="rounded-[1.5rem] min-h-[120px] bg-secondary/30 border-none font-bold placeholder:text-muted-foreground/40 p-5 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <DialogFooter className="p-8 bg-secondary/20 flex flex-col sm:flex-row gap-3">
            <Button variant="ghost" onClick={() => setVerifyingMadrasa(null)} className="h-14 rounded-2xl font-black text-sm uppercase tracking-widest active-scale flex-1">
              বাতিল
            </Button>
            <div className="flex gap-3 flex-[2]">
              <Button 
                onClick={() => submitVerification("REJECTED")}
                className="h-14 rounded-2xl bg-destructive text-white font-black text-sm uppercase tracking-widest active-scale flex-1 shadow-lg shadow-destructive/20"
              >
                রিজেক্ট
              </Button>
              <Button 
                onClick={() => submitVerification("VERIFIED")}
                className="h-14 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest active-scale flex-1 shadow-lg shadow-primary/20"
              >
                ভেরিফাই করুন
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="font-bengali rounded-[2.5rem] p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-foreground">মাদ্রাসা মুছে ফেলবেন?</AlertDialogTitle>
            <AlertDialogDescription className="text-base font-medium mt-3">
               আপনি কি নিশ্চিতভাবে <span className="text-primary font-black">"{deleteTarget?.name}"</span> মুছে ফেলতে চান? এই তথ্যটি চিরস্থায়ীভাবে ডিলিট হয়ে যাবে।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="h-12 rounded-xl font-black text-xs uppercase tracking-widest border-border/60 active-scale">বাতিল</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
              className="h-12 rounded-xl bg-destructive text-white font-black text-xs uppercase tracking-widest active-scale shadow-lg shadow-destructive/20 hover:bg-destructive"
            >
              মুছে ফেলুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
