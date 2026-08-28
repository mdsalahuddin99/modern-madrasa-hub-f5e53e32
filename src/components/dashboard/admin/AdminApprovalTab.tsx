"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Clock, Building2, MapPin, Phone, Users as UsersIcon, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useAdmin } from "@/contexts/AdminContext";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Madrasa as PendingMadrasa } from "@prisma/client";

interface AdminApprovalTabProps {
  searchQuery: string;
}

const AdminApprovalTab = ({ searchQuery }: AdminApprovalTabProps) => {
  const { toast } = useToast();
  const { pendingMadrasas, updateMadrasaStatus } = useAdmin();
  const [viewItem, setViewItem] = useState<PendingMadrasa | null>(null);
  const [rejectTarget, setRejectTarget] = useState<PendingMadrasa | null>(null);

  const filtered = pendingMadrasas.filter(m =>
    m.name.includes(searchQuery) || m.districtId.includes(searchQuery)
  );

  const pendingCount = pendingMadrasas.filter(m => m.status === "PENDING").length;
  const approvedCount = pendingMadrasas.filter(m => m.status === "APPROVED").length;
  const rejectedCount = pendingMadrasas.filter(m => m.status === "REJECTED").length;

  const handleApprove = async (id: string) => {
    await updateMadrasaStatus(id, "APPROVED");
    toast({ title: "✅ মাদ্রাসা অনুমোদিত হয়েছে" });
  };

  const handleReject = async (id: string) => {
    await updateMadrasaStatus(id, "REJECTED");
    setRejectTarget(null);
    toast({ title: "❌ মাদ্রাসা প্রত্যাখ্যান করা হয়েছে" });
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/30"><Clock className="w-3 h-3 mr-1" />অপেক্ষমাণ</Badge>;
      case "APPROVED": return <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30"><CheckCircle2 className="w-3 h-3 mr-1" />অনুমোদিত</Badge>;
      case "REJECTED": return <Badge variant="outline" className="text-[10px] bg-destructive/10 text-destructive border-destructive/30"><XCircle className="w-3 h-3 mr-1" />প্রত্যাখ্যাত</Badge>;
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-center">
          <div className="text-lg font-extrabold text-amber-600">{pendingCount}</div>
          <div className="text-[10px] text-muted-foreground">অপেক্ষমাণ</div>
        </div>
        <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 text-center">
          <div className="text-lg font-extrabold text-primary">{approvedCount}</div>
          <div className="text-[10px] text-muted-foreground">অনুমোদিত</div>
        </div>
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-center">
          <div className="text-lg font-extrabold text-destructive">{rejectedCount}</div>
          <div className="text-[10px] text-muted-foreground">প্রত্যাখ্যাত</div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5">
        <h2 className="text-base font-bold text-foreground mb-3">নিবন্ধন আবেদনসমূহ ({filtered.length})</h2>
        <div className="space-y-2.5">
          {filtered.map(m => (
            <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-background/60 border border-border/40 gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                  {statusBadge(m.status)}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {m.districtId} · {m.category} · জমা: {new Date(m.createdAt).toLocaleDateString("bn-BD")}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg" onClick={() => setViewItem(m)}>
                  <Eye className="w-3.5 h-3.5" />
                </Button>
                {m.status === "PENDING" && (
                  <>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-primary hover:bg-primary/10"
                      onClick={() => handleApprove(m.id)}>
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-destructive hover:bg-destructive/10"
                      onClick={() => setRejectTarget(m)}>
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">কোনো আবেদন পাওয়া যায়নি</p>
          )}
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="font-bengali max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base">{viewItem?.name}</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">{statusBadge(viewItem.status)}</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-muted/50"><span className="text-muted-foreground block mb-0.5">বিভাগ</span><span className="font-medium">{viewItem.divisionId}</span></div>
                <div className="p-2 rounded-lg bg-muted/50"><span className="text-muted-foreground block mb-0.5">জেলা</span><span className="font-medium">{viewItem.districtId}</span></div>
                <div className="p-2 rounded-lg bg-muted/50"><span className="text-muted-foreground block mb-0.5">থানা</span><span className="font-medium">{viewItem.thanaId}</span></div>
                <div className="p-2 rounded-lg bg-muted/50"><span className="text-muted-foreground block mb-0.5">ক্যাটাগরি</span><span className="font-medium">{viewItem.category}</span></div>
                <div className="p-2 rounded-lg bg-muted/50"><span className="text-muted-foreground block mb-0.5">শিক্ষার্থী</span><span className="font-medium">{viewItem.students}</span></div>
                <div className="p-2 rounded-lg bg-muted/50"><span className="text-muted-foreground block mb-0.5">শিক্ষক</span><span className="font-medium">{viewItem.teachers}</span></div>
              </div>
              <div className="p-2 rounded-lg bg-muted/50 text-xs"><span className="text-muted-foreground block mb-0.5">ঠিকানা</span><span>{viewItem.address}</span></div>
              <div className="p-2 rounded-lg bg-muted/50 text-xs"><span className="text-muted-foreground block mb-0.5">ফোন / ইমেইল</span><span>{viewItem.phone} · {viewItem.email}</span></div>
              <div className="p-2 rounded-lg bg-muted/50 text-xs"><span className="text-muted-foreground block mb-0.5">মুহতামিম</span><span>{viewItem.principalName || "দেওয়া হয়নি"}</span></div>
              <div className="p-2 rounded-lg bg-muted/50 text-xs"><span className="text-muted-foreground block mb-0.5">বিবরণ</span><span>{viewItem.description}</span></div>
              {/* Courses and Facilities omitted since they require additional relation fetching */}
              {viewItem.status === "PENDING" && (
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1 rounded-xl gap-1.5 text-xs" onClick={() => { handleApprove(viewItem.id); setViewItem(null); }}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> অনুমোদন
                  </Button>
                  <Button variant="destructive" className="flex-1 rounded-xl gap-1.5 text-xs" onClick={() => { setRejectTarget(viewItem); setViewItem(null); }}>
                    <XCircle className="w-3.5 h-3.5" /> প্রত্যাখ্যান
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation */}
      <AlertDialog open={!!rejectTarget} onOpenChange={() => setRejectTarget(null)}>
        <AlertDialogContent className="font-bengali max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>মাদ্রাসা প্রত্যাখ্যান করবেন?</AlertDialogTitle>
            <AlertDialogDescription>"{rejectTarget?.name}" এর নিবন্ধন আবেদন প্রত্যাখ্যান করা হবে।</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">বাতিল</AlertDialogCancel>
            <AlertDialogAction className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => rejectTarget && handleReject(rejectTarget.id)}>
              প্রত্যাখ্যান করুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminApprovalTab;
