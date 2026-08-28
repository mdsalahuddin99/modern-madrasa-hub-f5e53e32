"use client";

import { createContext, useContext, ReactNode } from "react";
import { Madrasa, Subscription, User } from "@prisma/client";
// We use Madrasa and Subscription directly from Prisma now.
// However, if the frontend expects `PendingMadrasa` or `MadrasaSubscription`, we should alias or map them.
type PendingMadrasa = Madrasa & { verification?: any };
type AdminMadrasa = Madrasa & { verification?: any };
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
  allMadrasas: AdminMadrasa[];
  pendingMadrasas: PendingMadrasa[];
  subscriptions: MadrasaSubscription[];
  summary: AdminSummary;

  // Actions (will be refactored to Server Actions later)
  updateMadrasaStatus: (id: string, status: "APPROVED" | "REJECTED" | "SUSPENDED" | "PENDING") => Promise<void>;
  updateVerificationStatus: (id: string, status: "VERIFIED" | "REJECTED" | "PENDING", notes?: string) => Promise<void>;
  toggleFeatured: (id: string, featured: boolean) => Promise<void>;

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
  updateMadrasaStatusAction,
  updateVerificationStatusAction,
  toggleFeaturedAction,
  approveSubscriptionAction,
  rejectSubscriptionAction,
  deleteUserAction,
  changeUserRoleAction
} from "@/actions/admin.actions";

export const AdminProvider = ({ children, initialData }: { children: ReactNode; initialData?: any }) => {

  const deleteMadrasa = async (id: string) => { await deleteMadrasaAction(id); };
  const editMadrasa = async (id: string, edits: Partial<Madrasa>) => { await editMadrasaAction(id, edits); };

  const updateMadrasaStatus = async (id: string, status: any) => { await updateMadrasaStatusAction(id, status); };
  const updateVerificationStatus = async (id: string, status: any, notes?: string) => { await updateVerificationStatusAction(id, status, notes); };
  const toggleFeatured = async (id: string, featured: boolean) => { await toggleFeaturedAction(id, featured); };
  
  const approveSubscription = async (id: string) => { await approveSubscriptionAction(id); };
  const rejectSubscription = async (id: string, note?: string) => { await rejectSubscriptionAction(id, note); };
  const deleteUser = async (email: string) => { await deleteUserAction(email); };
  const changeUserRole = async (email: string, newRole: string) => { await changeUserRoleAction(email, newRole as "SUPER_ADMIN" | "INSTITUTION_ADMIN"); };

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
      updateMadrasaStatus, updateVerificationStatus, toggleFeatured,
      approveSubscription, rejectSubscription,
      deleteUser, changeUserRole,
      deleteMadrasa, editMadrasa,
    }}>
      {children}
    </AdminContext.Provider>
  );
};
