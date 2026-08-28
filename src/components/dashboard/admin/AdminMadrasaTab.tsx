"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2, Edit3, Save, X, Plus, ShieldCheck, Star, FileText, CheckCircle2, Ban, PauseCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Madrasa, divisions, categories, boards, districtsByDivision } from "@/data/madrasas";
import { thanasByDistrict } from "@/data/thanas";
import { useAdmin } from "@/contexts/AdminContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

interface AdminMadrasaTabProps {
  searchQuery: string;
}

const statusMap = {
  "PENDING": { label: "অপেক্ষমান", color: "bg-orange-500/10 text-orange-500", icon: Clock },
  "APPROVED": { label: "অনুমোদিত", color: "bg-emerald-500/10 text-emerald-500", icon: CheckCircle2 },
  "REJECTED": { label: "বাতিল", color: "bg-red-500/10 text-red-500", icon: Ban },
  "SUSPENDED": { label: "স্থগিত", color: "bg-stone-500/10 text-stone-500", icon: PauseCircle },
};

export default function AdminMadrasaTab({ searchQuery }: AdminMadrasaTabProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { allMadrasas, deleteMadrasa, updateMadrasaStatus, updateVerificationStatus, toggleFeatured } = useAdmin();

  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED">("ALL");
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  
  // Verification Modal State
  const [verifyingMadrasa, setVerifyingMadrasa] = useState<any | null>(null);
  const [verifyNotes, setVerifyNotes] = useState("");

  const filtered = allMadrasas.filter(m => {
    const matchesSearch = m.name.includes(searchQuery) || (m.districtId && m.districtId.includes(searchQuery));
    const matchesTab = activeTab === "ALL" || m.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleDelete = (madrasa: any) => {
    deleteMadrasa(madrasa.id);
    setDeleteTarget(null);
    toast({ title: "মাদ্রাসা মুছে ফেলা হয়েছে", description: madrasa.name });
  };

  const handleStatusChange = async (id: string, status: any) => {
    await updateMadrasaStatus(id, status);
    toast({ title: "স্ট্যাটাস আপডেট করা হয়েছে" });
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    await toggleFeatured(id, featured);
    toast({ title: featured ? "Featured করা হয়েছে" : "Featured থেকে সরানো হয়েছে" });
  };

  const openVerificationModal = (madrasa: any) => {
    setVerifyingMadrasa(madrasa);
    setVerifyNotes(madrasa.verification?.notes || "");
  };

  const submitVerification = async (status: "VERIFIED" | "REJECTED" | "PENDING") => {
    if (!verifyingMadrasa) return;
    await updateVerificationStatus(verifyingMadrasa.id, status, verifyNotes);
    setVerifyingMadrasa(null);
    toast({ title: "ভেরিফিকেশন স্ট্যাটাস আপডেট হয়েছে" });
  };

  return (
    <>
      <div className="glass-card rounded-2xl p-5">
        
        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(["ALL", "PENDING", "APPROVED", "REJECTED", "SUSPENDED"] as const).map(tab => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              size="sm"
              className={`rounded-xl text-xs ${activeTab === tab ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "ALL" ? "সকল" : statusMap[tab].label}
              <Badge variant="secondary" className="ml-2 bg-background/20 px-1.5 py-0">
                {tab === "ALL" ? allMadrasas.length : allMadrasas.filter(m => m.status === tab).length}
              </Badge>
            </Button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map(m => {
            const StatusIcon = statusMap[m.status as keyof typeof statusMap]?.icon || Clock;
            const isVerified = m.verification?.status === "VERIFIED";

            return (
              <div key={m.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-background/60 border border-border/40 gap-4">
                
                {/* Left: Info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-muted border border-border/50">
                    {m.image ? (
                      <Image src={m.image} alt={m.name} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground">{m.name.slice(0, 2)}</div>
                    )}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-foreground truncate">{m.name}</p>
                      {isVerified && <span title="Verified"><ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" /></span>}
                      {m.featured && <span title="Featured"><Star className="w-4 h-4 text-gold fill-gold flex-shrink-0" /></span>}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className={`text-[10px] border-0 px-2 py-0.5 ${statusMap[m.status as keyof typeof statusMap]?.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusMap[m.status as keyof typeof statusMap]?.label}
                      </Badge>
                      <span>{m.districtId}</span>
                      <span>·</span>
                      <span>{m.category}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center gap-3 md:gap-4 flex-shrink-0">
                  
                  {/* Status Dropdown */}
                  <Select value={m.status} onValueChange={(val) => handleStatusChange(m.id, val)}>
                    <SelectTrigger className="h-8 rounded-lg text-xs w-[120px] bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">অপেক্ষমান</SelectItem>
                      <SelectItem value="APPROVED">অনুমোদিত</SelectItem>
                      <SelectItem value="REJECTED">বাতিল</SelectItem>
                      <SelectItem value="SUSPENDED">স্থগিত</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="w-px h-6 bg-border/60 mx-1 hidden md:block"></div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-1">
                    <Button 
                      size="sm" variant="ghost" 
                      className={`h-8 px-2 rounded-lg gap-1.5 ${isVerified ? 'text-emerald-500 hover:text-emerald-600' : 'text-muted-foreground'}`}
                      onClick={() => openVerificationModal(m)}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span className="hidden lg:inline text-xs">{isVerified ? "Verified" : "Verify"}</span>
                    </Button>
                    
                    <div className="flex items-center gap-1.5 mx-2" title="Featured Toggle">
                      <Star className={`w-3.5 h-3.5 ${m.featured ? 'text-gold fill-gold' : 'text-muted-foreground'}`} />
                      <Switch 
                        checked={m.featured} 
                        onCheckedChange={(checked) => handleToggleFeatured(m.id, checked)}
                        className="scale-75 data-[state=checked]:bg-gold"
                      />
                    </div>

                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg" onClick={() => router.push(`/madrasas/${m.slug}`)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setDeleteTarget(m)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 border border-dashed border-border/50 rounded-2xl">
              <p className="text-sm text-muted-foreground">কোনো মাদ্রাসা পাওয়া যায়নি</p>
            </div>
          )}
        </div>
      </div>

      {/* Verification Modal */}
      <Dialog open={!!verifyingMadrasa} onOpenChange={() => setVerifyingMadrasa(null)}>
        <DialogContent className="font-bengali max-w-xl">
          <DialogHeader>
            <DialogTitle>ভেরিফিকেশন রিভিউ — {verifyingMadrasa?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 my-4">
            {verifyingMadrasa?.verification?.documentUrl ? (
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-sm">ডকুমেন্ট আপলোড করা হয়েছে</h4>
                </div>
                <a 
                  href={verifyingMadrasa.verification.documentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline ml-8"
                >
                  ডকুমেন্ট দেখুন (New Tab)
                </a>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-muted-foreground/30 bg-muted/30 text-center">
                <p className="text-sm text-muted-foreground">কোনো ভেরিফিকেশন ডকুমেন্ট আপলোড করা হয়নি</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">অ্যাডমিন নোটস (Internal)</label>
              <Textarea 
                value={verifyNotes}
                onChange={(e) => setVerifyNotes(e.target.value)}
                placeholder="ভেরিফিকেশন সংক্রান্ত কোনো নোট থাকলে লিখুন..."
                className="rounded-xl min-h-[100px]"
              />
            </div>
            
            {verifyingMadrasa?.verification?.verifiedAt && (
              <div className="text-xs text-muted-foreground">
                <p>সর্বশেষ আপডেট: {new Date(verifyingMadrasa.verification.verifiedAt).toLocaleString('bn-BD')}</p>
                <p>আপডেট করেছেন: {verifyingMadrasa.verification.verifiedBy}</p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            <Button variant="outline" onClick={() => setVerifyingMadrasa(null)} className="rounded-xl">
              বাতিল
            </Button>
            <div className="flex items-center gap-2">
              <Button 
                variant="destructive" 
                onClick={() => submitVerification("REJECTED")} 
                className="rounded-xl"
              >
                রিজেক্ট
              </Button>
              <Button 
                variant="default" 
                onClick={() => submitVerification("VERIFIED")} 
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
              >
                ভেরিফাই করুন
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="font-bengali max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>মাদ্রাসা মুছে ফেলবেন?</AlertDialogTitle>
            <AlertDialogDescription>"{deleteTarget?.name}" মুছে ফেলা হবে। এই কাজ অপরিবর্তনীয়।</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">বাতিল</AlertDialogCancel>
            <AlertDialogAction className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}>মুছে ফেলুন</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
