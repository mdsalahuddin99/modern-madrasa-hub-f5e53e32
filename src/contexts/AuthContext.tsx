"use client";

import { createContext, useContext, ReactNode } from "react";
import { signOut, useSession } from "next-auth/react";

export type UserRole = "ADMIN" | "DIRECTOR" | "VISITOR";

export interface MockUser {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
  createdAt: string;
  wizardCompleted?: boolean;
  subscriptionActive?: boolean;
  subscriptionEndDate?: string | null;
}

interface AuthContextType {
  user: MockUser | null;
  isLoading: boolean;
  logout: () => void;
  completeWizard: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();

  let user: MockUser | null = null;

  if (session?.user) {
    user = {
      id: session.user.id || "",
      email: session.user.email || "",
      role: (session.user.role || "VISITOR").toUpperCase() as UserRole,
      createdAt: new Date().toISOString(),
      wizardCompleted: session.user.wizardCompleted ?? false,
      subscriptionActive: session.user.subscriptionActive ?? false,
      subscriptionEndDate: session.user.subscriptionEndDate ?? null,
    };
  }

  const logout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const completeWizard = () => {
    // Dummy implementation for now until Server Actions are hooked up
    console.log("Wizard completed");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading: status === "loading", logout, completeWizard }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
