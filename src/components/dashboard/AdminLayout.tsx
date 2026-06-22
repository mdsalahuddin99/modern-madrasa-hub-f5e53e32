"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "./admin/AdminSidebar";
import AdminNotifications from "./admin/AdminNotifications";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-[100svh] flex w-full bg-background font-bengali">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border/40 px-4 sticky top-0 bg-background/80 backdrop-blur-lg z-30">
            <SidebarTrigger className="mr-3" />
            <span className="text-xs text-muted-foreground flex-1">সুপার এডমিন প্যানেল</span>
            <AdminNotifications />
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;

