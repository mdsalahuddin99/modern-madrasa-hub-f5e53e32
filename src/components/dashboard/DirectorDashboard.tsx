"use client";

import { useState } from "react";
import { Users, BookOpen, Eye, GraduationCap } from "lucide-react";
import {
  SidebarProvider, SidebarTrigger
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Components
import { StatCard } from "./director/sections/StatCard";
import { DashboardHeader } from "./director/sections/DashboardHeader";
import { HeroSection } from "./director/sections/HeroSection";
import { TabContent } from "./director/sections/TabContent";
import { ActionSection } from "./director/sections/ActionSection";
import DirectorSidebar from "./director/DirectorSidebar";
import DirectorMobileNav from "./director/DirectorMobileNav";

// Hooks
import { useDirectorDashboard } from "@/hooks/useDirectorDashboard";

// Actions
import { updateMadrasaProfile } from "@/actions/director.actions";

const DirectorDashboard = () => {
  const { user, logout } = useAuth();
  const isLocked = !user?.subscriptionActive;

  const {
    formData,
    madrasaId,
    isLoading,
    update,
    addRule,
    removeRule,
    updateRule,
    addDepartment,
    removeDepartment,
    updateDepartment,
    addCourse,
    removeCourse,
    updateCourse,
    addFacility,
    updateFacility,
    removeFacility,
    handleFileUpload,
    addGalleryImages,
    addAdmissionImages,
    removeGalleryImage,
    removeAdmissionImage,
  } = useDirectorDashboard(user?.id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const tabMeta: Record<string, { label: string; premium: boolean }> = {
    about: { label: "পরিচিতি", premium: false },
    academic: { label: "একাডেমিক", premium: true },
    staff: { label: "শিক্ষার্থী ও শিক্ষক", premium: true },
    admission: { label: "ভর্তি তথ্য", premium: true },
    gallery: { label: "গ্যালারি", premium: true },
    contact: { label: "যোগাযোগ", premium: true },
    seo: { label: "এসইও", premium: true },
  };

  const handleLockedAction = () => {
    setShowUpgradeModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("মাদ্রাসার নাম দিন");
      return;
    }
    
    if (isLocked) {
      handleLockedAction();
      return;
    }

    if (!madrasaId) {
      toast.error("মাদ্রাসার তথ্য পাওয়া যায়নি");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("তথ্য আপডেট হচ্ছে...");

    try {
      const submissionData = {
        ...formData,
        students: parseInt(formData.studentCount) || 0,
        teachers: parseInt(formData.teacherCount) || 0,
      };

      const result = await updateMadrasaProfile(madrasaId, submissionData);

      if (result.success) {
        toast.success("তথ্য আপডেট সফল হয়েছে! এডমিন এপ্রুভালের জন্য অপেক্ষা করুন।", { id: toastId });
      } else {
        toast.error(result.error || "আপডেট ব্যর্থ হয়েছে", { id: toastId });
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("একটি সমস্যা হয়েছে", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    { label: "শিক্ষার্থী", value: parseInt(formData.studentCount) || 0, icon: Users, color: "bg-primary/10 text-primary" },
    { label: "শিক্ষক", value: parseInt(formData.teacherCount) || 0, icon: GraduationCap, color: "bg-accent/15 text-accent" },
    { label: "প্রাক্তন ছাত্র", value: parseInt(formData.alumniCount) || 0, icon: BookOpen, color: "bg-emerald-500/10 text-emerald-600" },
    { label: "মোট ভিউ", value: 0, icon: Eye, color: "bg-primary/10 text-primary" },
  ];

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/madrasas/${madrasaId || user?.id}` : "";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-[100svh] flex w-full bg-background font-bengali">
        <DirectorSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isLocked={isLocked} 
          onLockedAction={handleLockedAction}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <DirectorMobileNav 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isLocked={isLocked} 
            onLockedAction={handleLockedAction}
          />

          <header className="hidden md:flex h-12 items-center border-b border-border/40 px-4 sticky top-0 bg-background/80 backdrop-blur-lg z-30">
            <SidebarTrigger className="mr-3" />
            <span className="text-xs text-muted-foreground flex-1">পরিচালক প্যানেল</span>
          </header>

          <main className="flex-1 p-4 md:p-6 overflow-auto mt-14 md:mt-0">
            <div className="container mx-auto max-w-4xl">
              <DashboardHeader email={user?.email} onLogout={() => logout()} />

              {activeTab === "about" && (
                <>
                  <HeroSection 
                    formData={formData} 
                    update={update} 
                    handleFileUpload={handleFileUpload} 
                    isLocked={isLocked} 
                    onLockedAction={handleLockedAction}
                  />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    {stats.map((s, i) => (
                      <StatCard key={s.label} {...s} delay={i * 0.05} />
                    ))}
                  </div>
                </>
              )}

              <div className="mt-5">
                <TabContent 
                  activeTab={activeTab}
                  formData={formData}
                  update={update}
                  isLocked={isLocked}
                  updateDepartment={updateDepartment}
                  addDepartment={addDepartment}
                  removeDepartment={removeDepartment}
                  updateCourse={updateCourse}
                  addCourse={addCourse}
                  removeCourse={removeCourse}
                  updateFacility={updateFacility}
                  addFacility={addFacility}
                  removeFacility={removeFacility}
                  updateRule={updateRule}
                  addRule={addRule}
                  removeRule={removeRule}
                  handleFileUpload={handleFileUpload}
                  addGalleryImages={addGalleryImages}
                  removeGalleryImage={removeGalleryImage}
                  addAdmissionImages={addAdmissionImages}
                  removeAdmissionImage={removeAdmissionImage}
                />
              </div>

              <ActionSection 
                isSubmitting={isSubmitting}
                isLocked={isLocked}
                isLoading={isLoading}
                handleSubmit={handleSubmit}
                shareUrl={shareUrl}
              />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DirectorDashboard;
