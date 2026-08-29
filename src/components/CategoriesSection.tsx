"use client";

import { motion } from "framer-motion";
import {
  BookOpen, School, BookMarked, Sparkles,
  Users, GraduationCap, Award, ArrowRight, Search
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toBn } from "@/lib/utils";

const categoriesData = [
  { name: "কওমি মাদ্রাসা", icon: BookOpen, count: 320 },
  { name: "হিফজখানা", icon: BookMarked, count: 150 },
  { name: "নূরানী মাদ্রাসা", icon: GraduationCap, count: 85 },
  { name: "মহিলা মাদ্রাসা", icon: Users, count: 120 },
  { name: "আলিয়া মাদ্রাসা", icon: School, count: 45 },
  { name: "স্নাতক/মাস্টার্স", icon: Award, count: 30 },
];

const CategoriesSection = () => {
  const router = useRouter();

  return (
    <section id="categories" className="relative w-full bg-[#F8F8F8] overflow-hidden border-t-2 border-foreground">
      {/* Continuing the organic shapes for a seamless flow */}
      <div className="absolute -top-[15%] -left-[10%] w-[45%] aspect-square shape-navy opacity-100 z-0 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[35%] aspect-square shape-red opacity-100 z-0 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-8 lg:px-12 grid lg:grid-cols-12 gap-0 border-x-2 border-foreground">

        {/* Left Side: Section Label (Editorial Style) */}
        <div className="lg:col-span-4 border-r-2 border-foreground py-20 pr-10 flex flex-col justify-start">
           <div className="inline-block px-3 py-1 bg-[#E32B3C] text-white font-black text-[10px] uppercase tracking-[0.3em] self-start mb-10">
              Directory Grid
           </div>
           <h2 className="text-5xl lg:text-7xl font-black text-foreground leading-[0.85] tracking-tighter uppercase mb-8">
              Explore <br />
              <span className="text-[#E32B3C]">Services</span>
           </h2>
           <p className="text-foreground text-xs font-black uppercase tracking-widest leading-none opacity-60">
              Find and compare top rated institutions by category.
           </p>

           {/* Summary Mini-Card */}
           <div className="mt-20 p-6 bg-white border-2 border-foreground shadow-sharp max-w-[200px]">
              <p className="text-3xl font-black tabular-nums tracking-tighter leading-none mb-1">২৬+</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Active Boards</p>
           </div>
        </div>

        {/* Right Side: Tightly Packed Category Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-0">
          {categoriesData.map((cat, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              onClick={() => router.push("/madrasas")}
              className="group relative p-12 border-b-2 border-r-0 md:border-r-2 last:md:border-r-0 border-foreground text-left bg-transparent hover:bg-white active:bg-secondary/10 transition-all duration-300"
            >
              <div className="relative z-10">
                <div className="w-14 h-14 bg-foreground flex items-center justify-center mb-8 group-hover:bg-[#E32B3C] transition-colors">
                  <cat.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase mb-2">
                  {cat.name}
                </h3>

                <div className="flex items-center justify-between mt-10">
                  <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest tabular-nums">
                    {toBn(cat.count)} Registered
                  </span>
                  <div className="w-10 h-10 border-2 border-foreground flex items-center justify-center group-hover:bg-[#E32B3C] group-hover:text-white transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}

          {/* Large View All Button Grid Item */}
          <button
            onClick={() => router.push("/madrasas")}
            className="lg:col-span-1 p-12 border-b-2 border-foreground flex flex-col items-center justify-center bg-[#01235D] text-white active:translate-x-0.5 active:translate-y-0.5 transition-all group"
          >
             <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center mb-6">
                <Search className="w-6 h-6" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em]">Browse All List</span>
          </button>
        </div>

      </div>
    </section>
  );
};

export default CategoriesSection;
