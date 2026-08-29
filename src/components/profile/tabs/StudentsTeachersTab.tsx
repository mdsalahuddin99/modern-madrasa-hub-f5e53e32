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
        <h3 className="text-xl font-bold text-foreground">শিক্ষক ও শিক্ষার্থী</h3>
      </div>

      {/* Main Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-card/60 p-8 rounded-3xl border border-slate-100 dark:border-white/10 shadow-lg relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 hover:border-primary/20 transition-all duration-500"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-sm">
              <Users className="w-7 h-7" strokeWidth={2} />
            </div>
            <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">মোট শিক্ষার্থী</p>
            <h4 className="text-4xl font-extrabold text-foreground tabular-nums mb-4 drop-shadow-sm">
              {toBn(madrasa.students)}<span className="text-primary text-2xl ml-1">+</span>
            </h4>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> তালিবে ইলম
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-card/60 p-8 rounded-3xl border border-slate-100 dark:border-white/10 shadow-lg relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 hover:border-accent/30 transition-all duration-500"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 text-accent group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-sm">
              <GraduationCap className="w-7 h-7" strokeWidth={2} />
            </div>
            <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">মোট উস্তাদগণ</p>
            <h4 className="text-4xl font-extrabold text-foreground tabular-nums mb-4 drop-shadow-sm">
              {toBn(madrasa.teachers)}<span className="text-accent text-2xl ml-1">+</span>
            </h4>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-accent" /> আসাতীজায়ে কেরাম
            </div>
          </div>
        </motion.div>
      </div>

      {/* Ratios & Highlights Section */}
      <div className="bg-gradient-to-r from-primary/5 via-white dark:via-card/60 to-accent/5 p-8 rounded-3xl border border-slate-100 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-500">
         <div className="flex flex-col md:flex-row items-center justify-around gap-8 relative z-10">
            <div className="text-center group">
               <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-primary/10 shadow-sm flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:-rotate-3 group-hover:border-primary/30 group-hover:shadow-md transition-all duration-300">
                  <School className="w-7 h-7 text-primary" strokeWidth={2.5} />
               </div>
               <p className="text-sm font-medium text-muted-foreground mb-1">প্রতি শিক্ষক ছাত্র</p>
               <h5 className="text-xl font-bold text-primary tabular-nums">
                  ১ : {toBn(Math.round(madrasa.students / (madrasa.teachers || 1)))}
               </h5>
            </div>

            <div className="hidden md:block w-px h-16 bg-border/40" />

            <div className="text-center group">
               <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-accent/10 shadow-sm flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:-rotate-3 group-hover:border-accent/30 group-hover:shadow-md transition-all duration-300">
                  <BookOpen className="w-7 h-7 text-accent" strokeWidth={2.5} />
               </div>
               <p className="text-sm font-medium text-muted-foreground mb-1">শিক্ষার পরিবেশ</p>
               <h5 className="text-xl font-bold text-accent">আধুনিক ও আদর্শ</h5>
            </div>
         </div>
      </div>

      {/* Teachers List Preview (Native App Style) */}
      <div className="space-y-6">
         <h3 className="text-lg font-bold text-foreground flex items-center gap-3 px-2">
            <div className="w-1.5 h-5 bg-primary rounded-full" />
            আসাতীজায়ে কেরাম
         </h3>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Display static placeholders if no actual list exists */}
            {[1, 2].map((i) => (
               <div key={i} className="flex items-center gap-5 p-5 rounded-2xl bg-white dark:bg-card/60 border border-slate-100 dark:border-white/10 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-bold text-2xl shrink-0 group-hover:bg-primary/10 group-hover:scale-110 transition-all shadow-sm">
                     ম
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-base font-bold text-foreground truncate">মাওলানা মুহাম্মদ আব্দুর রহিম</p>
                     <p className="text-sm font-medium text-muted-foreground mt-1">সিনিয়র উস্তাদ ও মুহাদ্দিস</p>
                  </div>
               </div>
            ))}
         </div>

         <div className="p-8 rounded-2xl bg-white/50 dark:bg-card/40 backdrop-blur-xl border border-slate-100 dark:border-white/10 text-center shadow-inner relative overflow-hidden">
            <p className="text-base font-bold text-muted-foreground mb-5">সকল শিক্ষক ও কর্মচারীদের বিস্তারিত তথ্য শীঘ্রই আসছে</p>
            <div className="h-1.5 w-32 bg-border/40 rounded-full mx-auto overflow-hidden">
               <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="h-full w-1/2 bg-primary/40"
               />
            </div>
         </div>
      </div>
    </div>
  );
};

export default StudentsTeachersTab;

