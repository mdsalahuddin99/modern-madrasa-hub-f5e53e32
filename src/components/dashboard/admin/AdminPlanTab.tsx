"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Check, X, Loader2, DollarSign, List, Clock, ShieldCheck, Sparkles, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn, toBn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SubscriptionPlan {
  id: string;
  name: string;
  durationYear: number;
  pricePerYear: number;
  totalPrice: number;
  features: string[];
  active: boolean;
}

const AdminPlanTab = () => {
  const { toast } = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Partial<SubscriptionPlan> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/admin/subscription-plans");
      const data = await res.json();
      if (data.success) {
        setPlans(data.data);
      }
    } catch (error) {
      toast({ title: "প্ল্যান লোড করতে সমস্যা হয়েছে", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleOpenAdd = () => {
    setEditingPlan({
      name: "",
      durationYear: 1,
      pricePerYear: 0,
      totalPrice: 0,
      features: [""],
      active: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setIsDialogOpen(true);
  };

  const handleFeatureChange = (index: number, value: string) => {
    if (!editingPlan) return;
    const newFeatures = [...(editingPlan.features || [])];
    newFeatures[index] = value;
    setEditingPlan({ ...editingPlan, features: newFeatures });
  };

  const addFeature = () => {
    if (!editingPlan) return;
    setEditingPlan({ ...editingPlan, features: [...(editingPlan.features || []), ""] });
  };

  const removeFeature = (index: number) => {
    if (!editingPlan) return;
    const newFeatures = (editingPlan.features || []).filter((_, i) => i !== index);
    setEditingPlan({ ...editingPlan, features: newFeatures });
  };

  const handleSubmit = async () => {
    if (!editingPlan?.name || !editingPlan.features?.length) {
      toast({ title: "দয়া করে সব তথ্য পূরণ করুন", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const isEdit = !!editingPlan.id;
      const url = isEdit 
        ? `/api/admin/subscription-plans/${editingPlan.id}` 
        : "/api/admin/subscription-plans";
      
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPlan),
      });

      const data = await res.json();
      if (data.success) {
        toast({ title: isEdit ? "প্ল্যান আপডেট হয়েছে" : "নতুন প্ল্যান তৈরি হয়েছে" });
        setIsDialogOpen(false);
        fetchPlans();
      } else {
        toast({ title: data.error?.message || "ব্যর্থ হয়েছে", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "সার্ভার এরর", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/subscription-plans/${deleteTarget}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast({ title: "প্ল্যানটি ডিলিট করা হয়েছে" });
        fetchPlans();
      } else {
        toast({ title: data.error?.message || "ডিলিট করা সম্ভব হয়নি", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "সার্ভার এরর", variant: "destructive" });
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 rounded-[2.5rem] bg-card border border-border/40 animate-pulse shadow-soft" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-foreground flex items-center gap-3">
             <div className="w-1.5 h-6 bg-primary rounded-full" />
             পেমেন্ট প্ল্যানসমূহ
          </h2>
          <p className="text-sm font-bold text-muted-foreground mt-1 uppercase tracking-tighter">সাবস্ক্রিপশন প্যাকেজ পরিচালনা করুন</p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="h-12 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-widest active-scale gap-2 shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> নতুন প্ল্যান তৈরি করুন
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "relative flex flex-col bg-card rounded-[2.5rem] border-2 p-8 transition-all hover:shadow-2xl active-scale group",
                plan.active ? "border-border/40 shadow-soft" : "border-destructive/10 opacity-60 grayscale"
              )}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[3rem] group-hover:bg-primary/10 transition-colors duration-500" />

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-foreground uppercase tracking-tight">{plan.name}</h3>
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                    plan.active ? "bg-primary/5 text-primary" : "bg-destructive/5 text-destructive"
                  )}>
                    <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", plan.active ? "bg-primary" : "bg-destructive")} />
                    {plan.active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenEdit(plan)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary active-scale transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(plan.id)} className="w-9 h-9 rounded-xl bg-destructive/5 flex items-center justify-center text-destructive hover:bg-destructive hover:text-white active-scale transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-6 mb-8 relative z-10">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/40 border border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                       <Clock className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">মেয়াদকাল</p>
                       <p className="text-sm font-black text-foreground tabular-nums">{toBn(plan.durationYear)} বছর</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">মূল্য</p>
                    <p className="text-lg font-black text-primary tabular-nums">৳{toBn(plan.totalPrice)}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">অন্তর্ভুক্ত ফিচারসমূহ</p>
                  <div className="grid grid-cols-1 gap-2">
                    {plan.features.slice(0, 4).map((f, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/50 border border-border/40">
                        <Check className="w-3.5 h-3.5 text-primary stroke-[3px]" />
                        <span className="text-xs font-bold text-foreground/70 line-clamp-1">{f}</span>
                      </div>
                    ))}
                    {plan.features.length > 4 && (
                      <p className="text-[10px] text-center text-primary font-black uppercase tracking-widest mt-2">আরও {toBn(plan.features.length - 4)}টি ফিচার আছে</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-border/40 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                 <span>Plan ID: {plan.id.slice(0, 8)}</span>
                 <Zap className="w-3 h-3 text-primary" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {plans.length === 0 && !loading && (
        <div className="text-center py-32 bg-card rounded-[3rem] border-2 border-dashed border-border/40">
           <Zap className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
           <p className="text-sm font-bold text-muted-foreground">কোনো পেমেন্ট প্ল্যান তৈরি করা হয়নি</p>
        </div>
      )}

      {/* Premium Dialog UI */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="font-bengali p-0 border-none rounded-[2.5rem] max-w-xl overflow-hidden shadow-2xl">
          <div className="bg-primary p-8 text-white relative">
            <div className="absolute inset-0 islamic-pattern opacity-10" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-[10px] font-black uppercase tracking-widest mb-2">
                   <Sparkles className="w-3 h-3 text-primary" /> সাবস্ক্রিপশন কনফিগ
                </div>
                <DialogTitle className="text-2xl font-black">
                  {editingPlan?.id ? "প্ল্যান এডিট করুন" : "নতুন প্ল্যান তৈরি"}
                </DialogTitle>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Zap className="w-7 h-7 text-primary" />
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6 bg-background max-h-[60vh] overflow-y-auto scrollbar-none">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">প্ল্যানের নাম</label>
              <Input 
                value={editingPlan?.name || ""} 
                onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                placeholder="যেমন: সিলভার প্ল্যান"
                className="h-14 rounded-2xl bg-secondary/30 border-none font-bold placeholder:text-muted-foreground/40 px-6 focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">মেয়াদ (বছর)</label>
                <Input 
                  type="number" 
                  value={editingPlan?.durationYear || 1} 
                  onChange={(e) => setEditingPlan({ ...editingPlan, durationYear: Number(e.target.value) })}
                  className="h-14 rounded-2xl bg-secondary/30 border-none font-bold px-6 focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">মোট মূল্য (৳)</label>
                <Input 
                  type="number" 
                  value={editingPlan?.totalPrice || 0} 
                  onChange={(e) => {
                    const total = Number(e.target.value);
                    const perYear = total / (editingPlan?.durationYear || 1);
                    setEditingPlan({ ...editingPlan, totalPrice: total, pricePerYear: Math.round(perYear) });
                  }}
                  className="h-14 rounded-2xl bg-secondary/30 border-none font-bold px-6 focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2 block">প্যাকেজ ফিচারসমূহ</label>
              <div className="space-y-3">
                {editingPlan?.features?.map((f, i) => (
                  <div key={i} className="flex gap-2">
                    <Input 
                      value={f} 
                      onChange={(e) => handleFeatureChange(i, e.target.value)}
                      placeholder="ফিচারের বর্ণনা দিন"
                      className="h-12 rounded-xl bg-secondary/30 border-none font-bold text-sm px-5"
                    />
                    <button
                      onClick={() => removeFeature(i)}
                      disabled={editingPlan.features!.length <= 1}
                      className="w-12 h-12 rounded-xl bg-destructive/5 text-destructive flex items-center justify-center active-scale disabled:opacity-30"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <Button variant="outline" onClick={addFeature} className="w-full h-12 rounded-xl border-dashed border-primary/40 text-primary font-black text-xs uppercase tracking-widest active-scale gap-2">
                  <Plus className="w-4 h-4" /> ফিচার যোগ করুন
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/20 border border-border/40">
              <input 
                type="checkbox" 
                id="plan-active" 
                checked={editingPlan?.active ?? true}
                onChange={(e) => setEditingPlan({ ...editingPlan, active: e.target.checked })}
                className="w-5 h-5 rounded-lg border-border text-primary focus:ring-primary/20 cursor-pointer"
              />
              <label htmlFor="plan-active" className="text-xs font-black text-foreground cursor-pointer uppercase tracking-tighter">সবাইকে এই প্ল্যানটি দেখান</label>
            </div>
          </div>

          <DialogFooter className="p-8 bg-secondary/20 flex flex-col sm:flex-row gap-3">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-14 rounded-2xl font-black text-sm uppercase tracking-widest active-scale flex-1">বাতিল</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="h-14 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest active-scale flex-1 shadow-lg shadow-primary/20">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "সেভ করুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="font-bengali rounded-[2.5rem] p-8 border-none shadow-2xl">
          <AlertDialogHeader>
            <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center text-destructive mb-4 mx-auto">
               <Trash2 className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <AlertDialogTitle className="text-2xl font-black text-foreground text-center">প্ল্যান মুছে ফেলবেন?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base font-medium mt-3">
              আপনি কি নিশ্চিতভাবে এই সাবস্ক্রিপশন প্ল্যানটি ডিলিট করতে চান? এই কাজটি অপরিবর্তনীয়।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3 flex-col sm:flex-row">
            <AlertDialogCancel className="h-12 rounded-xl font-black text-xs uppercase tracking-widest border-border/60 active-scale w-full sm:w-auto">না, ফিরে যান</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="h-12 rounded-xl bg-destructive text-white font-black text-xs uppercase tracking-widest active-scale shadow-lg shadow-destructive/20 hover:bg-destructive w-full sm:w-auto"
            >
              হ্যাঁ, ডিলিট করুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPlanTab;
