"use client";

import { motion } from "framer-motion";
import { LogOut, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardHeaderProps {
  email: string | undefined;
  onLogout: () => void;
}

export const DashboardHeader = ({ email, onLogout }: DashboardHeaderProps) => {
  const { user } = useAuth();
  const isSubscriptionActive = user?.subscriptionActive;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5 tracking-wide uppercase font-bold">Director Dashboard</p>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">আসসালামু আলাইকুম</h1>
            {isSubscriptionActive ? (
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 gap-1 rounded-full px-2.5">
                <ShieldCheck className="w-3 h-3" /> Premium
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground border-border/60 gap-1 rounded-full px-2.5">
                <AlertCircle className="w-3 h-3" /> Free
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onLogout} className="gap-1.5 rounded-xl h-9 text-xs border-border/60">
            <LogOut className="w-3.5 h-3.5" /> লগআউট
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
