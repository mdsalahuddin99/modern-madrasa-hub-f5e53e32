"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2, Edit3, Save, X, Plus, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Madrasa, divisions, categories, boards, districtsByDivision } from "@/data/madrasas";
import { thanasByDistrict } from "@/data/thanas";
import { useAdmin } from "@/contexts/AdminContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface FullEditForm {
  // Basic
  name: string;
  tagline: string;
  bannerImage: string;
  division: string;
  district: string;
  thana: string;
  category: string;
  board: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  students: number;
  teachers: number;
  // Extended
  history: string;
  mission: string;
  vision: string;
  principalMessage: string;
  principalName: string;
  principalRole: string;
  departments: { name: string; students: string; desc: string }[];
  courses: string[];
  facilities: string[];
  alumniCount: string;
  notableAlumni: string;
  admissionRules: string[];
  galleryImages: { id: string; url: string; order: number }[];
  admissionImages: string[];
  // Temp inputs
  newCourse: string;
  newFacility: string;
  newAdmissionRule: string;
  newGalleryImage: string;
  newAdmissionImage: string;
}

const AdminMadrasaTab = ({ searchQuery }: AdminMadrasaTabProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { allMadrasas, deleteMadrasa, editMadrasa } = useAdmin();

  const [editingMadrasa, setEditingMadrasa] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<FullEditForm>({
    name: "", tagline: "", bannerImage: "",
    division: "", district: "", thana: "", category: "", board: "",
    description: "", phone: "", email: "", address: "", website: "",
    students: 0, teachers: 0,
    history: "", mission: "", vision: "",
    principalMessage: "", principalName: "", principalRole: "",
    departments: [], courses: [], facilities: [],
    alumniCount: "", notableAlumni: "",
    admissionRules: [], galleryImages: [], admissionImages: [],
    newCourse: "", newFacility: "", newAdmissionRule: "",
    newGalleryImage: "", newAdmissionImage: "",
  });
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const filtered = allMadrasas.filter(m =>
    m.name.includes(searchQuery) || m.district.includes(searchQuery)
  );

  const handleDelete = (madrasa: any) => {
    deleteMadrasa(madrasa.id);
    setDeleteTarget(null);
    toast({ title: "মাদ্রাসা মুছে ফেলা হয়েছে", description: madrasa.name });
  };

  const openEdit = (m: any) => {
    setEditingMadrasa(m);
    setEditForm({
      name: m.name,
      tagline: m.tagline || "",
      bannerImage: m.bannerImage || m.image || "",
      division: m.division,
      district: m.district,
      thana: m.thana,
      category: m.category,
      board: m.board || "",
      description: m.description,
      phone: m.phone,
      email: m.email,
      address: m.address,
      website: m.website || "",
      students: m.students,
      teachers: m.teachers,
      history: m.history || "",
      mission: m.mission || "",
      vision: m.vision || "",
      principalMessage: m.principalMessage || "",
      principalName: m.principalName || "",
      principalRole: m.principalRole || "",
      departments: m.departments ? [...m.departments] : [],
      courses: m.courses ? [...m.courses] : [],
      facilities: m.facilities ? [...m.facilities] : [],
      alumniCount: m.alumniCount || "",
      notableAlumni: m.notableAlumni || "",
      admissionRules: m.admissionRules ? [...m.admissionRules] : [],
      galleryImages: m.galleryImages ? (m.galleryImages as any[]).map((img, idx) => 
        typeof img === 'string' ? { id: Math.random().toString(), url: img, order: idx } : img
      ) : [],
      admissionImages: m.admissionImages ? [...m.admissionImages] : [],
      newCourse: "", newFacility: "", newAdmissionRule: "",
      newGalleryImage: "", newAdmissionImage: "",
    });
  };

  const saveEdit = () => {
    if (!editingMadrasa) return;
    const { newCourse, newFacility, newAdmissionRule, newGalleryImage, newAdmissionImage, ...rest } = editForm;

    // Save basic Madrasa fields
    editMadrasa(editingMadrasa.id, {
      name: rest.name, division: rest.division, district: rest.district,
      thana: rest.thana, category: rest.category as any, board: rest.board as any,
      description: rest.description, phone: rest.phone, email: rest.email,
      address: rest.address, students: rest.students, teachers: rest.teachers,
      courses: rest.courses as any, facilities: rest.facilities as any,
      image: rest.bannerImage || editingMadrasa.image,
      website: rest.website,
      tagline: rest.tagline,
      history: rest.history,
      mission: rest.mission,
      vision: rest.vision,
      bannerImage: rest.bannerImage,
      principalName: rest.principalName,
      principalRole: rest.principalRole,
      principalMessage: rest.principalMessage,
      departments: rest.departments,
      alumniCount: rest.alumniCount,
      notableAlumni: rest.notableAlumni,
      admissionRules: rest.admissionRules,
      galleryImages: rest.galleryImages,
      admissionImages: rest.admissionImages,
    } as any);

    setEditingMadrasa(null);
    toast({ title: "মাদ্রাসার সম্পূর্ণ তথ্য আপডেট হয়েছে" });
  };

  const districts = editForm.division ? districtsByDivision[editForm.division] || [] : [];
  const thanas = editForm.district ? thanasByDistrict[editForm.district] || [] : [];

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      {children}
    </div>
  );

  const addToList = (key: 'courses' | 'facilities' | 'admissionRules' | 'galleryImages' | 'admissionImages', inputKey: 'newCourse' | 'newFacility' | 'newAdmissionRule' | 'newGalleryImage' | 'newAdmissionImage') => {
    const val = editForm[inputKey].trim();
    if (!val) return;
    setEditForm(f => ({ ...f, [key]: [...f[key], val], [inputKey]: "" }));
  };

  const removeFromList = (key: 'courses' | 'facilities' | 'admissionRules' | 'galleryImages' | 'admissionImages', index: number) => {
    setEditForm(f => ({ ...f, [key]: f[key].filter((_, j) => j !== index) }));
  };

  const ListEditor = ({ label, items, inputKey, listKey, placeholder }: {
    label: string; items: string[];
    inputKey: 'newCourse' | 'newFacility' | 'newAdmissionRule' | 'newGalleryImage' | 'newAdmissionImage';
    listKey: 'courses' | 'facilities' | 'admissionRules' | 'galleryImages' | 'admissionImages';
    placeholder: string;
  }) => (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      <div className="flex flex-wrap gap-1 mb-2">
        {items.map((item, i) => (
          <Badge key={i} variant="secondary" className="text-[10px] gap-1 pr-1 max-w-[200px]">
            <span className="truncate">{item}</span>
            <button onClick={() => removeFromList(listKey, i)}
              className="w-4 h-4 rounded-full bg-destructive/20 text-destructive flex items-center justify-center flex-shrink-0">
              <X className="w-2.5 h-2.5" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={editForm[inputKey]}
          onChange={e => setEditForm(f => ({ ...f, [inputKey]: e.target.value }))}
          placeholder={placeholder} className="rounded-xl text-xs h-8 flex-1"
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addToList(listKey, inputKey); } }} />
        <Button size="sm" variant="outline" className="h-8 rounded-xl text-xs"
          onClick={() => addToList(listKey, inputKey)}>
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="glass-card rounded-2xl p-5">
        <h2 className="text-base font-bold text-foreground mb-3">সকল মাদ্রাসা ({filtered.length})</h2>
        <div className="space-y-2.5">
          {filtered.map(m => (
            <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-background/60 border border-border/40">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={m.image || "/placeholder.svg"} alt={m.name} fill className="object-cover" unoptimized />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                  <p className="text-[10px] text-muted-foreground">{m.district} · {m.category} {m.board && `· ${m.board}`}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg" onClick={() => router.push(`/madrasas/${m.id}`)}>
                  <Eye className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-primary" onClick={() => openEdit(m)}>
                  <Edit3 className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setDeleteTarget(m)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">কোনো মাদ্রাসা পাওয়া যায়নি</p>
          )}
        </div>
      </div>

      {/* Full Edit Dialog - All Fields */}
      <Dialog open={!!editingMadrasa} onOpenChange={() => setEditingMadrasa(null)}>
        <DialogContent className="font-bengali max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>মাদ্রাসা সম্পূর্ণ সম্পাদনা — {editForm.name}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="w-full flex flex-wrap h-auto gap-1 rounded-xl p-1">
              <TabsTrigger value="basic" className="text-[10px] rounded-lg px-2 py-1.5">মৌলিক</TabsTrigger>
              <TabsTrigger value="location" className="text-[10px] rounded-lg px-2 py-1.5">অবস্থান</TabsTrigger>
              <TabsTrigger value="about" className="text-[10px] rounded-lg px-2 py-1.5">পরিচিতি</TabsTrigger>
              <TabsTrigger value="principal" className="text-[10px] rounded-lg px-2 py-1.5">মুহতামিম</TabsTrigger>
              <TabsTrigger value="academic" className="text-[10px] rounded-lg px-2 py-1.5">একাডেমিক</TabsTrigger>
              <TabsTrigger value="admission" className="text-[10px] rounded-lg px-2 py-1.5">ভর্তি</TabsTrigger>
              <TabsTrigger value="gallery" className="text-[10px] rounded-lg px-2 py-1.5">গ্যালারি</TabsTrigger>
            </TabsList>

            {/* Tab 1: Basic */}
            <TabsContent value="basic" className="space-y-3 mt-3">
              <Field label="প্রতিষ্ঠানের নাম">
                <Input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="rounded-xl" />
              </Field>
              <Field label="ট্যাগলাইন">
                <Input value={editForm.tagline} onChange={e => setEditForm(f => ({ ...f, tagline: e.target.value }))} className="rounded-xl" placeholder="সংক্ষিপ্ত পরিচয়..." />
              </Field>
              <Field label="ব্যানার ইমেজ URL">
                <Input value={editForm.bannerImage} onChange={e => setEditForm(f => ({ ...f, bannerImage: e.target.value }))} className="rounded-xl" placeholder="https://..." />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="ক্যাটাগরি">
                  <Select value={editForm.category} onValueChange={v => setEditForm(f => ({ ...f, category: v }))}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent className="font-bengali">{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="বোর্ড">
                  <Select value={editForm.board} onValueChange={v => setEditForm(f => ({ ...f, board: v }))}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent className="font-bengali">{boards.map(b => <SelectItem key={b} value={b} className="text-xs">{b}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="ছাত্র সংখ্যা">
                  <Input type="number" value={editForm.students} onChange={e => setEditForm(f => ({ ...f, students: parseInt(e.target.value) || 0 }))} className="rounded-xl" />
                </Field>
                <Field label="শিক্ষক সংখ্যা">
                  <Input type="number" value={editForm.teachers} onChange={e => setEditForm(f => ({ ...f, teachers: parseInt(e.target.value) || 0 }))} className="rounded-xl" />
                </Field>
                <Field label="প্রাক্তন ছাত্র">
                  <Input value={editForm.alumniCount} onChange={e => setEditForm(f => ({ ...f, alumniCount: e.target.value }))} className="rounded-xl" placeholder="সংখ্যা" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="ফোন">
                  <Input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} className="rounded-xl" />
                </Field>
                <Field label="ইমেইল">
                  <Input value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} className="rounded-xl" />
                </Field>
              </div>
              <Field label="ওয়েবসাইট">
                <Input value={editForm.website} onChange={e => setEditForm(f => ({ ...f, website: e.target.value }))} className="rounded-xl" placeholder="https://..." />
              </Field>
            </TabsContent>

            {/* Tab 2: Location */}
            <TabsContent value="location" className="space-y-3 mt-3">
              <Field label="বিভাগ">
                <Select value={editForm.division} onValueChange={v => setEditForm(f => ({ ...f, division: v, district: "", thana: "" }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent className="font-bengali">{divisions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="জেলা">
                <Select value={editForm.district} onValueChange={v => setEditForm(f => ({ ...f, district: v, thana: "" }))} disabled={!editForm.division}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="জেলা নির্বাচন" /></SelectTrigger>
                  <SelectContent className="font-bengali">{districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="থানা/উপজেলা">
                <Select value={editForm.thana} onValueChange={v => setEditForm(f => ({ ...f, thana: v }))} disabled={!editForm.district}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="থানা নির্বাচন" /></SelectTrigger>
                  <SelectContent className="font-bengali">{thanas.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="পূর্ণ ঠিকানা">
                <Textarea value={editForm.address} onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))} className="rounded-xl min-h-[60px]" />
              </Field>
            </TabsContent>

            {/* Tab 3: About - History, Mission, Vision */}
            <TabsContent value="about" className="space-y-3 mt-3">
              <Field label="বিবরণ / পরিচিতি">
                <Textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} className="rounded-xl min-h-[80px]" />
              </Field>
              <Field label="ইতিহাস">
                <Textarea value={editForm.history} onChange={e => setEditForm(f => ({ ...f, history: e.target.value }))} className="rounded-xl min-h-[80px]" placeholder="প্রতিষ্ঠানের ইতিহাস..." />
              </Field>
              <Field label="লক্ষ্য (Mission)">
                <Textarea value={editForm.mission} onChange={e => setEditForm(f => ({ ...f, mission: e.target.value }))} className="rounded-xl min-h-[60px]" placeholder="প্রতিষ্ঠানের লক্ষ্য..." />
              </Field>
              <Field label="উদ্দেশ্য (Vision)">
                <Textarea value={editForm.vision} onChange={e => setEditForm(f => ({ ...f, vision: e.target.value }))} className="rounded-xl min-h-[60px]" placeholder="প্রতিষ্ঠানের উদ্দেশ্য..." />
              </Field>
              <Field label="উল্লেখযোগ্য প্রাক্তন ছাত্র">
                <Textarea value={editForm.notableAlumni} onChange={e => setEditForm(f => ({ ...f, notableAlumni: e.target.value }))} className="rounded-xl min-h-[60px]" placeholder="বিখ্যাত প্রাক্তন ছাত্রদের তালিকা..." />
              </Field>
            </TabsContent>

            {/* Tab 4: Principal */}
            <TabsContent value="principal" className="space-y-3 mt-3">
              <Field label="মুহতামিমের নাম">
                <Input value={editForm.principalName} onChange={e => setEditForm(f => ({ ...f, principalName: e.target.value }))} className="rounded-xl" placeholder="মুহতামিমের পূর্ণ নাম" />
              </Field>
              <Field label="পদবি">
                <Input value={editForm.principalRole} onChange={e => setEditForm(f => ({ ...f, principalRole: e.target.value }))} className="rounded-xl" placeholder="যেমন: প্রধান মুহতামিম" />
              </Field>
              <Field label="মুহতামিমের বাণী">
                <Textarea value={editForm.principalMessage} onChange={e => setEditForm(f => ({ ...f, principalMessage: e.target.value }))} className="rounded-xl min-h-[100px]" placeholder="মুহতামিমের বাণী লিখুন..." />
              </Field>
            </TabsContent>

            {/* Tab 5: Academic - Departments, Courses, Facilities */}
            <TabsContent value="academic" className="space-y-4 mt-3">
              {/* Departments */}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block font-medium">বিভাগসমূহ (Departments)</label>
                <div className="space-y-2">
                  {editForm.departments.map((dept, i) => (
                    <div key={i} className="grid grid-cols-[1fr_80px_1fr_32px] gap-2 items-start">
                      <Input value={dept.name} placeholder="বিভাগের নাম"
                        onChange={e => {
                          const deps = [...editForm.departments];
                          deps[i] = { ...deps[i], name: e.target.value };
                          setEditForm(f => ({ ...f, departments: deps }));
                        }} className="rounded-xl text-xs h-8" />
                      <Input value={dept.students} placeholder="ছাত্র"
                        onChange={e => {
                          const deps = [...editForm.departments];
                          deps[i] = { ...deps[i], students: e.target.value };
                          setEditForm(f => ({ ...f, departments: deps }));
                        }} className="rounded-xl text-xs h-8" />
                      <Input value={dept.desc} placeholder="বিবরণ"
                        onChange={e => {
                          const deps = [...editForm.departments];
                          deps[i] = { ...deps[i], desc: e.target.value };
                          setEditForm(f => ({ ...f, departments: deps }));
                        }} className="rounded-xl text-xs h-8" />
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive"
                        onClick={() => setEditForm(f => ({ ...f, departments: f.departments.filter((_, j) => j !== i) }))}>
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" className="rounded-xl text-xs gap-1"
                    onClick={() => setEditForm(f => ({ ...f, departments: [...f.departments, { name: "", students: "", desc: "" }] }))}>
                    <Plus className="w-3 h-3" /> বিভাগ যোগ
                  </Button>
                </div>
              </div>

              <ListEditor label="কোর্সসমূহ" items={editForm.courses} inputKey="newCourse" listKey="courses" placeholder="নতুন কোর্স..." />
              <ListEditor label="সুবিধাসমূহ" items={editForm.facilities} inputKey="newFacility" listKey="facilities" placeholder="নতুন সুবিধা..." />
            </TabsContent>

            {/* Tab 6: Admission */}
            <TabsContent value="admission" className="space-y-4 mt-3">
              <ListEditor label="ভর্তি নিয়মাবলী" items={editForm.admissionRules} inputKey="newAdmissionRule" listKey="admissionRules" placeholder="নতুন নিয়ম যোগ..." />
              <ListEditor label="ভর্তি সংক্রান্ত ছবি (URL)" items={editForm.admissionImages} inputKey="newAdmissionImage" listKey="admissionImages" placeholder="ছবির URL..." />
            </TabsContent>

            {/* Tab 7: Gallery */}
            <TabsContent value="gallery" className="space-y-4 mt-3">
              <ListEditor label="গ্যালারি ছবি (URL)" items={editForm.galleryImages.map(img => img.url)} inputKey="newGalleryImage" listKey="galleryImages" placeholder="ছবির URL..." />
              {editForm.galleryImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {editForm.galleryImages.map((img, i) => (
                    <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-border/40">
                      <Image src={img.url} alt={`গ্যালারি ${i + 1}`} fill className="object-cover" unoptimized />
                      <button onClick={() => removeFromList('galleryImages', i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2 mt-3">
            <Button variant="outline" onClick={() => setEditingMadrasa(null)} className="rounded-xl gap-1.5">
              <X className="w-3.5 h-3.5" /> বাতিল
            </Button>
            <Button onClick={saveEdit} className="rounded-xl gap-1.5">
              <Save className="w-3.5 h-3.5" /> সংরক্ষণ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="font-bengali max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>মাদ্রাসা মুছে ফেলবেন?</AlertDialogTitle>
            <AlertDialogDescription>"{deleteTarget?.name}" মুছে ফেলা হবে।</AlertDialogDescription>
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
};

export default AdminMadrasaTab;
