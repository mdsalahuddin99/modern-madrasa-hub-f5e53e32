"use client";

import { User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface UserDropdownProps {
  user: { email: string } | null;
  onLogout: () => void;
  light?: boolean;
}

const UserDropdown = ({ user, onLogout, light }: UserDropdownProps) => {
  const router = useRouter();

  if (!user) {
    return (
      <div className="hidden lg:flex items-center gap-2.5">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-xs h-9 rounded-xl font-medium touch-target",
            light && "text-white hover:bg-white/10 hover:text-white",
          )}
          onClick={() => router.push("/login")}
          aria-label="লগইন পেজে যান"
        >
          লগইন
        </Button>
        <Button
          size="sm"
          className={cn(
            "text-xs h-9 rounded-xl shimmer-btn shadow-lg transition-shadow duration-300 touch-target",
            light
              ? "bg-white text-foreground hover:bg-white/90 shadow-black/20"
              : "gradient-btn shadow-primary/20 hover:shadow-primary/30 text-primary-foreground",
          )}
          onClick={() => router.push("/signup")}
          aria-label="নিবন্ধন পেজে যান"
        >
          নিবন্ধন
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex items-center gap-2.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-9 rounded-xl gap-2 font-medium text-xs touch-target",
              light && "text-white hover:bg-white/10 hover:text-white",
            )}
            aria-label="ব্যবহারকারী মেনু"
          >
            <div
              className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center",
                light ? "bg-white/15" : "gradient-badge",
              )}
            >
              <User className={cn("w-3.5 h-3.5", light ? "text-white" : "text-primary")} />
            </div>
            <span className="max-w-[100px] truncate">{user.email?.split("@")[0] || "ব্যবহারকারী"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 rounded-xl">
          <DropdownMenuItem
            onClick={() => router.push("/dashboard")}
            className="gap-2 text-xs rounded-lg cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> ড্যাশবোর্ড
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onLogout}
            className="gap-2 text-xs text-destructive rounded-lg cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> লগআউট
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserDropdown;
