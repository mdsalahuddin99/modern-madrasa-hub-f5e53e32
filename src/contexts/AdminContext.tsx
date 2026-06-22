"use client";

import { createContext, useContext, ReactNode } from "react";
import { Madrasa, Subscription, User } from "@prisma/client";
// We use Madrasa and Subscription directly from Prisma now.
// However, if the frontend expects `PendingMadrasa` or `MadrasaSubscription`, we should alias or map them.
type PendingMadrasa = Madrasa;
type MadrasaSubscription = Subscription & { plan?: any; user?: any; madrasa?: any };


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
  allUsers: User[];
  allMadrasas: Madrasa[];
  pendingMadrasas: PendingMadrasa[];
  subscriptions: MadrasaSubscription[];
  summary: AdminSummary;

  // Actions (will be refactored to Server Actions later)
  approveMadrasa: (id: string) => void;
  rejectMadrasa: (id: string) => void;

  approveSubscription: (id: string) => void;
  rejectSubscription: (id: string, note?: string) => void;

  deleteUser: (email: string) => void;
  changeUserRole: (email: string, newRole: string) => void;

  deleteMadrasa: (id: string) => void;
  editMadrasa: (id: string, edits: Partial<Madrasa>) => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
};

import { deleteMadrasaAction, editMadrasaAction } from "@/actions/madrasa.actions";
import {
  approveMadrasaAction,
  rejectMadrasaAction,
  approveSubscriptionAction,
  rejectSubscriptionAction,
  deleteUserAction,
  changeUserRoleAction
} from "@/actions/admin.actions";

export const AdminProvider = ({ children, initialData }: { children: ReactNode; initialData?: any }) => {

  const deleteMadrasa = async (id: string) => {
    await deleteMadrasaAction(id);
  };

  const editMadrasa = async (id: string, edits: Partial<Madrasa>) => {
    await editMadrasaAction(id, edits);
  };

  const approveMadrasa = async (id: string) => { await approveMadrasaAction(id); };
  const rejectMadrasa = async (id: string) => { await rejectMadrasaAction(id); };
  const approveSubscription = async (id: string) => { await approveSubscriptionAction(id); };
  const rejectSubscription = async (id: string, note?: string) => { await rejectSubscriptionAction(id, note); };
  const deleteUser = async (email: string) => { await deleteUserAction(email); };
  const changeUserRole = async (email: string, newRole: string) => { await changeUserRoleAction(email, newRole as "ADMIN" | "DIRECTOR"); };

  return (
    <AdminContext.Provider value={{
      allUsers: initialData?.allUsers || [],
      allMadrasas: initialData?.allMadrasas || [],
      pendingMadrasas: initialData?.pendingMadrasas || [],
      subscriptions: initialData?.subscriptions || [],
      summary: initialData?.summary || {
        totalMadrasas: 0, totalUsers: 0, totalDirectors: 0,
        pendingApprovals: 0, activeSubscriptions: 0, pendingSubscriptions: 0,
        expiredSubscriptions: 0, rejectedSubscriptions: 0,
      },
      approveMadrasa, rejectMadrasa,
      approveSubscription, rejectSubscription,
      deleteUser, changeUserRole,
      deleteMadrasa, editMadrasa,
    }}>
      {children}
    </AdminContext.Provider>
  );
};
