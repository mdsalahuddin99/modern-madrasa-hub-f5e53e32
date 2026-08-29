"use client";

import { useState } from "react";
import { Users, BookOpen, Eye, GraduationCap, Sidebar as SidebarIcon, LayoutDashboard, Sparkles, LogOut, ChevronRight, Clock } from "lucide-react";
import {
  SidebarProvider, SidebarTrigger
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Components
import { StatCard } from "./director/sections/StatCard";
import { DashboardHeader } from "./director/sections/DashboardHeader";
import { HeroSection } from "./director/sections/HeroSection";
import { TabContent } from "./director/sections/TabContent";
import { ActionSection } from "./director/sections/ActionSection";
import { SubscriptionTab } from "./director/sections/SubscriptionTab";
import DirectorSidebar from "./director/DirectorSidebar";
import DirectorMobileNav from "./director/DirectorMobileNav";
import ProfileCompletion from "./director/ProfileCompletion";

// Hooks
import { useDirectorDashboard } from "@/hooks/useDirectorDashboard";

// Actions
import { updateMadrasaProfile } from "@/actions/director.actions";
import { cn, toBn } from "@/lib/utils";

const DirectorDashboard = () => {
  const { user, logout } = useAuth();

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

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("মাদ্রাসার নাম দিন");
      return;
    }

    if (!madrasaId) {
      toast.error("মাদ্রাসার তথ্য পাওয়া যায়নি");
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
        toast.success("তথ্য আপডেট সফল হয়েছে! অ্যাডমিন অ্যাপ্রুভালের জন্য অপেক্ষা করুন।", { id: toastId });
      } else {
        toast.error(result.error || "আপডেট ব্যর্থ হয়েছে", { id: toastId });
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("একটি সমস্যা হয়েছে", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    { label: "শিক্ষার্থী", value: parseInt(formData.studentCount) || 0, icon: Users, color: "text-primary", bg: "bg-primary/5" },
    { label: "শিক্ষক", value: parseInt(formData.teacherCount) || 0, icon: GraduationCap, color: "text-accent", bg: "bg-accent/5" },
    { label: "প্রাক্তন ছাত্র", value: parseInt(formData.alumniCount) || 0, icon: BookOpen, color: "text-primary", bg: "bg-primary/5" },
    { label: "মোট ভিউ", value: 0, icon: Eye, color: "text-accent", bg: "bg-accent/5" },
  ];

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/madrasas/${madrasaId || user?.id}` : "";

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-secondary/10">
        <div className="w-16 h-16 bg-card rounded-[2rem] flex items-center justify-center shadow-soft animate-pulse">
           <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-xs font-black text-primary uppercase tracking-widest animate-pulse">লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-[100svh] flex w-full bg-secondary/10 font-bengali selection:bg-primary/10">
        <DirectorSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        <div className="flex-1 flex flex-col min-w-0 relative">
          <div className="absolute inset-0 islamic-pattern opacity-[0.02] pointer-events-none" />

          <DirectorMobileNav 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />

          {/* Desktop App Header */}
          <header className="hidden md:flex h-16 items-center border-b border-border/40 px-6 sticky top-0 bg-background/80 backdrop-blur-xl z-30 shadow-sm">
            <div className="flex items-center gap-4 flex-1">
              <SidebarTrigger className="h-10 w-10 rounded-xl bg-secondary/50 border border-border/40 text-foreground active-scale" />
              <div className="flex items-center gap-2">
                 <LayoutDashboard className="w-5 h-5 text-primary" />
                 <span className="text-sm font-black text-foreground uppercase tracking-tight">পরিচালক প্যানেল</span>
                 <div className="hidden lg:flex items-center gap-1.5 ml-2 text-[9px] font-black text-accent uppercase tracking-widest bg-accent/5 px-2 py-0.5 rounded-md border border-accent/10">
                    <Sparkles className="w-3 h-3" /> ম্যানেজমেন্ট মোড
                 </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">সিস্টেম টাইম</span>
                  <span className="text-[10px] font-bold text-foreground tabular-nums">{toBn(new Date().toLocaleTimeString("bn-BD", { hour: '2-digit', minute: '2-digit' }))}</span>
               </div>
            </div>
          </header>

          <main className="flex-1 p-5 sm:p-8 lg:p-10 relative z-10 mt-14 md:mt-0">
            <div className="container mx-auto max-w-5xl">
              <DashboardHeader email={user?.email} onLogout={() => logout()} />

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {activeTab === "about" && (
                  <div className="space-y-8">
                    <HeroSection
                      formData={formData}
                      update={update}
                      handleFileUpload={handleFileUpload}
                    />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                      {stats.map((s, i) => (
                        <StatCard key={s.label} {...s} delay={i * 0.05} />
                      ))}
                    </div>

                    <ProfileCompletion formData={formData} className="mb-8" />
                  </div>
                )}

                {activeTab === "subscription" ? (
                  <SubscriptionTab
                    madrasaId={formData?.id || ""}
                    madrasaCreatedAt={formData.createdAt}
                    madrasaStatus={formData.status}
                    isSubmitting={isSubmitting}
                  />
                ) : (
                  <div className="space-y-10">
                    <div className="mt-8">
                      <TabContent
                        activeTab={activeTab}
                        formData={formData}
                        update={update}
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
                        isSubmitting={isSubmitting}
                        handleSubmit={handleSubmit}
                      />
                    </div>

                    {/* Desktop Fixed Bottom Action Bar for forms */}
                    <div className="hidden md:block sticky bottom-6 z-40 bg-background/80 backdrop-blur-xl border border-border/40 p-4 rounded-[2rem] shadow-soft max-w-fit mx-auto">
                       <div className="flex items-center gap-4">
                          <Button
                             onClick={handleSubmit}
                             disabled={isSubmitting}
                             className="h-12 px-8 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-widest active-scale shadow-lg shadow-primary/20"
                          >
                             {isSubmitting ? "আপডেট হচ্ছে..." : "সব পরিবর্তন সেভ করুন"}
                          </Button>
                          <div className="h-6 w-px bg-border" />
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">সিস্টেম অটো-সেভ মোড</p>
                       </div>
                    </div>

                    <ActionSection
                      isSubmitting={isSubmitting}
                      isLoading={isLoading}
                      handleSubmit={handleSubmit}
                      shareUrl={shareUrl}
                    />
                  </div>
                )}
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DirectorDashboard;
