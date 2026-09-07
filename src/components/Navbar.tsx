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
          (scrolled || !isHome)
            ? "bg-white/95 backdrop-blur-md border-b border-black/5 shadow-sm"
            : "bg-transparent",
          // স্ট্যাটাস বার থেকে নিচে নামানোর জন্য প্যাডিং (env safe area + fallback)
          // lg:pt-0 দিয়ে ডেস্কটপে প্যাডিং সরানো হলো
          "pt-[calc(env(safe-area-inset-top,0px)+1rem)] lg:pt-0"
        )}
      >
        <div className={cn(
          "container mx-auto px-6 max-w-7xl transition-all duration-300",
          // মোবাইলে একটু প্যাডিং এবং ডেস্কটপে স্বাভাবিক প্যাডিং
          scrolled ? "py-3" : "pt-4 pb-4 lg:pt-6 lg:pb-6"
        )}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-primary flex items-center justify-center rounded-xl text-white shadow-sm shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-foreground font-kalpurush">
                {content.navbar.siteName}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <DesktopNav items={content.navbar.links} />

            {/* Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:block">
                <GlobalSearch />
              </div>
              <UserDropdown user={user} onLogout={handleLogout} />
              <div className="flex items-center lg:hidden">
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-secondary rounded-full transition-colors active:scale-95"
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
