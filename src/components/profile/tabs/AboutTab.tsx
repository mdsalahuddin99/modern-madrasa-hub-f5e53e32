import { motion } from "framer-motion";
import { MessageSquareQuote, GraduationCap, Layers, CheckCircle2, BookOpen, Target, Eye, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Madrasa } from "@/data/madrasas";
import { ProfileContent } from "@/data/siteContent";
import { cn, toBn } from "@/lib/utils";

interface AboutTabProps {
  madrasa: Madrasa & {
    history?: string | null;
    mission?: string | null;
    vision?: string | null;
    principalMessage?: string | null;
    principalName?: string | null;
    principalRole?: string | null;
    departments?: any[];
  };
  pc: ProfileContent;
}

const AboutTab = ({ madrasa, pc }: AboutTabProps) => {
  return (
    <div className="space-y-8">
      {/* Short Intro */}
      <div className="relative">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          {pc.sectionLabels.intro}
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed font-medium opacity-90">
          {madrasa.description}
        </p>
      </div>

      {/* History Card */}
      {madrasa.history && (
        <div className="bg-white dark:bg-card/60 p-8 rounded-2xl border border-slate-100 dark:border-white/10 shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:border-primary/20 transition-all duration-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-sm">
              <BookOpen className="w-6 h-6" strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold text-foreground">মাদ্রাসার ইতিহাস</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            {madrasa.history}
          </p>
        </div>
      )}

      {/* Mission & Vision Grid */}
      {(madrasa.mission || madrasa.vision) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {madrasa.mission && (
            <div className="bg-white dark:bg-card/60 p-8 rounded-2xl border border-slate-100 dark:border-white/10 shadow-lg group hover:shadow-2xl hover:-translate-y-1 hover:border-accent/30 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full pointer-events-none" />
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 text-accent group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-sm relative z-10">
                <Target className="w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">আমাদের লক্ষ্য</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                {madrasa.mission}
              </p>
            </div>
          )}
          {madrasa.vision && (
            <div className="bg-white dark:bg-card/60 p-8 rounded-2xl border border-slate-100 dark:border-white/10 shadow-lg group hover:shadow-2xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full pointer-events-none" />
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-sm relative z-10">
                <Eye className="w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">আমাদের দৃষ্টিভঙ্গি</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                {madrasa.vision}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Principal's Message - Elegant Style */}
      <div className="bg-gradient-to-br from-primary/5 via-white dark:via-card/50 to-transparent p-8 sm:p-10 rounded-3xl border border-primary/20 shadow-xl shadow-primary/5 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] pointer-events-none rounded-full" />
        <MessageSquareQuote className="absolute top-8 right-8 w-20 h-20 text-primary/10 group-hover:text-primary/20 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700" />

        <h2 className="text-xl font-bold mb-8 flex items-center gap-3 relative z-10 text-foreground">
           <div className="w-1.5 h-5 bg-accent rounded-full" />
           {pc.principalMessageTitle}
        </h2>

        <div className="relative pl-6 border-l-2 border-primary/40 z-10 mb-8">
          <p className="text-lg font-semibold leading-relaxed italic text-muted-foreground">
            &ldquo;{madrasa.principalMessage || pc.principalMessage}&rdquo;
          </p>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-primary" strokeWidth={2} />
          </div>
          <div>
            <div className="text-base font-bold text-foreground">{madrasa.principalName || pc.principalName}</div>
            <div className="text-sm font-medium text-muted-foreground mt-0.5">{madrasa.principalRole || pc.principalRole}</div>
          </div>
        </div>
      </div>

      {/* Courses & Departments Section */}
      <div className="grid grid-cols-1 gap-8">
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

      {/* Final Feature Widget */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-primary/5 via-white dark:via-card/60 to-accent/5 border border-primary/20 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
         <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 shadow-sm">
               <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-center sm:text-left">
               <h4 className="text-lg font-bold text-foreground">মাদ্রাসার সুবিধাসমূহ</h4>
               <p className="text-sm text-muted-foreground font-medium mt-0.5">এক নজরে সকল সুবিধা</p>
            </div>
         </div>
         <div className="flex flex-wrap justify-center gap-2">
            {madrasa.facilities.slice(0, 3).map((f, i) => (
               <span key={i} className="px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-primary/20 text-xs font-bold text-primary shadow-sm">
                  {f}
               </span>
            ))}
         </div>
      </div>
    </div>
  );
};

export default AboutTab;

