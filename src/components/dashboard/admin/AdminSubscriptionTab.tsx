import { useState } from "react";
import { CheckCircle2, XCircle, Clock, Eye, CreditCard, Phone, Calendar, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/contexts/AdminContext";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { plans, formatBDT } from "@/data/subscriptions";
import { Subscription } from "@prisma/client";
type MadrasaSubscription = Subscription & { madrasa?: any; plan?: any; user?: any; };

interface AdminSubscriptionTabProps {
  searchQuery: string;
}

const AdminSubscriptionTab = ({ searchQuery }: AdminSubscriptionTabProps) => {
  const { toast } = useToast();
  const { subscriptions, approveSubscription, rejectSubscription, summary } = useAdmin();
  const [viewItem, setViewItem] = useState<MadrasaSubscription | null>(null);
  const [rejectTarget, setRejectTarget] = useState<MadrasaSubscription | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  const filtered = subscriptions.filter(s =>
    s.madrasa?.name?.includes(searchQuery) || s.transactionId.includes(searchQuery) || s.payerPhone.includes(searchQuery)
  );

  const handleApprove = (id: string) => {
    approveSubscription(id);
    setViewItem(null);
    toast({ title: "✅ সাবস্ক্রিপশন অনুমোদিত হয়েছে" });
  };

  const handleReject = (id: string) => {
    rejectSubscription(id, rejectNote);
    setRejectTarget(null);
    setRejectNote("");
    toast({ title: "❌ সাবস্ক্রিপশন প্রত্যাখ্যান করা হয়েছে" });
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/30"><Clock className="w-3 h-3 mr-1" />অপেক্ষমাণ</Badge>;
      case "ACTIVE": return <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30"><CheckCircle2 className="w-3 h-3 mr-1" />সক্রিয়</Badge>;
      case "EXPIRED": return <Badge variant="outline" className="text-[10px] bg-muted text-muted-foreground border-border"><AlertTriangle className="w-3 h-3 mr-1" />মেয়াদোত্তীর্ণ</Badge>;
      case "REJECTED": return <Badge variant="outline" className="text-[10px] bg-destructive/10 text-destructive border-destructive/30"><XCircle className="w-3 h-3 mr-1" />প্রত্যাখ্যাত</Badge>;
    }
  };

  const paymentLabel = (method: string) => {
    switch (method) { case "bkash": return "বিকাশ"; case "nagad": return "নগদ"; case "rocket": return "রকেট"; case "bank": return "ব্যাংক ট্রান্সফার"; default: return method; }
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-center">
          <div className="text-lg font-extrabold text-amber-600">{summary.pendingSubscriptions}</div>
          <div className="text-[10px] text-muted-foreground">অপেক্ষমাণ</div>
        </div>
        <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 text-center">
          <div className="text-lg font-extrabold text-primary">{summary.activeSubscriptions}</div>
          <div className="text-[10px] text-muted-foreground">সক্রিয়</div>
        </div>
        <div className="rounded-xl bg-muted border border-border p-3 text-center">
          <div className="text-lg font-extrabold text-muted-foreground">{summary.expiredSubscriptions}</div>
          <div className="text-[10px] text-muted-foreground">মেয়াদোত্তীর্ণ</div>
        </div>
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-center">
          <div className="text-lg font-extrabold text-destructive">{summary.rejectedSubscriptions}</div>
          <div className="text-[10px] text-muted-foreground">প্রত্যাখ্যাত</div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5">
        <h2 className="text-base font-bold text-foreground mb-3">পেমেন্ট আবেদনসমূহ ({filtered.length})</h2>
        <div className="space-y-2.5">
          {filtered.map(s => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-background/60 border border-border/40 gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="text-sm font-medium text-foreground truncate">{s.madrasa?.name || "অজানা মাদ্রাসা"}</p>
                  {statusBadge(s.status)}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {paymentLabel(s.paymentMethod)} · TxID: {s.transactionId} · {new Date(s.submittedAt).toLocaleDateString("bn-BD")}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg" onClick={() => setViewItem(s)}>
                  <Eye className="w-3.5 h-3.5" />
                </Button>
                {s.status === "PENDING" && (
                  <>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-primary hover:bg-primary/10" onClick={() => handleApprove(s.id)}>
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-destructive hover:bg-destructive/10" onClick={() => setRejectTarget(s)}>
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">কোনো পেমেন্ট আবেদন পাওয়া যায়নি</p>
          )}
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="font-bengali max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-base">পেমেন্ট বিস্তারিত</DialogTitle></DialogHeader>
          {viewItem && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">{statusBadge(viewItem.status)}</div>
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-base font-bold text-foreground mb-1">{viewItem.madrasa?.name || "অজানা মাদ্রাসা"}</p>
                <p className="text-xs text-muted-foreground">
                  প্ল্যান: {plans.find(p => p.id === viewItem.planId)?.name || viewItem.planId}
                  {" · "}মূল্য: {formatBDT(plans.find(p => p.id === viewItem.planId)?.totalPrice || 0)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-muted/50"><span className="text-muted-foreground flex items-center gap-1 mb-0.5"><CreditCard className="w-3 h-3" /> পেমেন্ট</span><span className="font-medium">{paymentLabel(viewItem.paymentMethod)}</span></div>
                <div className="p-2.5 rounded-lg bg-muted/50"><span className="text-muted-foreground block mb-0.5">TxID</span><span className="font-medium font-mono text-[11px]">{viewItem.transactionId}</span></div>
                <div className="p-2.5 rounded-lg bg-muted/50"><span className="text-muted-foreground flex items-center gap-1 mb-0.5"><Phone className="w-3 h-3" /> ফোন</span><span className="font-medium">{viewItem.payerPhone}</span></div>
                <div className="p-2.5 rounded-lg bg-muted/50"><span className="text-muted-foreground flex items-center gap-1 mb-0.5"><Calendar className="w-3 h-3" /> তারিখ</span><span className="font-medium">{new Date(viewItem.submittedAt).toLocaleDateString("bn-BD")}</span></div>
              </div>
              {viewItem.status === "ACTIVE" && viewItem.startDate && viewItem.endDate && (
                <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 text-xs">
                  <span className="text-muted-foreground block mb-0.5">মেয়াদ</span>
                  <span className="font-medium">{new Date(viewItem.startDate).toLocaleDateString("bn-BD")} — {new Date(viewItem.endDate).toLocaleDateString("bn-BD")}</span>
                </div>
              )}
              {viewItem.reviewNote && (
                <div className="p-2.5 rounded-lg bg-destructive/5 border border-destructive/20 text-xs">
                  <span className="text-destructive block mb-0.5">কারণ</span><span>{viewItem.reviewNote}</span>
                </div>
              )}
              {viewItem.status === "PENDING" && (
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1 rounded-xl gap-1.5 text-xs" onClick={() => handleApprove(viewItem.id)}>
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

      {/* Reject */}
      <AlertDialog open={!!rejectTarget} onOpenChange={() => setRejectTarget(null)}>
        <AlertDialogContent className="font-bengali max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>পেমেন্ট প্রত্যাখ্যান করবেন?</AlertDialogTitle>
            <AlertDialogDescription>"{rejectTarget?.madrasa?.name || "এই মাদ্রাসা"}" এর পেমেন্ট প্রত্যাখ্যান করা হবে।</AlertDialogDescription>
          </AlertDialogHeader>
          <Input placeholder="কারণ (ঐচ্ছিক)..." value={rejectNote} onChange={e => setRejectNote(e.target.value)} className="rounded-xl" />
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

export default AdminSubscriptionTab;
