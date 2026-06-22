import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface StudentsTabProps {
  formData: any;
  update: (field: string, value: any) => void;
}

export const StudentsTab = ({ formData, update }: StudentsTabProps) => {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <h3 className="text-base font-bold text-foreground">শিক্ষার্থী ও শিক্ষক তথ্য</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">মোট শিক্ষার্থী</label>
          <Input
            type="number"
            value={formData.studentCount}
            onChange={(e) => update("studentCount", e.target.value)}
            placeholder="যেমন: ৫০০"
            className="h-11 rounded-xl bg-background/60 border-border/50"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">মোট শিক্ষক</label>
          <Input
            type="number"
            value={formData.teacherCount}
            onChange={(e) => update("teacherCount", e.target.value)}
            placeholder="যেমন: ৩০"
            className="h-11 rounded-xl bg-background/60 border-border/50"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">প্রাক্তন ছাত্র</label>
          <Input
            type="number"
            value={formData.alumniCount}
            onChange={(e) => update("alumniCount", e.target.value)}
            placeholder="যেমন: ২০০০"
            className="h-11 rounded-xl bg-background/60 border-border/50"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">উল্লেখযোগ্য প্রাক্তন ছাত্র</label>
        <Textarea
          value={formData.notableAlumni}
          onChange={(e) => update("notableAlumni", e.target.value)}
          placeholder="উল্লেখযোগ্য প্রাক্তন ছাত্রদের নাম ও পরিচয়..."
          className="min-h-[80px] rounded-xl bg-background/60 border-border/50 text-sm resize-none"
        />
      </div>
    </div>
  );
};
