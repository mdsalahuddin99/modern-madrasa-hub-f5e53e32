// Centralized type definitions — shared across components, services, and pages

export type UserRole = "admin" | "director";

export interface User {
  id: string;
  email: string;
  role: "SUPER_ADMIN" | "INSTITUTION_ADMIN" | "USER";
  createdAt: string;
}

export interface Madrasa {
  id: string;
  name: string;
  division: string;
  district: string;
  thana: string;
  category: string;
  board: string;
  established: string;
  students: number;
  teachers: number;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string | null;
  rating: number;
  featured: boolean;
  courses: string[];
  facilities: string[];
  image: string;
  // Director-uploaded extras
  bannerImage?: string | null;
  tagline?: string | null;
  history?: string | null;
  mission?: string | null;
  vision?: string | null;
  admissionFile?: string | null;
  admissionFileType?: string | null;
  director?: { id: string; name: string | null; email: string } | null;
  galleryImages?: { id: string; url: string; order: number }[] | null;
}

export type PlanDuration = 1 | 2 | 3;

export interface SubscriptionPlan {
  id: string;
  name: string;
  duration: PlanDuration;
  pricePerYear: number;
  totalPrice: number;
  features: string[];
}

export interface MadrasaSubscription {
  id: string;
  madrasaId: string;
  madrasaName: string;
  planId: string;
  status: "pending" | "active" | "expired" | "rejected";
  paymentMethod: "bkash" | "nagad" | "rocket" | "bank";
  transactionId: string;
  payerPhone: string;
  startDate?: string;
  endDate?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewNote?: string;
}

export interface PendingMadrasa {
  id: string;
  name: string;
  division: string;
  district: string;
  thana: string;
  category: string;
  board: string;
  established: string;
  students: string;
  teachers: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string | null;
  courses: string[];
  facilities: string[];
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
}
