import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardLayoutClient from "@/app/dashboard/DashboardLayoutClient";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Admin layout is handled by src/app/dashboard/admin/layout.tsx
  // We use a client component wrapper to conditionally render the Navbar based on pathname
  return (
    <DashboardLayoutClient>
      {children}
    </DashboardLayoutClient>
  );
}
