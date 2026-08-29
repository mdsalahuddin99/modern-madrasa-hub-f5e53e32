"use client";

import { motion } from "framer-motion";
import { Users, GraduationCap, School, BookOpen, Star, Sparkles } from "lucide-react";
import { Madrasa } from "@/data/madrasas";
import { cn, toBn } from "@/lib/utils";

interface StudentsTeachersTabProps {
  madrasa: Madrasa & {
    teacherList?: { name: string; designation: string; image?: string }[];
  };
}

const StudentsTeachersTab = ({ madrasa }: StudentsTeachersTabProps) => {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-1.5 h-6 bg-primary rounded-full" />
        <h3 className="text-xl font-black text-foreground">শিক্ষক ও শিক্ষার্থী</h3>
      </div>

      {/* Main Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card p-8 rounded-[2.5rem] border border-border/40 shadow-soft relative overflow-hidden group active-scale"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem]" />
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary shadow-sm group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">মোট শিক্ষার্থী</p>
            <h4 className="text-4xl font-black text-foreground tabular-nums">
              {toBn(madrasa.students)}<span className="text-primary text-2xl ml-1">+</span>
            </h4>
            <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-tighter">
              <Sparkles className="w-3 h-3" /> তালিবে ইলম
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card p-8 rounded-[2.5rem] border border-border/40 shadow-soft relative overflow-hidden group active-scale"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-[4rem]" />
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 text-accent shadow-sm group-hover:scale-110 transition-transform">
              <GraduationCap className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">মোট উস্তাদগণ</p>
            <h4 className="text-4xl font-black text-foreground tabular-nums">
              {toBn(madrasa.teachers)}<span className="text-accent text-2xl ml-1">+</span>
            </h4>
            <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold text-accent bg-accent/5 px-3 py-1 rounded-full uppercase tracking-tighter">
              <Star className="w-3 h-3 fill-accent" /> আসাতীজায়ে কেরাম
            </div>
          </div>
        </motion.div>
      </div>

      {/* Ratios & Highlights Section */}
      <div className="bg-secondary/30 p-8 rounded-[2.5rem] border border-border/40">
         <div className="flex flex-col md:flex-row items-center justify-around gap-8">
            <div className="text-center group">
               <div className="w-16 h-16 rounded-[2rem] bg-white flex items-center justify-center mx-auto mb-4 shadow-soft group-hover:scale-110 transition-transform">
                  <School className="w-8 h-8 text-primary" />
               </div>
               <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">প্রতি শিক্ষক ছাত্র</p>
               <h5 className="text-xl font-black text-primary tabular-nums">
                  ১ : {toBn(Math.round(madrasa.students / (madrasa.teachers || 1)))}
               </h5>
            </div>

            <div className="hidden md:block w-px h-16 bg-border/60" />

            <div className="text-center group">
               <div className="w-16 h-16 rounded-[2rem] bg-white flex items-center justify-center mx-auto mb-4 shadow-soft group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-accent" />
               </div>
               <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">শিক্ষার পরিবেশ</p>
               <h5 className="text-xl font-black text-accent">আধুনিক ও আদর্শ</h5>
            </div>
         </div>
      </div>

      {/* Teachers List Preview (Native App Style) */}
      <div className="space-y-6">
         <h3 className="text-lg font-black text-foreground flex items-center gap-3 px-2 uppercase tracking-widest">
            <div className="w-1.5 h-5 bg-primary rounded-full" />
            আসাতীজায়ে কেরাম
         </h3>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Display static placeholders if no actual list exists */}
            {[1, 2].map((i) => (
               <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/40 active-scale group hover:border-primary/20 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                     ম
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-sm font-black text-foreground truncate">মাওলানা মুহাম্মদ আব্দুর রহিম</p>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">সিনিয়র উস্তাদ ও মুহাদ্দিস</p>
                  </div>
               </div>
            ))}
         </div>

         <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/10 text-center">
            <p className="text-xs font-bold text-primary mb-4">সকল শিক্ষক ও কর্মচারীদের বিস্তারিত তথ্য শীঘ্রই আসছে</p>
            <div className="h-1.5 w-32 bg-primary/10 rounded-full mx-auto overflow-hidden">
               <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="h-full w-1/2 bg-primary"
               />
            </div>
         </div>
      </div>
    </div>
  );
};

export default StudentsTeachersTab;
