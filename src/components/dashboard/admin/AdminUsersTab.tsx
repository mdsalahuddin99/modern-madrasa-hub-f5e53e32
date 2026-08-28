import { useState } from "react";
import { Users, Trash2 } from "lucide-react";
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

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "সুপার এডমিন",
  INSTITUTION_ADMIN: "পরিচালক",
  USER: "ব্যবহারকারী",
};

interface AdminUsersTabProps {
  searchQuery: string;
}

const AdminUsersTab = ({ searchQuery }: AdminUsersTabProps) => {
  const { toast } = useToast();
  const { allUsers, deleteUser: ctxDeleteUser, changeUserRole } = useAdmin();
  const [deleteTarget, setDeleteTarget] = useState<typeof allUsers[0] | null>(null);

  const filteredUsers = allUsers.filter(u => u.email?.includes(searchQuery));

  const handleDelete = (email: string) => {
    ctxDeleteUser(email);
    setDeleteTarget(null);
    toast({ title: "ব্যবহারকারী মুছে ফেলা হয়েছে" });
  };

  const handleRoleChange = (email: string, newRole: UserRole) => {
    changeUserRole(email, newRole);
    toast({ title: "রোল পরিবর্তন হয়েছে", description: `${email} → ${roleLabels[newRole]}` });
  };

  return (
    <>
      <div className="glass-card rounded-2xl p-5">
        <h2 className="text-base font-bold text-foreground mb-3">
          সকল ব্যবহারকারী ({filteredUsers.length})
        </h2>
        <div className="space-y-2.5">
          {filteredUsers.map((u) => (
            <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-background/60 border border-border/40 gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{u.email}</p>
                  <p className="text-[10px] text-muted-foreground">{roleLabels[u.role]}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Select value={u.role} onValueChange={(val) => handleRoleChange(u.email, val as UserRole)}>
                  <SelectTrigger className="h-7 w-[90px] text-[10px] rounded-lg border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="font-bengali">
                    <SelectItem value="SUPER_ADMIN" className="text-xs">সুপার এডমিন</SelectItem>
                    <SelectItem value="INSTITUTION_ADMIN" className="text-xs">পরিচালক</SelectItem>
                    <SelectItem value="USER" className="text-xs">ব্যবহারকারী</SelectItem>
                  </SelectContent>
                </Select>
                {u.role !== "SUPER_ADMIN" && (
                  <Button size="sm" variant="ghost"
                    className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteTarget(u)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">কোনো ব্যবহারকারী পাওয়া যায়নি</p>
          )}
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="font-bengali max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>ব্যবহারকারী মুছে ফেলবেন?</AlertDialogTitle>
            <AlertDialogDescription>"{deleteTarget?.email}" মুছে ফেলা হবে।</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">বাতিল</AlertDialogCancel>
            <AlertDialogAction className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && handleDelete(deleteTarget.email)}>
              মুছে ফেলুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminUsersTab;
