"use client";

import { User, LogOut, Home, BookOpen, Info, Phone, LayoutDashboard, Download, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: NavItem[];
  user: { email: string; role: string } | null;
  onLogout: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  "/": Home,
  "/madrasas": BookOpen,
  "/about": Info,
  "/contact": Phone,
  "/install": Download,
};

const MobileMenu = ({ open, onOpenChange, items, user, onLogout }: MobileMenuProps) => {
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[300px] sm:w-[350px] p-0 bg-background border-l border-border/40 safe-top safe-bottom flex flex-col overflow-hidden"
      >
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 islamic-pattern opacity-[0.03] pointer-events-none" />

        <SheetHeader className="px-6 pt-8 pb-4 border-b border-border/30 relative bg-secondary/30">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12" />
          <SheetTitle className="text-lg font-black text-primary text-left flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            মাদ্রাসা মেনু
          </SheetTitle>
        </SheetHeader>

        {/* User Profile Section - Native App Style */}
        <div className="px-6 py-6">
          {user ? (
            <div className="relative group active-scale cursor-pointer overflow-hidden p-4 rounded-[2rem] bg-card border border-border/40 shadow-soft">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/5 rounded-full blur-xl" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <User className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-black text-foreground truncate">{user.email?.split("@")[0] || "ব্যবহারকারী"}</div>
                  <div className="text-[10px] text-accent font-black uppercase tracking-widest mt-0.5">
                    {user.role?.toUpperCase() === "SUPER_ADMIN" ? "এডমিন" : user.role?.toUpperCase() === "INSTITUTION_ADMIN" ? "পরিচালক" : "ভিজিটর"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-[2rem] bg-primary/5 border border-primary/10 flex flex-col items-center text-center">
               <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-tighter">লগইন করে আরও সুবিধা পান</p>
               <div className="flex w-full gap-2">
                  <Button variant="outline" className="flex-1 h-10 rounded-xl text-xs font-bold active-scale" onClick={close} asChild>
                    <Link href="/login">লগইন</Link>
                  </Button>
                  <Button className="flex-1 h-10 rounded-xl text-xs font-bold active-scale bg-primary text-white" onClick={close} asChild>
                    <Link href="/signup">নিবন্ধন</Link>
                  </Button>
               </div>
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
          <p className="px-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">নেভিগেশন</p>

          {items.map((item) => {
            const Icon = iconMap[item.href] || BookOpen;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={close}
                className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold text-foreground hover:bg-secondary/50 active:bg-secondary transition-all active-scale group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  {item.label}
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </Link>
            );
          })}

          {user && (
            <>
              <Separator className="my-4 bg-border/40" />
              <Link
                href="/dashboard"
                onClick={close}
                className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-black text-primary bg-primary/5 hover:bg-primary/10 active-scale group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-md">
                    <LayoutDashboard className="w-4.5 h-4.5" />
                  </div>
                  ড্যাশবোর্ড
                </div>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </nav>

        {/* Bottom actions */}
        <div className="p-6 border-t border-border/40 bg-secondary/20 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
               <span className="text-xs font-black text-foreground uppercase tracking-wider">ডার্ক মোড</span>
               <span className="text-[10px] text-muted-foreground font-medium">থিম পরিবর্তন করুন</span>
            </div>
            <ThemeToggle />
          </div>

          {user && (
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl text-sm font-black text-destructive border-destructive/20 hover:bg-destructive/5 active-scale gap-2"
              onClick={() => { close(); onLogout(); }}
            >
              <LogOut className="w-4 h-4" /> লগআউট করুন
            </Button>
          )}

          <div className="mt-4 text-center">
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Version 0.0.0</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
