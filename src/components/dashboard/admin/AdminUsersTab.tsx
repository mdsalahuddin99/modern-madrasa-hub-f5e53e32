"use client";

import { useState } from "react";
import { Users, Trash2, ShieldCheck, UserCog, User, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/contexts/AuthContext";
import { useAdmin } from "@/contexts/AdminContext";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn, toBn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const roleConfigs: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  SUPER_ADMIN: { label: "সুপার এডমিন", icon: ShieldCheck, color: "text-accent", bg: "bg-accent/10" },
  INSTITUTION_ADMIN: { label: "পরিচালক", icon: UserCog, color: "text-primary", bg: "bg-primary/5" },
  USER: { label: "ব্যবহারকারী", icon: User, color: "text-muted-foreground", bg: "bg-secondary/50" },
};

interface AdminUsersTabProps {
  searchQuery: string;
}

const AdminUsersTab = ({ searchQuery }: AdminUsersTabProps) => {
  const { toast } = useToast();
  const { allUsers, deleteUser: ctxDeleteUser, changeUserRole } = useAdmin();
  const [deleteTarget, setDeleteTarget] = useState<typeof allUsers[0] | null>(null);

  const filteredUsers = allUsers.filter(u =>
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (email: string) => {
    ctxDeleteUser(email);
    setDeleteTarget(null);
    toast({ title: "ব্যবহারকারী মুছে ফেলা হয়েছে" });
  };

  const handleRoleChange = (email: string, newRole: UserRole) => {
    changeUserRole(email, newRole);
    toast({
      title: "রোল পরিবর্তন সফল",
      description: `${email} এখন একজন ${roleConfigs[newRole].label}`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between px-2">
         <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-primary rounded-full shadow-sm" />
            <h2 className="text-xl font-black text-foreground tracking-tight">
              সকল ব্যবহারকারী
            </h2>
         </div>
         <div className="bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
            <span className="text-[10px] font-black text-primary uppercase tracking-tighter">
              মোট {toBn(filteredUsers.length)} জন
            </span>
         </div>
      </div>

      {/* User Grid - Premium Native Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredUsers.map((u, i) => {
            const role = roleConfigs[u.role] || roleConfigs.USER;
            const Icon = role.icon;

            return (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-[2rem] border border-border/40 shadow-soft p-5 lg:p-6 flex items-center justify-between gap-4 group hover:border-primary/20 transition-all active-scale"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Avatar Wrapper */}
                  <div className={cn(
                    "w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105",
                    role.bg
                  )}>
                    <Icon className={cn("w-6 h-6", role.color)} strokeWidth={2.5} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm lg:text-base font-black text-foreground truncate">
                      {u.name || u.email.split('@')[0]}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                       <p className="text-[10px] font-bold text-muted-foreground truncate max-w-[120px]">{u.email}</p>
                       <div className="w-1 h-1 rounded-full bg-border" />
                       <span className={cn("text-[9px] font-black uppercase tracking-widest", role.color)}>
                         {role.label}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Role Switcher */}
                  <Select value={u.role} onValueChange={(val) => handleRoleChange(u.email, val as UserRole)}>
                    <SelectTrigger className="h-9 w-[110px] text-[10px] font-black uppercase tracking-tighter rounded-xl bg-secondary/40 border-none active-scale">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border/40 shadow-xl">
                      <SelectItem value="SUPER_ADMIN" className="text-xs font-bold text-accent">সুপার এডমিন</SelectItem>
                      <SelectItem value="INSTITUTION_ADMIN" className="text-xs font-bold text-primary">পরিচালক</SelectItem>
                      <SelectItem value="USER" className="text-xs font-bold text-muted-foreground">ব্যবহারকারী</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Delete Action */}
                  {u.role !== "SUPER_ADMIN" && (
                    <button
                      onClick={() => setDeleteTarget(u)}
                      className="w-9 h-9 rounded-xl bg-destructive/5 text-destructive border border-destructive/10 flex items-center justify-center active-scale hover:bg-destructive hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredUsers.length === 0 && (
          <div className="col-span-full text-center py-20 bg-card rounded-[2.5rem] border-2 border-dashed border-border/40">
            <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4 opacity-40">
               <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-bold text-muted-foreground">কোনো ব্যবহারকারী পাওয়া যায়নি</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="font-bengali rounded-[2.5rem] p-8 shadow-2xl border-none">
          <AlertDialogHeader>
            <div className="w-16 h-16 bg-destructive/10 rounded-[1.5rem] flex items-center justify-center text-destructive mb-4">
               <Trash2 className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <AlertDialogTitle className="text-2xl font-black text-foreground leading-tight">ব্যবহারকারী মুছে ফেলবেন?</AlertDialogTitle>
            <AlertDialogDescription className="text-base font-medium mt-3">
               আপনি কি নিশ্চিতভাবে <span className="text-primary font-black">"{deleteTarget?.email}"</span> মুছে ফেলতে চান? এটি করার পর ইউজার আর লগইন করতে পারবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="h-12 rounded-xl font-black text-xs uppercase tracking-widest border-border/60 active-scale">বাতিল</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && handleDelete(deleteTarget.email)}
              className="h-12 rounded-xl bg-destructive text-white font-black text-xs uppercase tracking-widest active-scale shadow-lg shadow-destructive/20 hover:bg-destructive"
            >
              মুছে ফেলুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUsersTab;
