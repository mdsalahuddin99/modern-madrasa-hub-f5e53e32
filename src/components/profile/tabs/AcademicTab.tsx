"use client";

import { motion } from "framer-motion";
import { Layers, CheckCircle2, BookOpen, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Madrasa } from "@/data/madrasas";
import { ProfileContent } from "@/data/siteContent";
import { cn, toBn } from "@/lib/utils";

interface AcademicTabProps {
  madrasa: Madrasa & {
    departments?: any[];
  };
  pc: ProfileContent;
}

const AcademicTab = ({ madrasa, pc }: AcademicTabProps) => {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-1.5 h-6 bg-primary rounded-full" />
        <h3 className="text-xl font-bold text-foreground">শিক্ষা কার্যক্রম</h3>
      </div>

      {/* Departments */}
      <div className="space-y-6">
         <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
            <div className="w-1.5 h-6 bg-accent rounded-full" />
            {pc.departmentsTitle}
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(Array.isArray(madrasa.departments) && madrasa.departments.length > 0
              ? madrasa.departments
              : pc.departments
            ).map((dept: any, i: number) => (
              <div key={i} className="p-6 rounded-2xl bg-white dark:bg-card/60 border border-slate-100 dark:border-white/10 shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-500 group">
                 <div className="flex justify-between items-start mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-500 shadow-sm">
                       <Layers className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <Badge className="bg-primary/5 text-primary border-none font-semibold text-xs">
                       {toBn(dept.students)} শিক্ষার্থী
                    </Badge>
                 </div>
                 <h4 className="text-base font-bold text-foreground mb-1">{dept.name}</h4>
                 <p className="text-sm text-muted-foreground font-medium leading-relaxed">{dept.desc}</p>
              </div>
            ))}
         </div>
      </div>

      {/* Courses List */}
      <div className="space-y-6">
         <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            {pc.sectionLabels.courses}
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {madrasa.courses.map((course, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-card/60 border border-slate-100 dark:border-white/10 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                  <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
                </div>
                <span className="text-sm font-medium text-foreground">{course}</span>
              </div>
            ))}
         </div>
      </div>

    </div>
  );
};

export default AcademicTab;
