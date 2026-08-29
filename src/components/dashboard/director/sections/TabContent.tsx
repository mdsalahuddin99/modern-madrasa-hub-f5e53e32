"use client";

import { AboutTab } from "@/components/dashboard/director/tabs/AboutTab";
import { AcademicTab } from "@/components/dashboard/director/tabs/AcademicTab";
import { StaffTab } from "@/components/dashboard/director/tabs/StaffTab";
import { AdmissionTab } from "@/components/dashboard/director/tabs/AdmissionTab";
import { GalleryTab } from "@/components/dashboard/director/tabs/GalleryTab";
import { ContactTab } from "@/components/dashboard/director/tabs/ContactTab";
import { SEOTab } from "@/components/dashboard/director/tabs/SEOTab";
import { NoticeTab } from "@/components/dashboard/director/tabs/NoticeTab";

interface TabContentProps {
  activeTab: string;
  formData: any;
  update: (field: string, value: any) => void;

  updateDepartment: (index: number, field: string, value: string) => void;
  addDepartment: () => void;
  removeDepartment: (index: number) => void;
  updateCourse: (index: number, value: string) => void;
  addCourse: () => void;
  removeCourse: (index: number) => void;
  updateFacility: (index: number, value: string) => void;
  addFacility: () => void;
  removeFacility: (index: number) => void;
  updateRule: (index: number, value: string) => void;
  addRule: () => void;
  removeRule: (index: number) => void;
  handleFileUpload: (field: "bannerImage" | "admissionFile", file: File) => Promise<any>;
  addGalleryImages: (files: FileList) => Promise<any>;
  removeGalleryImage: (index: number) => void;
  addAdmissionImages: (files: FileList) => void;
  removeAdmissionImage: (index: number) => void;
  isSubmitting?: boolean;
  handleSubmit?: () => void | Promise<void>;
}

export const TabContent = ({
  activeTab,
  formData,
  update,

  updateDepartment,
  addDepartment,
  removeDepartment,
  updateCourse,
  addCourse,
  removeCourse,
  updateFacility,
  addFacility,
  removeFacility,
  updateRule,
  addRule,
  removeRule,
  handleFileUpload,
  addGalleryImages,
  removeGalleryImage,
  addAdmissionImages,
  removeAdmissionImage,
  isSubmitting,
  handleSubmit,
}: TabContentProps) => {
  const { toast } = require("sonner");
  
  const hasFeature = (code: string) => {
    // If not loaded yet, or if they have the feature
    if (!formData.allowedFeatures) return true; 
    return formData.allowedFeatures.includes(code);
  };

  const handleLocked = (name: string) => {
    toast.error(`"${name}" ফিচারটি আপনার বর্তমান প্ল্যানে নেই। আপগ্রেড করুন।`);
  };

  const wrapGuard = (component: React.ReactNode, featureCode: string, featureName: string) => {
    const isAllowed = hasFeature(featureCode);
    return (
      <div className="relative">
        {!isAllowed && (
          <div className="absolute inset-0 z-50 bg-background/50 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-lg">
            <div className="bg-card p-6 rounded-lg shadow-xl border text-center max-w-sm">
              <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <h3 className="text-lg font-bold mb-2">ফিচারটি লক করা আছে</h3>
              <p className="text-sm text-muted-foreground mb-4">
                "{featureName}" ব্যবহার করতে আপনার সাবস্ক্রিপশন প্ল্যান আপগ্রেড করুন।
              </p>
              <button 
                onClick={() => handleLocked(featureName)}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-bold"
              >
                আপগ্রেড করুন
              </button>
            </div>
          </div>
        )}
        <div className={!isAllowed ? "pointer-events-none opacity-50 select-none" : ""}>
          {component}
        </div>
      </div>
    );
  };

  switch (activeTab) {
    case "about":
      return wrapGuard(<AboutTab formData={formData} update={update} />, "PROFILE", "পরিচিতি");
    case "academic":
      return wrapGuard(
        <AcademicTab
          formData={formData}
          updateDepartment={updateDepartment}
          addDepartment={addDepartment}
          removeDepartment={removeDepartment}
          updateCourse={updateCourse}
          addCourse={addCourse}
          removeCourse={removeCourse}
          updateFacility={updateFacility}
          addFacility={addFacility}
          removeFacility={removeFacility}
        />,
        "PROFILE",
        "একাডেমিক"
      );
    case "staff":
      return wrapGuard(
        <StaffTab
          formData={formData}
          update={update}
          teachers={formData.teachersList || []}
          updateTeacher={(teachers: any[]) => update("teachersList", teachers)}
          handleFileUpload={handleFileUpload}
        />,
        "STAFF",
        "শিক্ষার্থী ও শিক্ষক"
      );
    case "admission":
      return wrapGuard(
        <AdmissionTab
          formData={formData}
          update={update}
          updateRule={updateRule}
          addRule={addRule}
          removeRule={removeRule}
          handleFileUpload={(field) => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = field === "admissionFile" ? "application/pdf,image/*" : "image/*";
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) handleFileUpload(field, file);
            };
            input.click();
          }}
          handleAdmissionImagesUpload={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.multiple = true;
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files;
              if (files) addAdmissionImages(files);
            };
            input.click();
          }}
          removeAdmissionImage={removeAdmissionImage}
        />,
        "ADMISSION",
        "ভর্তি তথ্য"
      );
    case "gallery":
      return wrapGuard(
        <GalleryTab
          formData={formData}
          addGalleryImages={addGalleryImages}
          removeGalleryImage={removeGalleryImage}
        />,
        "GALLERY",
        "গ্যালারি"
      );
    case "contact":
      return wrapGuard(<ContactTab formData={formData} update={update} />, "PROFILE", "যোগাযোগ");
    case "seo":
      return wrapGuard(<SEOTab formData={formData} update={update} />, "PROFILE", "এসইও");
    case "notice":
      return wrapGuard(
        <NoticeTab
          formData={formData}
          update={update}
          notices={formData.notices || []}
          updateNotice={(notices: any[]) => update("notices", notices)}
          handleFileUpload={handleFileUpload}
        />,
        "NOTICE",
        "নোটিশ ও নিউজ"
      );
    default:
      return null;
  }
};
