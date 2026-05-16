"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  completeWizard: () => void;
  activateSubscription: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "qawmi_mock_auth";
const USERS_KEY = "qawmi_mock_users";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (status === "loading") return;

    // Keep legacy context in sync with NextAuth session.
    if (session?.user) {
      const role = (session.user.role || "VISITOR").toUpperCase() as UserRole;
      const syncedUser: MockUser = {
        id: session.user.id || "",
        email: session.user.email || "",
        role,
        createdAt: new Date().toISOString(),
        wizardCompleted: session.user.wizardCompleted ?? false,
        subscriptionActive: session.user.subscriptionActive ?? false,
        subscriptionEndDate: session.user.subscriptionEndDate ?? null,
      };
      persistUser(syncedUser);
      setIsLoading(false);
      return;
    }

    persistUser(null);
    setIsLoading(false);
  }, [session, status]);

  const persistUser = (u: MockUser | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const getUsers = (): Record<string, { user: MockUser; password: string }> => {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || "{}"); } catch { return {}; }
  };

  const signup = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    const users = getUsers();
    if (users[email]) return { success: false, error: "এই ইমেইল দিয়ে আগে থেকে অ্যাকাউন্ট আছে" };

    const newUser: MockUser = {
      id: crypto.randomUUID(),
      email,
      role: email === "admin@test.com" ? "ADMIN" : email === "director@test.com" ? "DIRECTOR" : "VISITOR",
      createdAt: new Date().toISOString(),
      wizardCompleted: false,
      subscriptionActive: false,
    };
    users[email] = { user: newUser, password };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    persistUser(newUser);
    return { success: true };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    const users = getUsers();
    const entry = users[email];
    if (!entry || entry.password !== password) return { success: false, error: "ইমেইল বা পাসওয়ার্ড ভুল" };
    persistUser(entry.user);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    persistUser(null);
    signOut({ callbackUrl: "/login" });
  }, []);

  const completeWizard = useCallback(() => {
    if (!user) return;
    const updated = { ...user, wizardCompleted: true };
    const users = getUsers();
    if (users[user.email]) users[user.email].user = updated;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    persistUser(updated);
  }, [user]);

  const activateSubscription = useCallback(() => {
    if (!user) return;
    const updated = { ...user, subscriptionActive: true };
    const users = getUsers();
    if (users[user.email]) users[user.email].user = updated;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    persistUser(updated);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, completeWizard, activateSubscription }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
