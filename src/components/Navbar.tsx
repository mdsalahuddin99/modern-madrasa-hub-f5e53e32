"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, BookOpen } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSiteContent } from "@/hooks/useSiteContent";
import GlobalSearch from "@/components/GlobalSearch";
import DesktopNav from "@/components/navbar/DesktopNav";
import UserDropdown from "@/components/navbar/UserDropdown";
import MobileMenu from "@/components/navbar/MobileMenu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroMode, setHeroMode] = useState(isHome);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { user, logout } = useAuth();
  const { content } = useSiteContent();
  const navItems = content.navbar.links;

  useEffect(() => {
    if (!isHome) setHeroMode(false);
  }, [isHome]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      setHeroMode(isHome && y < Math.min(window.innerHeight * 0.75, 520));
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(y / docHeight, 1) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const lightOnHero = heroMode && !scrolled;

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 safe-top transition-all duration-300",
          "bg-background shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border-b border-border/40"
        )}
        role="navigation"
        aria-label="প্রধান নেভিগেশন"
        suppressHydrationWarning
      >
        {/* Scroll progress */}
        {isHome && (
          <div
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary via-gold to-primary transition-all duration-150"
            style={{ width: `${scrollProgress * 100}%` }}
            aria-hidden
          />
        )}

        <div className="container mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link href="/" className="flex items-center gap-1.5 group" aria-label="হোমপেজ">
              <div className="w-10 h-10 rounded-[12px] bg-primary flex items-center justify-center text-primary-foreground shrink-0 shadow-md">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-lg sm:text-[22px] font-black tracking-tight text-foreground uppercase ml-1">
                {content.navbar.siteName}
              </span>
            </Link>

            <DesktopNav items={navItems} />

            <div className="hidden lg:flex">
              <GlobalSearch />
            </div>

            <ThemeToggle />
            <UserDropdown user={user} onLogout={handleLogout} />

            <div className="flex items-center gap-1 lg:hidden">
              <GlobalSearch />
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2.5 rounded-xl transition-colors touch-target focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground hover:bg-foreground/5 active:bg-foreground/10"
                aria-label="মেনু খুলুন"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <MobileMenu
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        items={navItems}
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Navbar;
