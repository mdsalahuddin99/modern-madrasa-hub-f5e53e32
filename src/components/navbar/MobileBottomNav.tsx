"use client";

import { Home, BookOpen, Phone, User, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  const navItems = [
    { label: "হোম", href: "/", icon: Home },
    { label: "মাদ্রাসা", href: "/madrasas", icon: BookOpen },
    { label: "খুঁজুন", href: "/search", icon: Search },
    { label: "প্রোফাইল", href: user ? "/dashboard" : "/register", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/40 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
      <nav className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 active-scale tap-highlight-none select-none",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "relative z-10 flex flex-col items-center gap-1.5 px-4 py-1.5 rounded-2xl transition-all duration-300",
                isActive ? "bg-primary/10" : "bg-transparent"
              )}>
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isActive ? "stroke-[2.5px] fill-primary/10" : "stroke-[1.5px]"
                  )}
                />
                <span className={cn(
                  "text-[10px] transition-all duration-300",
                  isActive ? "font-bold" : "font-medium"
                )}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
