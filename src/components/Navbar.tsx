"use client";

import { useState, useEffect } from "react";
import { Menu, BookOpen, Search as SearchIcon } from "lucide-react";
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
  const { user, logout } = useAuth();
  const { content } = useSiteContent();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/80 backdrop-blur-md border-b border-border py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo - Minimalist */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-sm text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tighter text-foreground uppercase border-b-2 border-transparent group-hover:border-primary transition-all">
                {content.navbar.siteName}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              <DesktopNav items={content.navbar.links} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-4">
                <GlobalSearch />
                <ThemeToggle />
              </div>

              <UserDropdown user={user} onLogout={handleLogout} />

              <div className="flex items-center lg:hidden">
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-secondary rounded-sm transition-colors active:scale-95"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        items={content.navbar.links}
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Navbar;
