"use client";

import { User, LogOut, Home, BookOpen, Info, Phone, LayoutDashboard, Download, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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
        <SheetHeader className="px-6 pt-8 pb-4 relative bg-background">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12" />
          <SheetTitle className="text-lg font-bold text-primary text-left flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary/80" />
            মেনু
          </SheetTitle>
        </SheetHeader>

        {/* User Profile Section - Luxe Style */}
        <div className="px-6 py-4">
          {user ? (
            <div className="relative group cursor-pointer overflow-hidden p-4 rounded-3xl bg-white border border-black/5 shadow-sm">
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <User className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-foreground truncate">{user.email?.split("@")[0] || "ব্যবহারকারী"}</div>
                  <div className="text-xs text-primary font-medium mt-0.5">
                    {user.role?.toUpperCase() === "SUPER_ADMIN" ? "এডমিন" : user.role?.toUpperCase() === "INSTITUTION_ADMIN" ? "পরিচালক" : "ভিজিটর"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col items-center text-center">
              <p className="text-sm font-medium text-muted-foreground mb-4">লগইন করে আরও সুবিধা পান</p>
              <div className="flex w-full gap-3">
                <Button variant="outline" className="flex-1 h-11 rounded-xl text-sm font-bold" onClick={close} asChild>
                  <Link href="/login">লগইন</Link>
                </Button>
                <Button className="flex-1 h-11 rounded-xl text-sm font-bold bg-primary text-white" onClick={close} asChild>
                  <Link href="/signup">নিবন্ধন</Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 pb-6 space-y-1">
          <p className="px-3 text-xs font-bold text-muted-foreground/60 mb-3 mt-2">নেভিগেশন</p>

          {items.map((item) => {
            const Icon = iconMap[item.href] || BookOpen;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={close}
                className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold text-foreground hover:bg-secondary/50 transition-all group"
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
                className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold text-primary bg-primary/5 hover:bg-primary/10 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20">
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
        <div className="p-6 border-t border-border/40 bg-background relative">
          <div className="flex items-center justify-between mb-5">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">ডার্ক মোড</span>
              <span className="text-xs text-muted-foreground font-medium">থিম পরিবর্তন করুন</span>
            </div>
            <ThemeToggle />
          </div>

          {user && (
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl text-sm font-bold text-destructive hover:bg-destructive hover:text-white hover:border-destructive transition-colors gap-2"
              onClick={() => { close(); onLogout(); }}
            >
              <LogOut className="w-4 h-4" /> লগআউট করুন
            </Button>
          )}

          <div className="mt-5 text-center">
            <p className="text-xs font-medium text-muted-foreground/50">সংস্করণ ১.০.০</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
