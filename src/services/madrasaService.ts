// Madrasa service — abstracts all madrasa data operations
// Currently localStorage-based, ready for API migration

import type { Madrasa, PendingMadrasa } from "@/types";
import { madrasas as seedMadrasas, divisions, categories, districtsByDivision } from "@/data/madrasas";

const DELETED_KEY = "qawmi_deleted_madrasas";
const EDITS_KEY = "qawmi_madrasa_edits";
const PENDING_KEY = "qawmi_pending_madrasas";

// --- Helpers ---
const getDeletedIds = (): string[] => {
  try { return JSON.parse(localStorage.getItem(DELETED_KEY) || "[]"); } catch { return []; }
};

const getEdits = (): Record<string, Partial<Madrasa>> => {
  try { return JSON.parse(localStorage.getItem(EDITS_KEY) || "{}"); } catch { return {}; }
};

const getPendingList = (): PendingMadrasa[] => {
  try { return JSON.parse(localStorage.getItem(PENDING_KEY) || "[]"); } catch { return []; }
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

// --- Service ---
export const madrasaService = {
  async getAll(): Promise<Madrasa[]> {
    const deletedIds = getDeletedIds();
    const edits = getEdits();

    const base = seedMadrasas
      .filter((m) => !deletedIds.includes(m.id))
      .map((m) => ({ ...m, ...edits[m.id] }));

    const approved = getPendingList()
      .filter((p) => p.status === "approved")
      .map(pendingToMadrasa)
      .filter((m) => !deletedIds.includes(m.id))
      .map((m) => ({ ...m, ...edits[m.id] }));

    return [...base, ...approved];
  },

  async getById(id: string): Promise<Madrasa | null> {
    const all = await this.getAll();
    return all.find((m) => m.id === id) || null;
  },

  async update(id: string, updates: Partial<Madrasa>): Promise<void> {
    const edits = getEdits();
    edits[id] = { ...(edits[id] || {}), ...updates };
    localStorage.setItem(EDITS_KEY, JSON.stringify(edits));
  },

  async delete(id: string): Promise<void> {
    const ids = getDeletedIds();
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(DELETED_KEY, JSON.stringify(ids));
    }
  },

  async search(filters: {
    query?: string;
    division?: string;
    district?: string;
    category?: string;
  }): Promise<Madrasa[]> {
    let results = await this.getAll();

    if (filters.division) results = results.filter((m) => m.division === filters.division);
    if (filters.district) results = results.filter((m) => m.district === filters.district);
    if (filters.category) results = results.filter((m) => m.category === filters.category);
    if (filters.query) {
      const q = filters.query.toLowerCase();
      results = results.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.address.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
      );
    }

    return results;
  },

  // Static data helpers
  getDivisions: () => divisions,
  getCategories: () => categories,
  getDistrictsByDivision: () => districtsByDivision,

  // Pending madrasas
  async getPending(): Promise<PendingMadrasa[]> {
    return getPendingList();
  },

  async approveMadrasa(id: string): Promise<void> {
    const list = getPendingList();
    const updated = list.map((m) =>
      m.id === id ? { ...m, status: "approved" as const, reviewedAt: new Date().toISOString() } : m
    );
    localStorage.setItem(PENDING_KEY, JSON.stringify(updated));
  },

  async rejectMadrasa(id: string): Promise<void> {
    const list = getPendingList();
    const updated = list.map((m) =>
      m.id === id ? { ...m, status: "rejected" as const, reviewedAt: new Date().toISOString() } : m
    );
    localStorage.setItem(PENDING_KEY, JSON.stringify(updated));
  },
};
