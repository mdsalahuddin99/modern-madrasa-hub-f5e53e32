"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, GripVertical, Globe, Eye, EyeOff, X, Shield, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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

  // Form state
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
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "boards");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok && data.success && data.data?.url) {
        setFormData((p) => ({ ...p, logoUrl: data.data.url }));
      } else {
        alert(data.error?.message || "আপলোড ব্যর্থ হয়েছে");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("আপলোড ব্যর্থ হয়েছে");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) {
      alert("দয়া করে ছবি আপলোড শেষ হওয়া পর্যন্ত অপেক্ষা করুন।");
      return;
    }
    setSaving(true);

    try {
      const url = editingBoard
        ? `/api/admin/boards/${editingBoard.id}`
        : "/api/admin/boards";
      
      const res = await fetch(url, {
        method: editingBoard ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchBoards();
        resetForm();
      }
    } catch (err) {
      console.error("Failed to save board:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("এই বোর্ডটি মুছে ফেলতে চান?")) return;

    try {
      const res = await fetch(`/api/admin/boards/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBoards((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete board:", err);
    }
  };

  const toggleActive = async (board: Board) => {
    try {
      const res = await fetch(`/api/admin/boards/${board.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !board.active }),
      });
      if (res.ok) {
        setBoards((prev) =>
          prev.map((b) => (b.id === board.id ? { ...b, active: !b.active } : b))
        );
      }
    } catch (err) {
      console.error("Failed to toggle board:", err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-lg bg-muted/50 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">শিক্ষা বোর্ড ম্যানেজমেন্ট</h2>
          <p className="text-sm text-muted-foreground">হোমপেজের মার্কি স্লাইডারে প্রদর্শিত বোর্ডসমূহ</p>
        </div>
        <Button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="gap-2"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          নতুন বোর্ড
        </Button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-card border border-border rounded-lg p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground">
                {editingBoard ? "বোর্ড সম্পাদনা" : "নতুন বোর্ড যোগ করুন"}
              </h3>
              <button onClick={resetForm} className="p-1 rounded-lg hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">বোর্ডের নাম *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value, abbr: e.target.value }))}
                    placeholder="যেমন: বেফাকুল মাদারিসিল আরাবিয়া"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">লোগো আপলোড</label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                    />
                  </div>
                  {uploading && <p className="text-xs text-muted-foreground mt-2 animate-pulse">আপলোড হচ্ছে...</p>}
                  {formData.logoUrl && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">বর্তমান লোগো:</p>
                      <img src={formData.logoUrl} alt="Logo" className="h-16 object-contain rounded border p-1" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button type="button" variant="ghost" onClick={resetForm} size="sm">
                  বাতিল
                </Button>
                <Button type="submit" disabled={saving} size="sm" className="gap-2">
                  {saving ? "সংরক্ষণ হচ্ছে..." : editingBoard ? "আপডেট করুন" : "যোগ করুন"}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Boards List */}
      {boards.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Shield className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">কোনো বোর্ড যোগ করা হয়নি</p>
          <p className="text-sm mt-1">উপরের &quot;নতুন বোর্ড&quot; বাটনে ক্লিক করে শুরু করুন</p>
        </div>
      ) : (
        <div className="space-y-3">
          {boards.map((board) => (
            <motion.div
              key={board.id}
              layout
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                board.active
                  ? "bg-card border-border hover:border-primary/30"
                  : "bg-muted/30 border-border/50 opacity-60"
              }`}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab shrink-0" />

              {/* Logo preview */}
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                {board.logoUrl ? (
                  <img src={board.logoUrl} alt={board.abbr} className="w-full h-full object-contain p-1" />
                ) : (
                  <Shield className="w-5 h-5 text-primary" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-sm">{board.abbr}</span>
                  {!board.active && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                      নিষ্ক্রিয়
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{board.name}</p>
              </div>

              {/* Website link */}
              {board.website && (
                <a
                  href={board.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleActive(board)}
                  className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title={board.active ? "নিষ্ক্রিয় করুন" : "সক্রিয় করুন"}
                >
                  {board.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => openEditForm(board)}
                  className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(board.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardsManager;
