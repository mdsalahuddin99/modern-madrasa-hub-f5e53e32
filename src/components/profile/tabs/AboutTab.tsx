import { motion } from "framer-motion";
import { MessageSquareQuote, GraduationCap, Layers, CheckCircle2, BookOpen, Target, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Madrasa } from "@/data/madrasas";
import { ProfileContent } from "@/data/siteContent";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

interface AboutTabProps {
  madrasa: Madrasa & {
    history?: string | null;
    mission?: string | null;
    vision?: string | null;
  };
  pc: ProfileContent;
}

const AboutTab = ({ madrasa, pc }: AboutTabProps) => {
  const history = madrasa.history;
  const mission = madrasa.mission;
  const vision = madrasa.vision;

  return (
    <div className="space-y-5 md:space-y-6">
      {/* Description */}
      <motion.div {...fadeUp(0.05)} className="float-card bg-card rounded-2xl border border-border/60 p-5 md:p-6">
        <h2 className="text-lg md:text-xl font-bold text-foreground mb-3">{pc.sectionLabels.intro}</h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{madrasa.description}</p>
      </motion.div>

      {/* History */}
      {history && (
        <motion.div {...fadeUp(0.07)} className="float-card bg-card rounded-2xl border border-border/60 p-5 md:p-6">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-4.5 h-4.5 text-primary" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-foreground">ইতিহাস</h2>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{history}</p>
        </motion.div>
      )}

      {/* Mission & Vision */}
      {(mission || vision) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mission && (
            <motion.div {...fadeUp(0.08)} className="float-card bg-card rounded-2xl border border-border/60 p-5 md:p-6">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Target className="w-4.5 h-4.5 text-accent" />
                </div>
                <h2 className="text-base md:text-lg font-bold text-foreground">আমাদের লক্ষ্য</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{mission}</p>
            </motion.div>
          )}
          {vision && (
            <motion.div {...fadeUp(0.09)} className="float-card bg-card rounded-2xl border border-border/60 p-5 md:p-6">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Eye className="w-4.5 h-4.5 text-primary" />
                </div>
                <h2 className="text-base md:text-lg font-bold text-foreground">আমাদের দৃষ্টিভঙ্গি</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{vision}</p>
            </motion.div>
          )}
        </div>
      )}

      {/* Principal's Message */}
      <motion.div {...fadeUp(0.1)} className="float-card bg-card rounded-2xl border border-border/60 p-5 md:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[60px]" />
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <MessageSquareQuote className="w-4.5 h-4.5 text-primary" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-foreground">{pc.principalMessageTitle}</h2>
        </div>
        <div className="relative pl-4 border-l-2 border-primary/20">
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed italic">
            {madrasa.principalMessage || pc.principalMessage}
          </p>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">{madrasa.principalName || pc.principalName}</div>
            <div className="text-xs text-muted-foreground">{madrasa.principalRole || pc.principalRole}</div>
          </div>
        </div>
      </motion.div>

      {/* Departments */}
      <motion.div {...fadeUp(0.15)} className="float-card bg-card rounded-2xl border border-border/60 p-5 md:p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Layers className="w-4.5 h-4.5 text-primary" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-foreground">{pc.departmentsTitle}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Array.isArray(madrasa.departments) && madrasa.departments.length > 0 
            ? madrasa.departments 
            : pc.departments
          ).map((dept: any) => (
            <div key={dept.name} className="p-4 rounded-xl bg-muted/30 border border-border/40 hover:border-primary/20 transition-colors">
              <h3 className="text-sm font-bold text-foreground mb-1">{dept.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">{dept.desc}</p>
              <Badge variant="secondary" className="text-[10px] px-2 py-0.5 rounded-lg bg-primary/8 text-primary border-0">
                {dept.students} শিক্ষার্থী
              </Badge>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Courses */}
      <motion.div {...fadeUp(0.2)} className="float-card bg-card rounded-2xl border border-border/60 p-5 md:p-6">
        <h2 className="text-lg md:text-xl font-bold text-foreground mb-3">{pc.sectionLabels.courses}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {madrasa.courses.map((course) => (
            <div key={course} className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-light/80 border border-primary/5">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm text-foreground font-medium">{course}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Facilities */}
      <motion.div {...fadeUp(0.25)} className="float-card bg-card rounded-2xl border border-border/60 p-5 md:p-6">
        <h2 className="text-lg md:text-xl font-bold text-foreground mb-3">{pc.sectionLabels.facilities}</h2>
        <div className="space-y-2">
          {madrasa.facilities.map((facility, idx) => (
            <div key={facility} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
              <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">
                {idx + 1}
              </span>
              <span className="text-sm text-foreground font-medium">{facility}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AboutTab;
