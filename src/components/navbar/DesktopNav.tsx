"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

interface DesktopNavProps {
  items: NavItem[];
  light?: boolean;
}

const DesktopNav = ({ items, light }: DesktopNavProps) => {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex items-center gap-0.5">
      {items.map((item) => {
        const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "px-4 py-2 text-[13px] font-medium rounded-xl transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              light
                ? active
                  ? "text-white bg-white/15"
                  : "text-white/70 hover:text-white hover:bg-white/10"
                : active
                  ? "text-primary bg-primary/10 font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};

export default DesktopNav;
