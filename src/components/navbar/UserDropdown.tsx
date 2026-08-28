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
}

const UserDropdown = ({ user, onLogout }: UserDropdownProps) => {
  const router = useRouter();

  if (!user) {
    return (
      <div className="hidden lg:flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="text-[14px] h-[42px] px-6 rounded-lg font-extrabold border-border hover:bg-muted touch-target"
          onClick={() => router.push("/login")}
          aria-label="লগইন পেজে যান"
        >
          লগইন
        </Button>
        <Button
          size="sm"
          className="text-[14px] h-[42px] px-6 rounded-lg font-extrabold shadow-none touch-target transition-all bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
          onClick={() => router.push("/signup")}
          aria-label="রেজিস্ট্রেশন পেজে যান"
        >
          রেজিস্ট্রেশন
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
            className="h-9 rounded-xl gap-2 font-medium text-xs touch-target"
            aria-label="ব্যবহারকারী মেনু"
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center gradient-badge">
              <User className="w-3.5 h-3.5 text-primary" />
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
