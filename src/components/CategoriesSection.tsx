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
    <section id="categories" className="py-2 lg:py-8 bg-[#FAFAFA] relative overflow-hidden">
      
      {/* Decorative blurry background orbs */}
      <div className="absolute top-1/4 left-10 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10 lg:mb-8 lg:mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white text-primary rounded-full text-xs font-bold mb-6 shadow-sm border border-black/5">
            <Search className="w-3.5 h-3.5 mr-2" /> ক্যাটাগরি ডিরেক্টরি
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight mb-4">
            পছন্দের ক্যাটাগরি <span className="text-primary font-light">নির্বাচন করুন</span>
          </h2>
          <p className="text-muted-foreground text-sm lg:text-base font-medium max-w-2xl mx-auto">
            আপনার কাঙ্ক্ষিত মাদ্রাসার ধরন অনুযায়ী সহজে ব্রাউজ করুন এবং সেরা শিক্ষা প্রতিষ্ঠানগুলো খুঁজে নিন।
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {categoriesData.map((cat, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              onClick={() => router.push("/madrasas")}
              className="group p-6 md:p-8 bg-white rounded-3xl shadow-lg shadow-black/5 border border-black/5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                  <cat.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                </div>
                
                {/* Arrow indicator */}
                <div className="w-10 h-10 rounded-full bg-[#FAFAFA] border border-black/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                   <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{cat.name}</h3>
                <p className="text-sm font-medium text-muted-foreground">{toBn(cat.count)}টি মাদ্রাসা নিবন্ধিত</p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-10 lg:mt-16 text-center">
          <button
            onClick={() => router.push("/madrasas")}
            className="inline-flex items-center px-8 py-3.5 bg-white text-foreground border border-black/5 rounded-full font-bold text-sm hover:bg-primary hover:text-white hover:border-primary transition-all shadow-md shadow-black/5 gap-3 group"
          >
            সবগুলো ক্যাটাগরি ব্রাউজ করুন 
            <div className="w-7 h-7 rounded-full bg-primary/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

      </div>
    </section>
  );
};

export default CategoriesSection;
