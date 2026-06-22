"use client";

import { useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle2, Phone, Hash, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { plans, formatBDT, toBn } from "@/data/subscriptions";

interface SubscriptionFormProps {
  madrasaId?: string;
  madrasaName?: string;
  preselectedPlan?: string;
  onSuccess?: () => void;
}

const SubscriptionForm = ({ madrasaId, madrasaName, preselectedPlan, onSuccess }: SubscriptionFormProps) => {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState(preselectedPlan || plans[0].id);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [transactionId, setTransactionId] = useState("");
  const [payerPhone, setPayerPhone] = useState("");
  const [selectedMadrasa, setSelectedMadrasa] = useState(madrasaId || "");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetcher = (url: string) => fetch(url).then(res => res.json());
  const { data } = useSWR('/api/madrasas?limit=100', fetcher);
  const allMadrasas = data?.madrasas || data?.data || [];

  const activePlan = plans.find(p => p.id === selectedPlan)!;

  const paymentMethods = [
    { value: "bkash", label: "বিকাশ", number: "01XXXXXXXXX" },
    { value: "nagad", label: "নগদ", number: "01XXXXXXXXX" },
    { value: "rocket", label: "রকেট", number: "01XXXXXXXXX" },
    { value: "bank", label: "ব্যাংক ট্রান্সফার", number: "অ্যাকাউন্ট: XXXXXXXXXX" },
  ];

  const handleSubmit = async () => {
    if (!selectedMadrasa || !paymentMethod || !transactionId || !payerPhone) {
      toast({ title: "সকল তথ্য পূরণ করুন", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          madrasaId: selectedMadrasa,
          planId: selectedPlan,
          paymentMethod: paymentMethod.toUpperCase(),
          transactionId,
          payerPhone,
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast({ title: "ত্রুটি", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">আবেদন জমা হয়েছে!</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          আপনার পেমেন্ট তথ্য এডমিনের কাছে পাঠানো হয়েছে। যাচাই সম্পন্ন হলে আপনার মাদ্রাসার প্রোফাইল পাবলিক হয়ে যাবে।
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Plan Selection */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">প্ল্যান নির্বাচন করুন</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {plans.map((plan, i) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${
                selectedPlan === plan.id
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border/50 bg-card hover:border-primary/30"
              }`}
            >
              {i === 1 && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-[9px] font-bold px-2.5 py-0.5 rounded-full">
                  জনপ্রিয়
                </span>
              )}
              <div className="text-lg font-extrabold text-foreground mb-0.5">{plan.name}</div>
              <div className="text-xl font-extrabold text-primary">{formatBDT(plan.totalPrice)}</div>
              <div className="text-[10px] text-muted-foreground mb-2">
                বাৎসরিক {formatBDT(plan.pricePerYear)}
              </div>
              <ul className="space-y-1">
                {plan.features.map(f => (
                  <li key={f} className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </div>

      {/* Madrasa Selection */}
      {!madrasaId && (
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">মাদ্রাসা নির্বাচন</label>
          <Select value={selectedMadrasa} onValueChange={setSelectedMadrasa}>
            <SelectTrigger className="h-11 rounded-xl border-border/50 bg-background text-sm">
              <SelectValue placeholder="মাদ্রাসা নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {allMadrasas.map(m => (
                <SelectItem key={m.id} value={m.id} className="text-sm">{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Payment Method */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">পেমেন্ট মাধ্যম</label>
        <div className="grid grid-cols-2 gap-2">
          {paymentMethods.map(pm => (
            <button
              key={pm.value}
              onClick={() => setPaymentMethod(pm.value)}
              className={`p-3 rounded-xl border text-left transition-all active:scale-[0.98] ${
                paymentMethod === pm.value
                  ? "border-primary bg-primary/5"
                  : "border-border/50 bg-card hover:border-primary/30"
              }`}
            >
              <div className="text-sm font-medium text-foreground">{pm.label}</div>
              <div className="text-[10px] text-muted-foreground">{pm.number}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction details */}
      {paymentMethod && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 text-xs text-foreground">
            <p className="font-medium mb-1">💡 নির্দেশনা:</p>
            <p className="text-muted-foreground">
              {paymentMethods.find(p => p.value === paymentMethod)?.label} এ {formatBDT(activePlan.totalPrice)} পাঠিয়ে ট্রানজেকশন আইডি ও ফোন নম্বর দিন।
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">ট্রানজেকশন আইডি</label>
            <div className="relative">
              <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={transactionId} onChange={e => setTransactionId(e.target.value)}
                placeholder="যেমন: TXN1234567890" className="h-11 pl-10 rounded-xl border-border/50" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">প্রদানকারীর ফোন নম্বর</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="tel" value={payerPhone} onChange={e => setPayerPhone(e.target.value)}
                placeholder="01XXXXXXXXX" className="h-11 pl-10 rounded-xl border-border/50" />
            </div>
          </div>
        </motion.div>
      )}

      <Button
        className="w-full h-12 rounded-xl text-sm font-semibold gap-2 shimmer-btn gradient-btn text-primary-foreground shadow-xl shadow-primary/15"
        onClick={handleSubmit}
        disabled={!selectedMadrasa || !paymentMethod || !transactionId || !payerPhone}
      >
        <CreditCard className="w-4 h-4" /> পেমেন্ট আবেদন জমা দিন
      </Button>
    </div>
  );
};

export default SubscriptionForm;
