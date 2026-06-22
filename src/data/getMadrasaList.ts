import { madrasas, Madrasa } from "./madrasas";
import { getPendingMadrasas, PendingMadrasa } from "@/data/pendingMadrasas";

const DELETED_KEY = "qawmi_deleted_madrasas";
const EDITS_KEY = "qawmi_madrasa_edits";
const USERS_KEY = "qawmi_mock_users";

const getDeletedIds = (): string[] => {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(DELETED_KEY) || "[]"); } catch { return []; }
};

const getEdits = (): Record<string, Partial<Madrasa>> => {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(EDITS_KEY) || "{}"); } catch { return {}; }
};

const pendingToMadrasa = (p: PendingMadrasa): Madrasa => ({
  id: p.id,
  name: p.name,
  division: p.division,
  district: p.district,
  thana: p.thana,
  category: p.category,
  board: p.board,
  established: p.established,
  students: parseInt(p.students) || 0,
  teachers: parseInt(p.teachers) || 0,
  description: p.description,
  address: p.address,
  phone: p.phone,
  email: p.email,
  website: p.website,
  rating: 4.0,
  featured: false,
  courses: p.courses,
  facilities: p.facilities,
  image: "https://images.unsplash.com/photo-1585036156171-384164a8c6c4?w=800",
});

/** Director-saved madrasa data from localStorage */
export interface DirectorMadrasaData {
  name: string;
  tagline: string;
  bannerImage: string;
  division: string;
  district: string;
  thana: string;
  category: string;
  board: string;
  description: string;
  history: string;
  mission: string;
  vision: string;
  principalMessage: string;
  principalName: string;
  principalRole: string;
  departments: { name: string; students: string; desc: string }[];
  courses: string[];
  facilities: string[];
  studentCount: string;
  teacherCount: string;
  alumniCount: string;
  notableAlumni: string;
  admissionRules: string[];
  admissionFile: string;
  admissionFileType: string;
  admissionImages: string[];
  galleryImages: string[];
  phone: string;
  email: string;
  address: string;
  website: string;
}

/** Get all director user IDs from localStorage */
const getDirectorUserIds = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
    return Object.values(users)
      .filter((u: any) => u.user?.role === "DIRECTOR")
      .map((u: any) => u.user.id);
  } catch { return []; }
};

/** Get director form data by user ID */
export const getDirectorData = (userId: string): DirectorMadrasaData | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`director_madrasa_${userId}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
};

/** Convert director form data to Madrasa object */
const directorToMadrasa = (userId: string, data: DirectorMadrasaData): Madrasa => ({
  id: userId,
  name: data.name || "নামহীন মাদ্রাসা",
  division: data.division || "",
  district: data.district || "",
  thana: data.thana || "",
  category: data.category || "",
  board: data.board || "",
  established: "",
  students: parseInt(data.studentCount) || 0,
  teachers: parseInt(data.teacherCount) || 0,
  description: data.description || "",
  address: data.address || "",
  phone: data.phone || "",
  email: data.email || "",
  website: data.website || "",
  rating: 4.0,
  featured: false,
  courses: (data.courses || []).filter(Boolean),
  facilities: (data.facilities || []).filter(Boolean),
  image: data.bannerImage || "https://images.unsplash.com/photo-1585036156171-384164a8c6c4?w=800",
});

export const getAllMadrasas = (): Madrasa[] => {
  const deletedIds = getDeletedIds();
  const edits = getEdits();

  const base = madrasas
    .filter(m => !deletedIds.includes(m.id))
    .map(m => ({ ...m, ...edits[m.id] }));

  const approved = getPendingMadrasas()
    .filter(p => p.status === "approved")
    .map(pendingToMadrasa)
    .filter(m => !deletedIds.includes(m.id))
    .map(m => ({ ...m, ...edits[m.id] }));

  // Include director-created madrasas
  const existingIds = new Set([...base.map(m => m.id), ...approved.map(m => m.id)]);
  const directorIds = getDirectorUserIds();
  const directorMadrasas: Madrasa[] = [];

  for (const uid of directorIds) {
    if (existingIds.has(uid) || deletedIds.includes(uid)) continue;
    const data = getDirectorData(uid);
    if (data && data.name?.trim()) {
      directorMadrasas.push({ ...directorToMadrasa(uid, data), ...edits[uid] });
    }
  }

  return [...base, ...approved, ...directorMadrasas];
};
