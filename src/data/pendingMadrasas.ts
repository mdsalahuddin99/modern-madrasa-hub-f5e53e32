export const PENDING_KEY = "qawmi_pending_madrasas";

export interface PendingMadrasa {
  id: string;
  name: string;
  division: string;
  district: string;
  thana: string;
  address: string;
  category: string;
  board: string;
  established: string;
  students: string;
  teachers: string;
  phone: string;
  email: string;
  website?: string;
  description: string;
  muhtamimName: string;
  muhtamimPhone: string;
  courses: string[];
  facilities: string[];
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
}

export const getPendingMadrasas = (): PendingMadrasa[] => {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(PENDING_KEY) || "[]"); } catch { return []; }
};

export const savePendingMadrasas = (data: PendingMadrasa[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(PENDING_KEY, JSON.stringify(data));
};
