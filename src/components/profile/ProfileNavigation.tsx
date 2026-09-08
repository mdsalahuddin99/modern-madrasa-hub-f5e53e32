"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Menu, X, Info, Users, GraduationCap, 
  Image as ImageIcon, Bell, Phone,
  ChevronDown, BookOpen
} from "lucide-react";

interface ProfileNavigationProps {
  madrasaSlug: string;
  hasGallery: boolean;
  madrasa?: any;
}

export default function ProfileNavigation({ madrasaSlug, hasGallery, madrasa }: ProfileNavigationProps) {
  const pathname = usePathname() || "";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [expandedTabs, setExpandedTabs] = useState<Record<string, boolean>>({});

  const toggleTab = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedTabs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Dynamic Academic Departments
  const academicSubItems = madrasa?.departments?.map((dept: any) => ({
    label: dept.name,
    href: `/madrasas/${madrasaSlug}/academic/${dept.type.toLowerCase()}`
  })) || [
    { label: "মক্তব বিভাগ", href: `/madrasas/${madrasaSlug}/academic/maktab` },
    { label: "হিফজুল কুরআন", href: `/madrasas/${madrasaSlug}/academic/hifz` },
    { label: "কিতাব বিভাগ", href: `/madrasas/${madrasaSlug}/academic/kitab` },
    { label: "তাখাসসুস বিভাগ", href: `/madrasas/${madrasaSlug}/academic/takhassus` },
  ];

  // Dynamic Notices
  const noticeTypes = madrasa?.contents?.filter((c: any) => c.type === 'NOTICE') || [];
  const noticeSubItems = noticeTypes.length > 0 
    ? noticeTypes.slice(0, 5).map((notice: any) => ({
        label: notice.title,
        href: `/madrasas/${madrasaSlug}/notices/${notice.slug}`
      }))
    : [
        { label: "সাধারণ নোটিশ", href: `/madrasas/${madrasaSlug}/notices/general` },
        { label: "পরীক্ষা সংক্রান্ত", href: `/madrasas/${madrasaSlug}/notices/exam` },
        { label: "ছুটির নোটিশ", href: `/madrasas/${madrasaSlug}/notices/holiday` },
      ];

  const tabs = [
    { 
      id: "about", 
      label: "পরিচিতি", 
      href: `/madrasas/${madrasaSlug}`, 
      icon: Info, 
      exact: true,
      subItems: [
        { label: "মাদ্রাসা পরিচিতি", href: `/madrasas/${madrasaSlug}` },
        ...(madrasa?.principalMessage ? [{ label: "পরিচালকের বাণী", href: `/madrasas/${madrasaSlug}#director` }] : [{ label: "পরিচালকের বাণী", href: `/madrasas/${madrasaSlug}#director` }]),
        { label: "শিক্ষকগণ", href: `/madrasas/${madrasaSlug}/teachers` },
      ]
    },
    { 
      id: "academic", 
      label: "শিক্ষা কার্যক্রম", 
      href: `/madrasas/${madrasaSlug}/academic`, 
      icon: BookOpen,
      subItems: academicSubItems,
    },
    { id: "admission", label: "ভর্তি তথ্য", href: `/madrasas/${madrasaSlug}/admission`, icon: GraduationCap },
    ...(hasGallery ? [{ id: "gallery", label: "গ্যালারি", href: `/madrasas/${madrasaSlug}/gallery`, icon: ImageIcon }] : []),
    { 
      id: "notices", 
      label: "নোটিশ", 
      href: `/madrasas/${madrasaSlug}/notices`, 
      icon: Bell,
      subItems: noticeSubItems,
    },
    { id: "contact", label: "যোগাযোগ", href: `/madrasas/${madrasaSlug}/contact`, icon: Phone },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:flex flex-wrap items-center justify-center gap-1 py-3">
          {tabs.map((tab) => {
            const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
            const hasSub = tab.subItems && tab.subItems.length > 0;
            return (
              <div key={tab.id} className="relative group">
                <Link
                  href={tab.href}
                  className={cn(
                    "whitespace-nowrap px-4 py-2 rounded-md text-[15px] font-semibold transition-all duration-300 flex items-center gap-2",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {hasSub && <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-70 group-hover:rotate-180 transition-transform duration-300" />}
                </Link>

                {hasSub && (
                  <div className="absolute top-full left-0 mt-2 min-w-[200px] bg-white dark:bg-card rounded-xl shadow-xl border border-border/40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left scale-95 group-hover:scale-100 z-50 overflow-hidden">
                    <div className="py-2">
                      {tab.subItems?.map((sub: { label: string, href: string }, idx: number) => (
                        <Link
                          key={idx}
                          href={sub.href}
                          className={cn(
                            "block px-4 py-2.5 text-[15px] font-medium transition-colors",
                            pathname === sub.href 
                              ? "bg-primary/10 text-primary" 
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      {/* Mobile Sidebar Menu (Drawer) */}
      <div className="lg:hidden">
        {/* Mobile Menu Trigger (FAB) */}
        <div className="fixed bottom-24 right-6 z-40">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center shadow-primary/30"
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-background z-[101] shadow-2xl flex flex-col border-l border-border/20"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-5 border-b border-border/10 bg-muted/20">
                <span className="font-bold text-lg text-foreground">প্রোফাইল মেনু</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Sidebar Links */}
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1 scrollbar-none pb-24">
                {tabs.map((tab) => {
                  const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
                  const hasSub = tab.subItems && tab.subItems.length > 0;
                  const isExpanded = expandedTabs[tab.id];

                  return (
                    <div key={tab.id} className="flex flex-col">
                      {hasSub ? (
                        <button
                          onClick={(e) => toggleTab(tab.id, e)}
                          className={cn(
                            "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all w-full text-left",
                            isActive
                              ? "bg-primary/5 text-primary font-semibold"
                              : "text-foreground hover:bg-muted/50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg transition-colors", isActive ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground")}>
                              <tab.icon className="w-4 h-4" />
                            </div>
                            <span className="text-[15px]">{tab.label}</span>
                          </div>
                          <ChevronDown className={cn("w-4 h-4 transition-transform duration-200 text-muted-foreground", isExpanded && "rotate-180")} />
                        </button>
                      ) : (
                        <Link
                          href={tab.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                            isActive
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-foreground hover:bg-muted/50"
                          )}
                        >
                          <div className={cn("p-2 rounded-lg transition-colors", isActive ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" : "bg-muted/50 text-muted-foreground")}>
                            <tab.icon className="w-4 h-4" />
                          </div>
                          <span className="text-[15px]">{tab.label}</span>
                        </Link>
                      )}

                      {/* Submenu Accordion */}
                      <AnimatePresence>
                        {hasSub && isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-1 pl-12 pr-3 py-1">
                              {tab.subItems?.map((sub: { label: string, href: string }, idx: number) => (
                                <Link
                                  key={idx}
                                  href={sub.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className={cn(
                                    "px-3 py-2 rounded-lg text-[14px] transition-colors",
                                    pathname === sub.href
                                      ? "bg-primary/10 text-primary font-medium"
                                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                  )}
                                >
                                  {sub.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
