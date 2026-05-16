"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/dashboard/AdminLayout";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Admin users use the AdminLayout (with sidebar)
  if (user.role?.toUpperCase() === "ADMIN") {
    return <AdminLayout>{children}</AdminLayout>;
  }

  // Director and other users use a layout with a standard Navbar
  return (
    <div className="min-h-screen bg-background font-bengali">
      <Navbar />
      <div className="pt-20">
        {children}
      </div>
    </div>
  );
}
