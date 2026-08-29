"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CheckCircle2, Building2, MapPin, Phone, Info, ArrowRight, Sparkles, Home, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LocationSelector } from "@/components/ui/location-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/data/madrasas";
import { createMadrasaSchema } from "@/lib/validations";
import { cn, toBn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type FormValues = z.infer<typeof createMadrasaSchema>;

const boards = [
  "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ",
  "বেফাকুল মাদারিসিল কওমিয়া গওহরডাঙ্গা",
  "আঞ্জুমানে ইত্তেহাদুল মাদারিস বাংলাদেশ",
  "আযাদ দ্বীনী এদারায়ে তালীম বাংলাদেশ",
  "তানজিমুল মাদারিসিদ দ্বীনিয়া বাংলাদেশ",
  "বেফাকুল মাদারিসিল দ্বীনিয়া বাংলাদেশ",
  "অন্যান্য",
];

export default function MadrasaRegisterPage() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(createMadrasaSchema),
    defaultValues: {
      name: "",
      category: "",
      board: "",
      divisionId: "",
      districtId: "",
      thanaId: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      description: "",
      established: "",
      students: 0,
      teachers: 0,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setServerError("");
      const res = await fetch("/api/madrasas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "নিবন্ধন করতে সমস্যা হয়েছে।");
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setServerError(err.message);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-secondary/10 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-5">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center max-w-md bg-card p-10 rounded-[3rem] border border-border/40 shadow-soft"
          >
            <div className="w-24 h-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-12 h-12 text-primary" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black text-foreground mb-4">নিবন্ধন সফল হয়েছে!</h2>
            <p className="text-muted-foreground font-medium mb-10 leading-relaxed">
              আপনার মাদ্রাসার তথ্য সফলভাবে জমা হয়েছে। আমাদের টিম পর্যালোচনা শেষে দ্রুত এটি তালিকায় যুক্ত করবে।
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => router.push("/")} className="h-14 rounded-2xl bg-primary text-white font-black active-scale gap-2">
                <Home className="w-5 h-5" /> হোম পেজে যান
              </Button>
              <Button onClick={() => router.push("/madrasas")} variant="outline" className="h-14 rounded-2xl border-border/60 font-black active-scale gap-2">
                <List className="w-5 h-5" /> তালিকা দেখুন
              </Button>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/10 flex flex-col selection:bg-primary/10">
      <Navbar />

      <main className="flex-1">
        {/* App Style Header */}
        <section className="relative pt-32 pb-16 lg:pt-44 lg:pb-24 overflow-hidden bg-primary text-white text-center">
          <div className="absolute inset-0 islamic-pattern opacity-10" />
          <div className="container mx-auto px-5 relative z-10">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-[11px] font-black uppercase tracking-widest">রেজিস্ট্রেশন পোর্টাল</span>
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-black mb-4">মাদ্রাসা নিবন্ধন</h1>
            <p className="text-white/70 font-medium max-w-xl mx-auto">সঠিক তথ্য দিয়ে আপনার মাদ্রাসাকে আধুনিক ডিজিটাল ডিরেক্টরিতে যুক্ত করুন।</p>
          </div>
        </section>

        <section className="container mx-auto px-5 -mt-10 mb-20 relative z-20">
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-6">
            
            {serverError && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-5 bg-destructive/10 text-destructive rounded-[1.5rem] border border-destructive/20 text-center font-black text-sm">
                {serverError}
              </motion.div>
            )}

            {/* Step 1: Basic Info */}
            <div className="bg-card p-6 sm:p-10 rounded-[2.5rem] border border-border/40 shadow-soft">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                    <Building2 className="w-6 h-6" strokeWidth={2.5} />
                 </div>
                 <h3 className="text-xl font-black text-foreground">প্রাথমিক তথ্য</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">মাদ্রাসার নাম</label>
                  <Input {...register("name")} placeholder="মাদ্রাসার পূর্ণ নাম লিখুন" className="h-14 rounded-2xl bg-secondary/30 border-none font-bold placeholder:text-muted-foreground/40" />
                  {errors.name && <p className="text-destructive text-[10px] font-bold ml-2 uppercase">{errors.name.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">ক্যাটাগরি</label>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="h-14 rounded-2xl bg-secondary/30 border-none font-bold">
                          <SelectValue placeholder="নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && <p className="text-destructive text-[10px] font-bold ml-2 uppercase">{errors.category.message}</p>}
                </div>
              </div>

              <div className="space-y-2 mt-6">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">শিক্ষা বোর্ড</label>
                <Controller
                  control={control}
                  name="board"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-14 rounded-2xl bg-secondary/30 border-none font-bold">
                        <SelectValue placeholder="বোর্ড নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        {boards.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.board && <p className="text-destructive text-[10px] font-bold ml-2 uppercase">{errors.board.message}</p>}
              </div>
            </div>

            {/* Step 2: Location */}
            <div className="bg-card p-6 sm:p-10 rounded-[2.5rem] border border-border/40 shadow-soft">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-accent/5 flex items-center justify-center text-accent">
                    <MapPin className="w-6 h-6" strokeWidth={2.5} />
                 </div>
                 <h3 className="text-xl font-black text-foreground">অবস্থান ও ঠিকানা</h3>
              </div>
              
              <LocationSelector
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                divisionId={control._defaultValues.divisionId}
                onDivisionChange={(id) => setValue("divisionId", id)}
                districtId={control._defaultValues.districtId}
                onDistrictChange={(id) => setValue("districtId", id)}
                thanaId={control._defaultValues.thanaId}
                onThanaChange={(id) => setValue("thanaId", id)}
              />

              <div className="space-y-2 mt-6">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">বিস্তারিত ঠিকানা</label>
                <Textarea {...register("address")} placeholder="গ্রাম/মহল্লা, ইউনিয়ন, ডাকঘর" className="rounded-2xl bg-secondary/30 border-none font-bold placeholder:text-muted-foreground/40 resize-none py-4" />
                {errors.address && <p className="text-destructive text-[10px] font-bold ml-2 uppercase">{errors.address.message}</p>}
              </div>
            </div>

            {/* Step 3: Contact */}
            <div className="bg-card p-6 sm:p-10 rounded-[2.5rem] border border-border/40 shadow-soft">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                    <Phone className="w-6 h-6" strokeWidth={2.5} />
                 </div>
                 <h3 className="text-xl font-black text-foreground">যোগাযোগের তথ্য</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">মোবাইল নম্বর</label>
                  <Input {...register("phone")} placeholder="০১৭XXXXXXXX" className="h-14 rounded-2xl bg-secondary/30 border-none font-bold placeholder:text-muted-foreground/40" />
                  {errors.phone && <p className="text-destructive text-[10px] font-bold ml-2 uppercase">{errors.phone.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">ইমেইল ঠিকানা</label>
                  <Input type="email" {...register("email")} placeholder="example@mail.com" className="h-14 rounded-2xl bg-secondary/30 border-none font-bold placeholder:text-muted-foreground/40" />
                  {errors.email && <p className="text-destructive text-[10px] font-bold ml-2 uppercase">{errors.email.message}</p>}
                </div>
              </div>
            </div>

            {/* Step 4: Description */}
            <div className="bg-card p-6 sm:p-10 rounded-[2.5rem] border border-border/40 shadow-soft">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-accent/5 flex items-center justify-center text-accent">
                    <Info className="w-6 h-6" strokeWidth={2.5} />
                 </div>
                 <h3 className="text-xl font-black text-foreground">মাদ্রাসার বিবরণ</h3>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">সংক্ষিপ্ত পরিচিতি</label>
                <Textarea {...register("description")} placeholder="মাদ্রাসা সম্পর্কে কিছু লিখুন..." className="rounded-2xl bg-secondary/30 border-none font-bold placeholder:text-muted-foreground/40 h-32 py-4 resize-none" />
                {errors.description && <p className="text-destructive text-[10px] font-bold ml-2 uppercase">{errors.description.message}</p>}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-16 rounded-[2rem] bg-primary text-primary-foreground font-black text-xl shadow-xl shadow-primary/20 active-scale gap-3 transition-all hover:gap-5"
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
              {isSubmitting ? "জমা হচ্ছে..." : "নিবন্ধন জমা দিন"}
            </Button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
