"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "./admin/AdminSidebar";
import AdminNotifications from "./admin/AdminNotifications";
import { cn } from "@/lib/utils";
import { ShieldCheck, Sparkles } from "lucide-react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-[100svh] flex w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950 font-bengali selection:bg-primary/10">
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Background Decorative Pattern */}
          <div className="absolute inset-0 islamic-pattern opacity-[0.02] pointer-events-none" />

          {/* App Header - Native Style */}
          <header className="h-14 lg:h-16 flex items-center border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl z-30 shadow-sm">
            <div className="flex items-center gap-3 flex-1">
              <SidebarTrigger className="h-10 w-10 rounded-xl bg-secondary/50 border border-border/40 text-foreground active-scale" />

              <div className="flex flex-col lg:flex-row lg:items-center lg:gap-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-xs lg:text-sm font-black text-foreground uppercase tracking-tight">অ্যাডমিন কন্ট্রোল</span>
                </div>
                <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                  <Sparkles className="w-3 h-3" /> সুপার ইউজার
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <AdminNotifications />
              <div className="w-px h-6 bg-border/60 mx-1 hidden sm:block" />
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">ভার্সন</span>
                <span className="text-[10px] font-bold text-foreground">১.০.০-স্টেবল</span>
              </div>
            </div>
          </header>

          {/* Dashboard Main Content */}
          <main className="flex-1 p-5 sm:p-8 lg:p-10 relative z-10 max-w-[1600px] mx-auto w-full">
            <div className="animate-fade-up">
              {children}
            </div>
          </main>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 0.5s ease-out forwards;
        }
      `}</style>
    </SidebarProvider>
  );
};

export default AdminLayout;
