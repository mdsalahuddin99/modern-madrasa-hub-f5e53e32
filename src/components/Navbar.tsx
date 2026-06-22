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
          "fixed top-0 left-0 right-0 z-50 safe-top transition-all duration-500",
          lightOnHero
            ? "bg-transparent border-b border-transparent"
            : scrolled
              ? "bg-card/85 backdrop-blur-xl border-b border-border/25 shadow-[0_4px_30px_hsl(var(--foreground)/0.06)]"
              : "bg-card/50 backdrop-blur-lg border-b border-border/15",
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
            <Link href="/" className="flex items-center gap-2 group" aria-label="হোমপেজ">
              <div
                className={cn(
                  "w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300",
                  lightOnHero
                    ? "gradient-btn shadow-black/20"
                    : "gradient-btn shadow-primary/20 group-hover:shadow-primary/30",
                )}
              >
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground" />
              </div>
              <span
                className={cn(
                  "text-sm sm:text-[15px] font-bold tracking-tight transition-colors",
                  lightOnHero ? "text-white" : "text-foreground",
                )}
              >
                {content.navbar.siteName}
              </span>
            </Link>

            <DesktopNav items={navItems} light={lightOnHero} />

            <div className="hidden lg:flex">
              <GlobalSearch light={lightOnHero} />
            </div>

            <ThemeToggle className={lightOnHero ? "[&_button]:text-white [&_button]:hover:bg-white/10" : ""} />
            <UserDropdown user={user} onLogout={handleLogout} light={lightOnHero} />

            <div className="flex items-center gap-1 lg:hidden">
              <GlobalSearch light={lightOnHero} />
              <button
                onClick={() => setDrawerOpen(true)}
                className={cn(
                  "p-2.5 rounded-xl transition-colors touch-target focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  lightOnHero
                    ? "text-white hover:bg-white/10 active:bg-white/15"
                    : "text-foreground hover:bg-foreground/5 active:bg-foreground/10",
                )}
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
