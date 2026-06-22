"use client";

import { AboutTab } from "@/components/dashboard/director/tabs/AboutTab";
import { AcademicTab } from "@/components/dashboard/director/tabs/AcademicTab";
import { StaffTab } from "@/components/dashboard/director/tabs/StaffTab";
import { AdmissionTab } from "@/components/dashboard/director/tabs/AdmissionTab";
import { GalleryTab } from "@/components/dashboard/director/tabs/GalleryTab";
import { ContactTab } from "@/components/dashboard/director/tabs/ContactTab";
import { SEOTab } from "@/components/dashboard/director/tabs/SEOTab";

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
}: TabContentProps) => {
  switch (activeTab) {
    case "about":
      return <AboutTab formData={formData} update={update} />;
    case "academic":
      return (
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
      );
    case "staff":
      return (
        <StaffTab
          formData={formData}
          update={update}
          teachers={formData.teachersList || []}
          updateTeacher={(teachers: any[]) => update("teachersList", teachers)}
          handleFileUpload={handleFileUpload}
        />
      );
    case "admission":
      return (
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
      );
    case "gallery":
      return (
        <GalleryTab
          formData={formData}
          addGalleryImages={addGalleryImages}
          removeGalleryImage={removeGalleryImage}
        />
      );
    case "contact":
      return <ContactTab formData={formData} update={update} />;
    case "seo":
      return <SEOTab formData={formData} update={update} />;
    default:
      return null;
  }
};
