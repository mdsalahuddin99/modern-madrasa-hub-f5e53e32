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
                "relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 active-scale tap-highlight-none",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {/* Active Background Glow */}
              {isActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-primary/5 rounded-2xl blur-sm" />
                </div>
              )}

              <div className={cn(
                "relative z-10 flex flex-col items-center gap-1",
                isActive ? "transform -translate-y-0.5" : ""
              )}>
                <item.icon
                  className={cn(
                    "w-6 h-6 transition-all duration-300",
                    isActive ? "stroke-[2.5px] fill-primary/10" : "stroke-2"
                  )}
                />
                <span className={cn(
                  "text-[10px] transition-all duration-300",
                  isActive ? "font-bold" : "font-medium"
                )}>
                  {item.label}
                </span>
              </div>

              {/* Top indicator dot */}
              {isActive && (
                <div className="absolute top-0 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_hsl(var(--primary))]" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
