"use client";

import { AboutTab } from "@/components/dashboard/director/tabs/AboutTab";
import { AcademicTab } from "@/components/dashboard/director/tabs/AcademicTab";
import { StaffTab } from "@/components/dashboard/director/tabs/StaffTab";
import { AdmissionTab } from "@/components/dashboard/director/tabs/AdmissionTab";
import { GalleryTab } from "@/components/dashboard/director/tabs/GalleryTab";
import { ContactTab } from "@/components/dashboard/director/tabs/ContactTab";
import { SEOTab } from "@/components/dashboard/director/tabs/SEOTab";
import { DashboardPaywall } from "@/components/dashboard/DashboardPaywall";

interface TabContentProps {
  activeTab: string;
  formData: any;
  update: (field: string, value: any) => void;
  isLocked: boolean;
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
}

export const TabContent = ({
  activeTab,
  formData,
  update,
  isLocked,
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
}: TabContentProps) => {
  switch (activeTab) {
    case "about":
      return <AboutTab formData={formData} update={update} />;
    case "academic":
      return (
        <DashboardPaywall isLocked={isLocked} message="একাডেমিক ম্যানেজমেন্ট ফিচারটি ব্যবহার করতে সাবস্ক্রিপশন প্রয়োজন">
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
          />
        </DashboardPaywall>
      );
    case "staff":
      return (
        <DashboardPaywall isLocked={isLocked} message="শিক্ষক ও শিক্ষার্থী ম্যানেজমেন্ট ফিচারটি ব্যবহার করতে সাবস্ক্রিপশন প্রয়োজন">
          <StaffTab
            formData={formData}
            update={update}
            teachers={formData.teachersList || []}
            updateTeacher={(teachers: any[]) => update("teachersList", teachers)}
            handleFileUpload={handleFileUpload}
          />
        </DashboardPaywall>
      );
    case "admission":
      return (
        <DashboardPaywall isLocked={isLocked} message="ভর্তি তথ্য ও ফরম ম্যানেজমেন্ট ফিচারটি ব্যবহার করতে সাবস্ক্রিপশন প্রয়োজন">
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
          />
        </DashboardPaywall>
      );
    case "gallery":
      return (
        <DashboardPaywall isLocked={isLocked} message="ফটো গ্যালারি ম্যানেজমেন্ট ফিচারটি ব্যবহার করতে সাবস্ক্রিপশন প্রয়োজন">
          <GalleryTab
            formData={formData}
            addGalleryImages={addGalleryImages}
            removeGalleryImage={removeGalleryImage}
          />
        </DashboardPaywall>
      );
    case "contact":
      return (
        <DashboardPaywall isLocked={isLocked} message="যোগাযোগের তথ্য ও ম্যাপ ফিচারটি ব্যবহার করতে সাবস্ক্রিপশন প্রয়োজন">
          <ContactTab formData={formData} update={update} />
        </DashboardPaywall>
      );
    case "seo":
      return (
        <DashboardPaywall isLocked={isLocked} message="এসইও ও মেটা ডাটা ফিচারটি ব্যবহার করতে সাবস্ক্রিপশন প্রয়োজন">
          <SEOTab formData={formData} update={update} />
        </DashboardPaywall>
      );
    default:
      return null;
  }
};
