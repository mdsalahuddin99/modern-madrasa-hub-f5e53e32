"use client";

import { Home, BookOpen, Phone, User } from "lucide-react";
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
    { label: "যোগাযোগ", href: "/contact", icon: Phone },
    { label: "প্রোফাইল", href: user ? "/dashboard" : "/register", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-xl border-t border-border/40 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_hsl(var(--foreground)/0.03)]">
      <nav className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 touch-target",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground active:scale-95"
              )}
            >
              {isActive && (
                <div className="absolute top-0 w-8 h-1 bg-primary rounded-b-full shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
              )}
              <item.icon 
                className={cn(
                  "w-[22px] h-[22px] transition-all duration-300", 
                  isActive ? "fill-primary/20 scale-110" : "scale-100"
                )} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
              <span className={cn(
                "text-[10px] transition-all duration-300",
                isActive ? "font-bold" : "font-medium"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
