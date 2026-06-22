// ===================================================
// Madrasa Registration Page — মাদ্রাসা নিবন্ধন
// ===================================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// NOTE: মাইগ্রেশন স্টেপ:
// ১. src/pages/MadrasaRegister.tsx থেকে ফর্ম লজিক কপি করুন
// ২. react-hook-form + zod ভ্যালিডেশন বজায় রাখুন
// ৩. useNavigate → useRouter বদলান
// ৪. ফর্ম সাবমিশনে /api/madrasas POST কল করুন (localStorage এর বদলে)

export default function MadrasaRegisterPage() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">নিবন্ধন সফল হয়েছে!</h2>
          <p className="text-muted-foreground mb-6">
            আপনার মাদ্রাসার তথ্য সফলভাবে জমা হয়েছে। আমাদের টিম পর্যালোচনা শেষে তালিকায় যুক্ত করবে।
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push("/")} className="px-5 py-2.5 border rounded-xl text-sm">
              হোম পেজে যান
            </button>
            <button onClick={() => router.push("/madrasas")} className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm">
              তালিকা দেখুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: /api/madrasas POST কল করুন ফর্ম ডেটা দিয়ে
    // const res = await fetch("/api/madrasas", { method: "POST", ... });
    
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="pt-24 pb-10 bg-gradient-to-b from-emerald-700 to-emerald-900">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">
            মাদ্রাসা নিবন্ধন
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            আপনার মাদ্রাসার তথ্য দিন, আমরা তালিকায় যুক্ত করবো
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 
              মাইগ্রেশন নোট:
              MadrasaRegister.tsx এর পুরো ফর্ম (Basic Info, Location, Contact, 
              Courses, Facilities, Muhtamim Info) এখানে কপি করুন।
              react-hook-form + zod schema বজায় রাখুন।
            */}
            <div className="bg-card rounded-2xl border p-6 text-center text-muted-foreground">
              <p>ফর্ম কম্পোনেন্ট মাইগ্রেশনের পর এখানে আসবে।</p>
              <p className="text-xs mt-2">src/pages/MadrasaRegister.tsx থেকে কপি করুন।</p>
            </div>

            <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl">
              নিবন্ধন জমা দিন
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
