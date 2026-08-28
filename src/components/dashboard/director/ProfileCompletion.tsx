"use client";

import { CheckCircle2, Circle, AlertTriangle } from "lucide-react";
import { MadrasaFormData } from "@/types/madrasa";

interface ProfileField {
  key: string;
  label: string;
  check: (data: MadrasaFormData) => boolean;
  priority: "required" | "recommended";
}

const PROFILE_FIELDS: ProfileField[] = [
  // Required
  { key: "name", label: "প্রতিষ্ঠানের নাম", check: (d) => !!d.name?.trim(), priority: "required" },
  { key: "description", label: "সংক্ষিপ্ত বিবরণ", check: (d) => !!d.description?.trim(), priority: "required" },
  { key: "phone", label: "ফোন নম্বর", check: (d) => !!d.phone?.trim(), priority: "required" },
  { key: "email", label: "ইমেইল", check: (d) => !!d.email?.trim(), priority: "required" },
  { key: "address", label: "ঠিকানা", check: (d) => !!d.address?.trim(), priority: "required" },
  { key: "division", label: "বিভাগ", check: (d) => !!d.division?.trim(), priority: "required" },
  { key: "category", label: "ক্যাটাগরি", check: (d) => !!d.category?.trim(), priority: "required" },
  // Recommended
  { key: "bannerImage", label: "ব্যানার ছবি", check: (d) => !!d.bannerImage?.trim(), priority: "recommended" },
  { key: "history", label: "ইতিহাস", check: (d) => !!d.history?.trim(), priority: "recommended" },
  { key: "mission", label: "মিশন", check: (d) => !!d.mission?.trim(), priority: "recommended" },
  { key: "vision", label: "ভিশন", check: (d) => !!d.vision?.trim(), priority: "recommended" },
  { key: "principalName", label: "মুহতামিমের নাম", check: (d) => !!d.principalName?.trim(), priority: "recommended" },
  { key: "principalMessage", label: "মুহতামিমের বাণী", check: (d) => !!d.principalMessage?.trim(), priority: "recommended" },
  { key: "studentCount", label: "শিক্ষার্থী সংখ্যা", check: (d) => !!d.studentCount && parseInt(d.studentCount) > 0, priority: "recommended" },
  { key: "teacherCount", label: "শিক্ষক সংখ্যা", check: (d) => !!d.teacherCount && parseInt(d.teacherCount) > 0, priority: "recommended" },
  { key: "teachersList", label: "শিক্ষক তালিকা", check: (d) => !!(d.teachersList && d.teachersList.length > 0 && d.teachersList[0]?.name), priority: "recommended" },
  { key: "galleryImages", label: "গ্যালারি ছবি", check: (d) => d.galleryImages?.length > 0, priority: "recommended" },
  { key: "facilities", label: "সুবিধাসমূহ", check: (d) => d.facilities?.length > 0 && !!d.facilities[0], priority: "recommended" },
];

interface ProfileCompletionProps {
  formData: MadrasaFormData;
  className?: string;
}

export default function ProfileCompletion({ formData, className = "" }: ProfileCompletionProps) {
  const completed = PROFILE_FIELDS.filter((f) => f.check(formData));
  const missing = PROFILE_FIELDS.filter((f) => !f.check(formData));
  const percentage = Math.round((completed.length / PROFILE_FIELDS.length) * 100);

  const missingRequired = missing.filter((f) => f.priority === "required");
  const missingRecommended = missing.filter((f) => f.priority === "recommended");

  const getColor = () => {
    if (percentage >= 90) return "text-emerald-500";
    if (percentage >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const getBgColor = () => {
    if (percentage >= 90) return "bg-emerald-500";
    if (percentage >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className={`float-card bg-card rounded-2xl border border-border/60 p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground">প্রোফাইল সম্পূর্ণতা</h3>
        <span className={`text-2xl font-extrabold ${getColor()}`}>{percentage}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${getBgColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Missing Required */}
      {missingRequired.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-bold text-destructive flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            আবশ্যক তথ্য বাকি ({missingRequired.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missingRequired.map((f) => (
              <span
                key={f.key}
                className="text-[10px] px-2 py-1 rounded-lg bg-destructive/10 text-destructive border border-destructive/20"
              >
                {f.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Recommended */}
      {missingRecommended.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            প্রস্তাবিত ({missingRecommended.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missingRecommended.map((f) => (
              <span
                key={f.key}
                className="text-[10px] px-2 py-1 rounded-lg bg-muted text-muted-foreground"
              >
                {f.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* All Complete */}
      {missing.length === 0 && (
        <div className="flex items-center gap-2 text-emerald-600">
          <CheckCircle2 className="w-5 h-5" />
          <p className="text-sm font-bold">সকল তথ্য সম্পূর্ণ! 🎉</p>
        </div>
      )}
    </div>
  );
}
