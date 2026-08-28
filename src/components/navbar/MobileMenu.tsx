"use client";

import { User, LogOut, Home, BookOpen, Info, Phone, LayoutDashboard, Download } from "lucide-react";
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
        className="w-[280px] sm:w-[320px] p-0 bg-background border-l border-border/40 safe-top safe-bottom flex flex-col"
      >
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-border/30">
          <SheetTitle className="text-sm font-bold text-foreground text-left">মেনু</SheetTitle>
        </SheetHeader>

        {/* User info */}
        {user && (
          <div className="px-4 py-3">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-foreground truncate">{user.email?.split("@")[0] || "ব্যবহারকারী"}</div>
                <div className="text-[10px] text-muted-foreground">
                  {user.role?.toUpperCase() === "SUPER_ADMIN" ? "এডমিন" : user.role?.toUpperCase() === "INSTITUTION_ADMIN" ? "পরিচালক" : "ভিজিটর"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
          {items.map((item) => {
            const Icon = iconMap[item.href] || BookOpen;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={close}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted/60 active:bg-muted transition-colors touch-target"
              >
                <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                {item.label}
              </Link>
            );
          })}

          {user && (
            <>
              <Separator className="my-2 bg-border/30" />
              <Link
                href="/dashboard"
                onClick={close}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-primary hover:bg-primary/5 active:bg-primary/8 transition-colors touch-target"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <LayoutDashboard className="w-4 h-4 text-primary" />
                </div>
                ড্যাশবোর্ড
              </Link>
            </>
          )}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-border/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">থিম</span>
            <ThemeToggle />
          </div>
          {user ? (
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl text-sm font-semibold gap-2 touch-target"
              onClick={() => { close(); onLogout(); }}
            >
              <LogOut className="w-4 h-4" /> লগআউট
            </Button>
          ) : (
            <>
              <Link href="/login" onClick={close}>
                <Button variant="outline" className="w-full h-11 rounded-xl text-sm font-semibold touch-target">লগইন</Button>
              </Link>
              <Link href="/signup" onClick={close}>
                <Button className="w-full h-11 rounded-xl text-sm font-semibold shimmer-btn gradient-btn text-primary-foreground touch-target">নিবন্ধন</Button>
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
