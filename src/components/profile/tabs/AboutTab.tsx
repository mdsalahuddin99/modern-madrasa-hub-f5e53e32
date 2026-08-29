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
        <h2 className="text-2xl font-black text-foreground mb-4 flex items-center gap-3">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          {pc.sectionLabels.intro}
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed font-medium opacity-90">
          {madrasa.description}
        </p>
      </div>

      {/* History Card */}
      {madrasa.history && (
        <div className="bg-secondary/30 p-8 rounded-[2.5rem] border border-border/40 relative overflow-hidden group active-scale">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem]" />
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-foreground">মাদ্রাসার ইতিহাস</h2>
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
            <div className="bg-card p-8 rounded-[2.5rem] border border-border/40 shadow-soft group active-scale">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 text-accent group-hover:rotate-12 transition-transform">
                <Target className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-black text-foreground mb-3">আমাদের লক্ষ্য</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                {madrasa.mission}
              </p>
            </div>
          )}
          {madrasa.vision && (
            <div className="bg-card p-8 rounded-[2.5rem] border border-border/40 shadow-soft group active-scale">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:-rotate-12 transition-transform">
                <Eye className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-black text-foreground mb-3">আমাদের দৃষ্টিভঙ্গি</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                {madrasa.vision}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Principal's Message - Royal Style */}
      <div className="bg-primary p-8 sm:p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-primary/20 group active-scale">
        <div className="absolute inset-0 islamic-pattern opacity-10" />
        <MessageSquareQuote className="absolute top-6 right-8 w-16 h-16 text-white/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />

        <h2 className="text-xl font-black mb-8 flex items-center gap-3 relative z-10">
           <div className="w-1.5 h-5 bg-accent rounded-full" />
           {pc.principalMessageTitle}
        </h2>

        <div className="relative pl-6 border-l-2 border-accent/40 z-10 mb-8">
          <p className="text-lg font-bold leading-relaxed italic text-white/90">
            &ldquo;{madrasa.principalMessage || pc.principalMessage}&rdquo;
          </p>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md">
            <GraduationCap className="w-7 h-7 text-accent" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-base font-black text-white">{madrasa.principalName || pc.principalName}</div>
            <div className="text-xs font-bold text-accent uppercase tracking-widest mt-0.5">{madrasa.principalRole || pc.principalRole}</div>
          </div>
        </div>
      </div>

      {/* Courses & Departments Section */}
      <div className="grid grid-cols-1 gap-8">
        {/* Departments */}
        <div className="space-y-6">
           <h3 className="text-xl font-black text-foreground flex items-center gap-3">
              <div className="w-1.5 h-6 bg-accent rounded-full" />
              {pc.departmentsTitle}
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(Array.isArray(madrasa.departments) && madrasa.departments.length > 0
                ? madrasa.departments
                : pc.departments
              ).map((dept: any, i: number) => (
                <div key={i} className="p-5 rounded-2xl bg-white border border-border/40 shadow-soft hover:border-primary/20 transition-all group active-scale">
                   <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                         <Layers className="w-5 h-5" />
                      </div>
                      <Badge className="bg-primary/5 text-primary border-none font-black text-[9px] uppercase tracking-tighter">
                         {toBn(dept.students)} শিক্ষার্থী
                      </Badge>
                   </div>
                   <h4 className="text-base font-black text-foreground mb-1">{dept.name}</h4>
                   <p className="text-xs text-muted-foreground font-medium leading-relaxed">{dept.desc}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Courses List */}
        <div className="space-y-6">
           <h3 className="text-xl font-black text-foreground flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary rounded-full" />
              {pc.sectionLabels.courses}
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {madrasa.courses.map((course, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/20 border border-border/40 active-scale group hover:bg-white transition-all">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-4.5 h-4.5" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-bold text-foreground">{course}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Final Feature Widget */}
      <div className="p-8 rounded-[2.5rem] bg-accent/5 border border-accent/20 flex flex-col sm:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20">
               <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-center sm:text-left">
               <h4 className="text-lg font-black text-foreground">মাদ্রাসার সুবিধাসমূহ</h4>
               <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-0.5">এক নজরে সকল সুবিধা</p>
            </div>
         </div>
         <div className="flex flex-wrap justify-center gap-2">
            {madrasa.facilities.slice(0, 3).map((f, i) => (
               <span key={i} className="px-4 py-2 rounded-xl bg-white border border-border/60 text-[10px] font-black uppercase tracking-tighter text-primary shadow-sm">
                  {f}
               </span>
            ))}
         </div>
      </div>
    </div>
  );
};

export default AboutTab;
