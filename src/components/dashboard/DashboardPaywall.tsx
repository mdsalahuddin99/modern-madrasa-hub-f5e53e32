"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface DashboardPaywallProps {
  isLocked: boolean;
  children: React.ReactNode;
  className?: string;
  message?: string;
}

export const DashboardPaywall = ({
  isLocked,
  children,
  className,
  message = "এই মডিউলটি ব্যবহার করতে সাবস্ক্রিপশন প্রয়োজন"
}: DashboardPaywallProps) => {
  const router = useRouter();

  if (!isLocked) return <div className={className}>{children}</div>;

  return (
    <div className={cn("relative group cursor-pointer overflow-hidden rounded-lg", className)} onClick={() => router.push("/subscription")}>
      {/* Content with Blur */}
      <div className="filter blur-[3px] pointer-events-none select-none grayscale-[0.3]">
        {children}
      </div>

      {/* Lock Overlay */}
      <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 transition-all group-hover:bg-background/50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-16 h-16 rounded-lg bg-card border border-border/40 shadow-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
        >
          <Lock className="w-8 h-8 text-primary animate-pulse" />
        </motion.div>
        
        <div className="text-center">
          <h3 className="text-sm font-bold text-foreground mb-1">প্রিমিয়াম ফিচার</h3>
          <p className="text-[11px] text-muted-foreground max-w-[200px] leading-relaxed">
            {message}
          </p>
        </div>

        {/* Floating "Upgrade" Badge */}
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg">
          UPGRADE
        </div>
      </div>
    </div>
  );
};
