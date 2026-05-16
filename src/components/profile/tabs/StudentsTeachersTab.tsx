import { motion } from "framer-motion";
import { Users, GraduationCap, Award } from "lucide-react";
import { Madrasa } from "@/data/madrasas";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

interface StudentsTeachersTabProps {
  madrasa: Madrasa & {
    alumniCount?: string | null;
    notableAlumni?: string | null;
  };
}

const StudentsTeachersTab = ({ madrasa }: StudentsTeachersTabProps) => {
  const alumniCount = madrasa.alumniCount ? parseInt(madrasa.alumniCount) : 0;
  const notableAlumni = madrasa.notableAlumni;

  const highlights = [
    {
      icon: Users,
      label: "মোট শিক্ষার্থী",
      value: `${madrasa.students} জন`,
      color: "bg-primary/10 text-primary",
    },
    {
      icon: GraduationCap,
      label: "মোট শিক্ষক",
      value: `${madrasa.teachers} জন`,
      color: "bg-accent/10 text-accent",
    },
    {
      icon: Award,
      label: alumniCount > 0 ? "প্রাক্তন শিক্ষার্থী" : "শিক্ষক-শিক্ষার্থী অনুপাত",
      value: alumniCount > 0 ? `${alumniCount} জন` : `১:${Math.round(madrasa.students / madrasa.teachers)}`,
      color: "bg-secondary text-foreground",
    },
  ];

  const defaultAlumniItems = [
    "বিভিন্ন জেলায় প্রতিষ্ঠিত আলেমগণ",
    "একাধিক মাদ্রাসার প্রতিষ্ঠাতা মুহতামিম",
    "দেশ-বিদেশে দ্বীনি খেদমতে নিয়োজিত",
  ];

  return (
    <div className="space-y-5 md:space-y-6">
      <motion.div {...fadeUp(0.05)} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {highlights.map((item) => (
          <div key={item.label} className="float-card bg-card rounded-2xl border border-border/60 p-5 text-center">
            <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-3`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
            <div className="text-lg font-bold text-foreground">{item.value}</div>
          </div>
        ))}
      </motion.div>

      <motion.div {...fadeUp(0.1)} className="float-card bg-card rounded-2xl border border-border/60 p-5 md:p-6">
        <h3 className="text-lg font-bold text-foreground mb-3">উল্লেখযোগ্য প্রাক্তন শিক্ষার্থী</h3>
        {notableAlumni ? (
          <p className="text-sm text-muted-foreground leading-relaxed">{notableAlumni}</p>
        ) : (
          <div className="space-y-3">
            {defaultAlumniItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
                <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StudentsTeachersTab;
