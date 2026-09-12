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
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-foreground flex items-center gap-3 px-2">
        <div className="w-1.5 h-5 bg-primary rounded-full" />
        আসাতীজায়ে কেরাম
      </h3>

      {madrasa.teacherList && madrasa.teacherList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {madrasa.teacherList.map((teacher, i) => (
            <div key={i} className="flex items-center gap-5 p-5 rounded-2xl bg-white dark:bg-card/60 border border-slate-100 dark:border-white/10 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-bold text-2xl shrink-0 group-hover:bg-primary/10 group-hover:scale-110 transition-all shadow-sm">
                {teacher.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-foreground truncate">{teacher.name}</p>
                <p className="text-sm font-medium text-muted-foreground mt-1">{teacher.designation}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default StudentsTeachersTab;

