import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trophy, Plus, Trash2, Calendar, Medal } from "lucide-react";
import { MadrasaFormData } from "@/types/madrasa";
import { toast } from "sonner";

interface AchievementsTabProps {
  formData: any;
  update: (field: keyof MadrasaFormData, value: any) => void;
  readOnly?: boolean;
}

export const AchievementsTab = ({
  formData,
  update,
  readOnly = false,
}: AchievementsTabProps) => {
  const achievements = formData.achievements || [];

  const handleAddAchievement = () => {
    update("achievements", [
      ...achievements,
      { title: "", description: "", date: "", type: "AWARD" }
    ]);
  };

  const handleUpdateAchievement = (index: number, field: string, value: string) => {
    const updated = [...achievements];
    updated[index] = { ...updated[index], [field]: value };
    update("achievements", updated);
  };

  const handleRemoveAchievement = (index: number) => {
    const updated = achievements.filter((_: any, i: number) => i !== index);
    update("achievements", updated);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between bg-card rounded-lg border border-border/60 p-5">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            সাফল্য ও অর্জন
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            মাদ্রাসার বোর্ড পরীক্ষার রেজাল্ট, পুরস্কার এবং অন্যান্য সম্মাননা যুক্ত করুন।
          </p>
        </div>
        <Button 
          onClick={handleAddAchievement} 
          disabled={readOnly}
          className="gap-2 text-xs font-bold"
        >
          <Plus className="w-4 h-4" />
          নতুন অর্জন যোগ করুন
        </Button>
      </div>

      {achievements.length === 0 ? (
        <div className="bg-card rounded-lg border border-border/60 p-10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-primary/50" />
          </div>
          <h4 className="text-sm font-bold text-foreground">কোনো অর্জন যুক্ত করা হয়নি</h4>
          <p className="text-xs text-muted-foreground mt-1 mb-4 max-w-sm">
            বোর্ড পরীক্ষায় পজিশন, প্রতিযোগিতায় বিজয় বা অন্য কোনো বিশেষ অর্জন থাকলে তা যুক্ত করুন।
          </p>
          <Button onClick={handleAddAchievement} variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" /> যুক্ত করুন
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {achievements.map((item: any, index: number) => (
            <div key={index} className="bg-card rounded-lg border border-border/60 p-5 relative group">
              {!readOnly && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-4 right-4 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveAchievement(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-10">
                <div className="col-span-1 md:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">অর্জনের শিরোনাম *</label>
                  <Input
                    value={item.title}
                    onChange={(e) => handleUpdateAchievement(index, "title", e.target.value)}
                    disabled={readOnly}
                    placeholder="যেমন: বেফাক পরীক্ষায় জাতীয় মেধায় ১ম স্থান"
                    className="bg-background/60"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> সাল / তারিখ
                  </label>
                  <Input
                    value={item.date || ""}
                    onChange={(e) => handleUpdateAchievement(index, "date", e.target.value)}
                    disabled={readOnly}
                    placeholder="যেমন: ২০২৪"
                    className="bg-background/60"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block flex items-center gap-1">
                    <Medal className="w-3.5 h-3.5" /> অর্জনের ধরন
                  </label>
                  <select
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background/60 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={item.type || "AWARD"}
                    onChange={(e) => handleUpdateAchievement(index, "type", e.target.value)}
                    disabled={readOnly}
                  >
                    <option value="BOARD_RESULT">বোর্ড পরীক্ষার ফলাফল</option>
                    <option value="COMPETITION">প্রতিযোগিতা</option>
                    <option value="AWARD">পুরস্কার বা সম্মাননা</option>
                    <option value="OTHER">অন্যান্য</option>
                  </select>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">বিস্তারিত বিবরণ (ঐচ্ছিক)</label>
                  <Textarea
                    value={item.description || ""}
                    onChange={(e) => handleUpdateAchievement(index, "description", e.target.value)}
                    disabled={readOnly}
                    placeholder="অর্জন সম্পর্কে বিস্তারিত কিছু লিখতে চাইলে..."
                    className="min-h-[80px] bg-background/60 resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
