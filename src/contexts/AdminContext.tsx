"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { MockUser, useAuth } from "@/contexts/AuthContext";
import { Madrasa } from "@/data/madrasas";
import { getPendingMadrasas, savePendingMadrasas, PendingMadrasa } from "@/data/pendingMadrasas";
import { getSubscriptions, saveSubscriptions, MadrasaSubscription, plans } from "@/data/subscriptions";

const USERS_KEY = "qawmi_mock_users";

const getAllUsers = (): MockUser[] => {
  try {
    const data = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
    return Object.values(data).map((entry: any) => entry.user);
  } catch { return []; }
};

interface AdminSummary {
  totalMadrasas: number;
  totalUsers: number;
  totalDirectors: number;
  pendingApprovals: number;
  activeSubscriptions: number;
  pendingSubscriptions: number;
  expiredSubscriptions: number;
  rejectedSubscriptions: number;
}

interface AdminContextType {
  // Data
  allUsers: MockUser[];
  allMadrasas: Madrasa[];
  pendingMadrasas: PendingMadrasa[];
  subscriptions: MadrasaSubscription[];
  summary: AdminSummary;

  // Refresh
  refresh: () => void;
  refreshUsers: () => void;
  refreshMadrasas: () => void;
  refreshPending: () => void;
  refreshSubscriptions: () => void;

  // Actions - Approvals
  approveMadrasa: (id: string) => void;
  rejectMadrasa: (id: string) => void;

  // Actions - Subscriptions
  approveSubscription: (id: string) => void;
  rejectSubscription: (id: string, note?: string) => void;

  // Actions - Users
  deleteUser: (email: string) => void;
  changeUserRole: (email: string, newRole: string) => void;

  // Actions - Madrasas
  deleteMadrasa: (id: string) => void;
  editMadrasa: (id: string, edits: Partial<Madrasa>) => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
};

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [allUsers, setAllUsers] = useState<MockUser[]>([]);
  const [allMadrasas, setAllMadrasas] = useState<Madrasa[]>([]);
  const [pendingMadrasas, setPendingMadrasas] = useState<PendingMadrasa[]>([]);
  const [subscriptions, setSubscriptions] = useState<MadrasaSubscription[]>([]);

  const refreshUsers = useCallback(() => {
    if (!isAdmin) {
      setAllUsers([]);
      return;
    }
    setAllUsers(getAllUsers());
  }, [isAdmin]);

  const refreshMadrasas = useCallback(() => {
    if (!isAdmin) {
      setAllMadrasas([]);
      return;
    }
    void (async () => {
      try {
        const res = await fetch("/api/admin/madrasas", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load madrasas");
        const data = await res.json();
        setAllMadrasas(data.madrasas || []);
      } catch {
        setAllMadrasas([]);
      }
    })();
  }, [isAdmin]);

  const refreshPending = useCallback(() => {
    if (!isAdmin) {
      setPendingMadrasas([]);
      return;
    }
    setPendingMadrasas(getPendingMadrasas());
  }, [isAdmin]);

  const refreshSubscriptions = useCallback(() => {
    if (!isAdmin) {
      setSubscriptions([]);
      return;
    }
    setSubscriptions(getSubscriptions());
  }, [isAdmin]);

  const refresh = useCallback(() => {
    if (!isAdmin) return;
    refreshUsers();
    refreshMadrasas();
    refreshPending();
    refreshSubscriptions();
  }, [isAdmin, refreshUsers, refreshMadrasas, refreshPending, refreshSubscriptions]);

  // Fetch all when admin status changes or on mount
  useEffect(() => { 
    if (isAdmin) {
      refresh(); 
    } else {
      setAllUsers([]);
      setAllMadrasas([]);
      setPendingMadrasas([]);
      setSubscriptions([]);
    }
  }, [isAdmin, refresh]);

  // Summary computed
  const summary: AdminSummary = {
    totalMadrasas: allMadrasas.length,
    totalUsers: allUsers.length,
    totalDirectors: allUsers.filter(u => u.role === "DIRECTOR").length,
    pendingApprovals: pendingMadrasas.filter(m => m.status === "pending").length,
    activeSubscriptions: subscriptions.filter(s => s.status === "active").length,
    pendingSubscriptions: subscriptions.filter(s => s.status === "pending").length,
    expiredSubscriptions: subscriptions.filter(s => s.status === "expired").length,
    rejectedSubscriptions: subscriptions.filter(s => s.status === "rejected").length,
  };

  // -- Approval actions --
  const approveMadrasa = useCallback((id: string) => {
    const data = getPendingMadrasas().map(m =>
      m.id === id ? { ...m, status: "approved" as const, reviewedAt: new Date().toISOString() } : m
    );
    savePendingMadrasas(data);
    refreshPending();
    refreshMadrasas();
  }, [refreshPending, refreshMadrasas]);

  const rejectMadrasa = useCallback((id: string) => {
    const data = getPendingMadrasas().map(m =>
      m.id === id ? { ...m, status: "rejected" as const, reviewedAt: new Date().toISOString() } : m
    );
    savePendingMadrasas(data);
    refreshPending();
  }, [refreshPending]);

  // -- Subscription actions --
  const approveSubscription = useCallback((id: string) => {
    const subs = getSubscriptions();
    const sub = subs.find(s => s.id === id);
    if (!sub) return;
    const startDate = new Date().toISOString();
    const endDate = new Date();
    const plan = plans.find((p) => p.id === sub.planId);
    endDate.setFullYear(endDate.getFullYear() + (plan?.duration || 1));
    endDate.setFullYear(endDate.getFullYear() + (plan?.duration || 1));

    const updated = subs.map(s =>
      s.id === id ? { ...s, status: "active" as const, startDate, endDate: endDate.toISOString(), reviewedAt: new Date().toISOString() } : s
    );
    saveSubscriptions(updated);
    refreshSubscriptions();
  }, [refreshSubscriptions]);

  const rejectSubscription = useCallback((id: string, note?: string) => {
    const updated = getSubscriptions().map(s =>
      s.id === id ? { ...s, status: "rejected" as const, reviewedAt: new Date().toISOString(), reviewNote: note || "" } : s
    );
    saveSubscriptions(updated);
    refreshSubscriptions();
  }, [refreshSubscriptions]);

  // -- User actions --
  const deleteUser = useCallback((email: string) => {
    try {
      const data = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
      delete data[email];
      localStorage.setItem(USERS_KEY, JSON.stringify(data));
      refreshUsers();
    } catch { /* ignore */ }
  }, [refreshUsers]);

  const changeUserRole = useCallback((email: string, newRole: string) => {
    try {
      const data = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
      if (data[email]) {
        data[email].user.role = newRole;
        localStorage.setItem(USERS_KEY, JSON.stringify(data));
        // Also update current auth if same user
        const AUTH_KEY = "qawmi_mock_auth";
        const currentAuth = localStorage.getItem(AUTH_KEY);
        if (currentAuth) {
          const parsed = JSON.parse(currentAuth);
          if (parsed.email === email) {
            parsed.role = newRole;
            localStorage.setItem(AUTH_KEY, JSON.stringify(parsed));
          }
        }
        refreshUsers();
      }
    } catch { /* ignore */ }
  }, [refreshUsers]);

  // -- Madrasa actions --
  const deleteMadrasa = useCallback((id: string) => {
    void (async () => {
      try {
        await fetch(`/api/madrasas/${id}`, { method: "DELETE" });
      } finally {
        refreshMadrasas();
      }
    })();
  }, [refreshMadrasas]);

  const editMadrasa = useCallback((id: string, edits: Partial<Madrasa>) => {
    void (async () => {
      try {
        await fetch(`/api/madrasas/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(edits),
        });
      } finally {
        refreshMadrasas();
      }
    })();
  }, [refreshMadrasas]);

  return (
    <AdminContext.Provider value={{
      allUsers, allMadrasas, pendingMadrasas, subscriptions, summary,
      refresh, refreshUsers, refreshMadrasas, refreshPending, refreshSubscriptions,
      approveMadrasa, rejectMadrasa,
      approveSubscription, rejectSubscription,
      deleteUser, changeUserRole,
      deleteMadrasa, editMadrasa,
    }}>
      {children}
    </AdminContext.Provider>
  );
};
