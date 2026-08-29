"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
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

// We'll use the backend schema for validation, but for MVP we don't need all fields on UI
type FormValues = z.infer<typeof createMadrasaSchema>;

const boards = [
  "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ (বেফাক)",
  "বেফাকুল মাদারিসিল কওমিয়া গওহরডাঙ্গা বাংলাদেশ",
  "আঞ্জুমানে ইত্তেহাদুল মাদারিস বাংলাদেশ",
  "আযাদ দ্বীনী এদারায়ে তালীম বাংলাদেশ",
  "তানজিমুল মাদারিসিদ দ্বীনিয়া বাংলাদেশ",
  "বেফাকুল মাদারিসিল দ্বীনিয়া বাংলাদেশ (জাতীয় দ্বীনি মাদ্রাসা শিক্ষা বোর্ড)",
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
    setValue,
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
      if (!res.ok) {
        throw new Error(result.error || "নিবন্ধন করতে সমস্যা হয়েছে।");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setServerError(err.message);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md bg-card p-8 rounded-lg border shadow-sm">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">নিবন্ধন সফল হয়েছে!</h2>
            <p className="text-muted-foreground mb-6">
              আপনার মাদ্রাসার তথ্য সফলভাবে জমা হয়েছে। আমাদের টিম পর্যালোচনা শেষে তালিকায় যুক্ত করবে।
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => router.push("/")} className="px-5 py-2.5 border rounded-lg text-sm font-medium transition-colors hover:bg-muted">
                হোম পেজে যান
              </button>
              <button onClick={() => router.push("/madrasas")} className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium transition-colors hover:bg-primary">
                তালিকা দেখুন
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <PageHero
        title="মাদ্রাসা নিবন্ধন"
        subtitle="আপনার মাদ্রাসার তথ্য দিন, আমরা তালিকায় যুক্ত করবো"
        breadcrumbs={[
          { label: "হোম", href: "/" },
          { label: "মাদ্রাসা নিবন্ধন" }
        ]}
      />

      <section className="py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-card p-6 md:p-8 rounded-lg border shadow-sm">
            
            {serverError && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
                {serverError}
              </div>
            )}

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">প্রাথমিক তথ্য</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">মাদ্রাসার নাম <span className="text-red-500">*</span></label>
                  <Input {...register("name")} placeholder="মাদ্রাসার পূর্ণ নাম" className="rounded-lg" />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">ক্যাটাগরি <span className="text-red-500">*</span></label>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">বোর্ড <span className="text-red-500">*</span></label>
                <Controller
                  control={control}
                  name="board"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="বোর্ড নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        {boards.map((b) => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.board && <p className="text-red-500 text-xs">{errors.board.message}</p>}
              </div>
            </div>

            {/* Location Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">অবস্থান</h3>
              
              <Controller
                control={control}
                name="divisionId"
                render={({ field: divField }) => (
                  <Controller
                    control={control}
                    name="districtId"
                    render={({ field: distField }) => (
                      <Controller
                        control={control}
                        name="thanaId"
                        render={({ field: thanaField }) => (
                          <LocationSelector
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                            divisionId={divField.value}
                            onDivisionChange={(id) => divField.onChange(id)}
                            districtId={distField.value}
                            onDistrictChange={(id) => distField.onChange(id)}
                            thanaId={thanaField.value}
                            onThanaChange={(id) => thanaField.onChange(id)}
                          />
                        )}
                      />
                    )}
                  />
                )}
              />
              <div className="flex gap-4">
                {errors.divisionId && <p className="text-red-500 text-xs flex-1">{errors.divisionId.message}</p>}
                {errors.districtId && <p className="text-red-500 text-xs flex-1">{errors.districtId.message}</p>}
                {errors.thanaId && <p className="text-red-500 text-xs flex-1">{errors.thanaId.message}</p>}
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium">বিস্তারিত ঠিকানা <span className="text-red-500">*</span></label>
                <Textarea {...register("address")} placeholder="গ্রাম/মহল্লা, ইউনিয়ন, ডাকঘর" className="rounded-lg" />
                {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">যোগাযোগ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">মোবাইল নম্বর <span className="text-red-500">*</span></label>
                  <Input {...register("phone")} placeholder="০১৭XXXXXXXX" className="rounded-lg" />
                  {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">ইমেইল <span className="text-red-500">*</span></label>
                  <Input type="email" {...register("email")} placeholder="example@gmail.com" className="rounded-lg" />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">ওয়েবসাইট (যদি থাকে)</label>
                <Input {...register("website")} placeholder="https://..." className="rounded-lg" />
                {errors.website && <p className="text-red-500 text-xs">{errors.website.message}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">বিবরণ</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">মাদ্রাসার সংক্ষিপ্ত বিবরণ <span className="text-red-500">*</span></label>
                <Textarea {...register("description")} placeholder="মাদ্রাসা সম্পর্কে কিছু লিখুন..." className="rounded-lg h-24" />
                {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-primary text-white font-semibold rounded-lg shadow-lg transition-all hover:bg-primary hover:shadow-xl flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  জমা হচ্ছে...
                </>
              ) : (
                "নিবন্ধন জমা দিন"
              )}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
