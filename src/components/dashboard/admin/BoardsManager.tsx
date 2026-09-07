"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, GripVertical, Globe, Eye, EyeOff, X, Shield, Upload, Sparkles, Link as LinkIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn, toBn } from "@/lib/utils";

interface Board {
  id: string;
  name: string;
  abbr: string;
  logoUrl: string | null;
  website: string | null;
  order: number;
  active: boolean;
}

const BoardsManager = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    abbr: "",
    logoUrl: "",
    website: "",
    order: 0,
    active: true,
  });

  const fetchBoards = async () => {
    try {
      const res = await fetch("/api/admin/boards");
      const data = await res.json();
      setBoards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch boards:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const resetForm = () => {
    setFormData({ name: "", abbr: "", logoUrl: "", website: "", order: 0, active: true });
    setEditingBoard(null);
    setShowForm(false);
  };

  const openEditForm = (board: Board) => {
    setFormData({
      name: board.name,
      abbr: board.abbr,
      logoUrl: board.logoUrl || "",
      website: board.website || "",
      order: board.order,
      active: board.active,
    });
    setEditingBoard(board);
    setShowForm(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("folder", "boards");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (res.ok && data.success && data.data?.url) {
        setFormData((p) => ({ ...p, logoUrl: data.data.url }));
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingBoard ? `/api/admin/boards/${editingBoard.id}` : "/api/admin/boards";
      const res = await fetch(url, {
        method: editingBoard ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) { await fetchBoards(); resetForm(); }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("এই বোর্ডটি মুছে ফেলতে চান?")) return;
    const res = await fetch(`/api/admin/boards/${id}`, { method: "DELETE" });
    if (res.ok) setBoards((prev) => prev.filter((b) => b.id !== id));
  };

  const toggleActive = async (board: Board) => {
    const res = await fetch(`/api/admin/boards/${board.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !board.active }),
    });
    if (res.ok) {
      setBoards((prev) => prev.map((b) => (b.id === board.id ? { ...b, active: !b.active } : b)));
    }
  };

  return (
    <div className="space-y-10">
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-foreground flex items-center gap-3">
             <div className="w-1.5 h-6 bg-primary rounded-full" />
             বোর্ড ম্যানেজমেন্ট
          </h2>
          <p className="text-sm font-bold text-muted-foreground mt-1 uppercase tracking-tighter">স্বীকৃত শিক্ষা বোর্ডসমূহ পরিচালনা করুন</p>
        </div>
        <Button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="h-12 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-widest active-scale gap-2 shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> নতুন বোর্ড যোগ করুন
        </Button>
      </div>

      {/* Modern Form Drawer/Card */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card border border-border/40 rounded-[2.5rem] shadow-soft p-8 lg:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem]" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black text-foreground">
                  {editingBoard ? "বোর্ড সম্পাদনা" : "নতুন বোর্ড নিবন্ধন"}
                </h3>
                <button onClick={resetForm} className="w-10 h-10 rounded-full bg-primary/10 text-primary/60 hover:bg-primary hover:text-white flex items-center justify-center active-scale transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">বোর্ডের পূর্ণ নাম</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value, abbr: e.target.value }))}
                      required
                      placeholder="যেমন: বেফাকুল মাদারিসিল আরাবিয়া"
                      className="w-full h-14 px-6 rounded-2xl bg-secondary/40 border-none font-bold placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">অফিসিয়াল ওয়েবসাইট</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData((p) => ({ ...p, website: e.target.value }))}
                      placeholder="https://example.com"
                      className="w-full h-14 px-6 rounded-2xl bg-secondary/40 border-none font-bold placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">বোর্ড লোগো</label>
                      <div className={cn(
                        "relative h-32 rounded-3xl border-2 border-dashed border-border/60 bg-secondary/20 flex flex-col items-center justify-center transition-all group overflow-hidden",
                        formData.logoUrl ? "border-primary/20" : "hover:border-primary/40"
                      )}>
                         {formData.logoUrl ? (
                            <img src={formData.logoUrl} alt="Preview" className="h-full w-full object-contain p-4" />
                         ) : (
                            <>
                               <Upload className="w-8 h-8 text-muted-foreground/40 mb-2 group-hover:text-primary transition-colors" />
                               <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">ফাইল নির্বাচন করুন</span>
                            </>
                         )}
                         <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                         {uploading && <div className="absolute inset-0 bg-background/80 flex items-center justify-center animate-pulse"><p className="text-xs font-black text-primary">আপলোড হচ্ছে...</p></div>}
                      </div>
                   </div>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 pt-6">
                  <Button type="button" variant="ghost" onClick={resetForm} className="h-12 rounded-xl font-black text-xs uppercase tracking-widest active-scale">বাতিল</Button>
                  <Button type="submit" disabled={saving || uploading} className="h-12 px-10 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 active-scale">
                    {saving ? "সেভ হচ্ছে..." : editingBoard ? "আপডেট করুন" : "যোগ করুন"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Boards Grid - Desktop Optimized */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {boards.map((board, i) => (
          <motion.div
            key={board.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "bg-card p-5 lg:p-6 rounded-[2rem] border border-border/40 shadow-soft flex items-center gap-5 group hover:border-primary/20 transition-all active-scale",
              !board.active && "opacity-60 grayscale"
            )}
          >
            <div className="w-10 h-10 flex items-center justify-center text-muted-foreground/30 group-hover:text-primary transition-colors">
               <GripVertical className="w-5 h-5" />
            </div>

            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 p-2 overflow-hidden shadow-inner">
               {board.logoUrl ? (
                 <img src={board.logoUrl} alt={board.abbr} className="w-full h-full object-contain transition-transform group-hover:scale-110" />
               ) : (
                 <Shield className="w-7 h-7 text-primary/30" />
               )}
            </div>

            <div className="flex-1 min-w-0">
               <h4 className="text-base font-black text-foreground truncate group-hover:text-primary transition-colors">{board.name}</h4>
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-0.5">{board.abbr} Board</p>
            </div>

            <div className="flex items-center gap-2">
               {board.website && (
                 <a href={board.website} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary active-scale hover:bg-primary hover:text-white transition-all">
                    <Globe className="w-4 h-4" />
                 </a>
               )}
               <button onClick={() => toggleActive(board)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground active-scale">
                  {board.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
               </button>
               <button onClick={() => openEditForm(board)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground active-scale hover:bg-primary/5 hover:text-primary">
                  <Pencil className="w-4 h-4" />
               </button>
               <button onClick={() => handleDelete(board.id)} className="w-9 h-9 rounded-xl bg-destructive/5 flex items-center justify-center text-destructive active-scale hover:bg-destructive hover:text-white">
                  <Trash2 className="w-4 h-4" />
               </button>
            </div>
          </motion.div>
        ))}
      </div>

      {boards.length === 0 && !loading && (
        <div className="text-center py-24 bg-card rounded-[3rem] border-2 border-dashed border-border/40">
           <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
           <p className="text-sm font-bold text-muted-foreground">কোনো বোর্ড নিবন্ধিত হয়নি</p>
        </div>
      )}
    </div>
  );
};

export default BoardsManager;
