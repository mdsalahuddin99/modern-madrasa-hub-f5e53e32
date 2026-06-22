import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Check, X, Loader2, DollarSign, List, Clock, ShieldCheck } from "lucide-react";
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
  const [isDialogOpen, setIsDrawerOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Partial<SubscriptionPlan> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // প্ল্যান লোড করা
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
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setIsDrawerOpen(true);
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
        setIsDrawerOpen(false);
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
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-bold text-foreground">বিদ্যমান প্ল্যানসমূহ ({plans.length})</h2>
        <Button onClick={handleOpenAdd} size="sm" className="rounded-xl gap-2">
          <Plus className="w-4 h-4" /> নতুন প্ল্যান
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className={`glass-card rounded-2xl p-5 border ${plan.active ? 'border-border/40' : 'border-destructive/20 opacity-70'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-extrabold text-foreground">{plan.name}</h3>
                <Badge variant={plan.active ? "secondary" : "outline"} className="text-[10px] mt-1">
                  {plan.active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                </Badge>
              </div>
              <div className="flex gap-1">
                <Button onClick={() => handleOpenEdit(plan)} size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg">
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button onClick={() => setDeleteTarget(plan.id)} size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-medium">{plan.durationYear} বছর মেয়াদ</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="font-medium text-lg">৳{plan.totalPrice}</span>
                <span className="text-[10px] text-muted-foreground">(৳{plan.pricePerYear}/বছর)</span>
              </div>
              <div className="space-y-1.5 mt-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">ফিচারসমূহ</p>
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span className="line-clamp-1">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {plans.length === 0 && (
        <div className="text-center py-10 bg-muted/20 rounded-2xl border border-dashed border-border">
          <p className="text-sm text-muted-foreground">কোনো প্ল্যান পাওয়া যায়নি</p>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDrawerOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editingPlan?.id ? "প্ল্যান এডিট করুন" : "নতুন প্ল্যান তৈরি করুন"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">প্ল্যানের নাম</label>
              <Input 
                value={editingPlan?.name || ""} 
                onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                placeholder="যেমন: প্রিমিয়াম প্ল্যান"
                className="rounded-xl h-10"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">মেয়াদ (বছর)</label>
                <Input 
                  type="number" 
                  value={editingPlan?.durationYear || 1} 
                  onChange={(e) => setEditingPlan({ ...editingPlan, durationYear: Number(e.target.value) })}
                  className="rounded-xl h-10"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">মোট মূল্য (৳)</label>
                <Input 
                  type="number" 
                  value={editingPlan?.totalPrice || 0} 
                  onChange={(e) => {
                    const total = Number(e.target.value);
                    const perYear = total / (editingPlan?.durationYear || 1);
                    setEditingPlan({ ...editingPlan, totalPrice: total, pricePerYear: Math.round(perYear) });
                  }}
                  className="rounded-xl h-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground block">ফিচারসমূহ</label>
              <div className="space-y-2">
                {editingPlan?.features?.map((f, i) => (
                  <div key={i} className="flex gap-2">
                    <Input 
                      value={f} 
                      onChange={(e) => handleFeatureChange(i, e.target.value)}
                      placeholder="ফিচারের নাম"
                      className="rounded-xl h-9 text-xs"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeFeature(i)}
                      disabled={editingPlan.features!.length <= 1}
                      className="h-9 w-9 p-0 rounded-xl text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addFeature} className="w-full rounded-xl h-9 text-xs gap-2">
                  <Plus className="w-3.5 h-3.5" /> ফিচার যোগ করুন
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 py-2">
              <input 
                type="checkbox" 
                id="plan-active" 
                checked={editingPlan?.active ?? true}
                onChange={(e) => setEditingPlan({ ...editingPlan, active: e.target.checked })}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
              />
              <label htmlFor="plan-active" className="text-xs font-medium cursor-pointer">এই প্ল্যানটি পাবলিকলি দেখাবে</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDrawerOpen(false)} className="rounded-xl">বাতিল</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="rounded-xl min-w-[100px]">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "সেভ করুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
            <AlertDialogDescription>
              এই প্ল্যানটি ডিলিট করলে তা আর পুনরুদ্ধার করা যাবে না। যদি কোনো মাদ্রাসা ইতিমধ্যে এই প্ল্যানটি ব্যবহার করে থাকে, তবে এটি ডিলিট করা সম্ভব হবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">না</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">হ্যাঁ, ডিলিট করুন</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPlanTab;
