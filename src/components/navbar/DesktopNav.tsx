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
              "px-4 py-2 text-base font-bold rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              active
                ? "text-primary"
                : "text-muted-foreground hover:text-primary",
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
