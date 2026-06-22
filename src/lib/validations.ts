// ===================================================
// Zod Validation Schemas — সব API route-এর জন্য
// ===================================================

import { z } from "zod";

// ─── Common ───────────────────────────────────────

const banglaPhoneRegex = /^০১[৩-৯][০-৯]{8}$|^01[3-9][0-9]{8}$/;

export const phoneSchema = z
  .string()
  .trim()
  .min(11, "ফোন নম্বর কমপক্ষে ১১ অক্ষরের হতে হবে")
  .max(14, "ফোন নম্বর সর্বোচ্চ ১৪ অক্ষরের হতে পারে");

export const emailSchema = z
  .string()
  .trim()
  .email("সঠিক ইমেইল দিন")
  .max(255, "ইমেইল সর্বোচ্চ ২৫৫ অক্ষরের হতে পারে");

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
});

// ─── Auth ─────────────────────────────────────────

export const signupSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে")
    .max(128, "পাসওয়ার্ড সর্বোচ্চ ১২৮ অক্ষরের হতে পারে"),
  name: z
    .string()
    .trim()
    .max(100, "নাম সর্বোচ্চ ১০০ অক্ষরের হতে পারে")
    .nullish(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "পাসওয়ার্ড দিন").max(128),
});

// ─── Madrasa ──────────────────────────────────────

export const createMadrasaSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "মাদ্রাসার নাম কমপক্ষে ৩ অক্ষরের হতে হবে")
    .max(200, "নাম সর্বোচ্চ ২০০ অক্ষরের হতে পারে"),
  division: z.string().trim().min(1, "বিভাগ নির্বাচন করুন").max(50),
  district: z.string().trim().min(1, "জেলা নির্বাচন করুন").max(50),
  thana: z.string().trim().min(1, "থানা নির্বাচন করুন").max(50),
  category: z.string().trim().min(1, "ক্যাটাগরি নির্বাচন করুন").max(50),
  board: z.string().trim().min(1, "বোর্ড নির্বাচন করুন").max(100),
  established: z.string().trim().max(20, "প্রতিষ্ঠার সাল সর্বোচ্চ ২০ অক্ষর"),
  students: z.coerce.number().int().min(0).max(100000).default(0),
  teachers: z.coerce.number().int().min(0).max(10000).default(0),
  description: z
    .string()
    .trim()
    .min(10, "বিবরণ কমপক্ষে ১০ অক্ষরের হতে হবে")
    .max(5000, "বিবরণ সর্বোচ্চ ৫০০০ অক্ষরের হতে পারে"),
  address: z
    .string()
    .trim()
    .min(5, "ঠিকানা কমপক্ষে ৫ অক্ষরের হতে হবে")
    .max(500),
  phone: phoneSchema,
  email: emailSchema,
  website: z.string().url("সঠিক URL দিন").max(255).nullish().or(z.literal("")),
  subdomain: z
    .string()
    .trim()
    .min(3, "সাব-ডোমেইন কমপক্ষে ৩ অক্ষরের হতে হবে")
    .max(50, "সাব-ডোমেইন সর্বোচ্চ ৫০ অক্ষরের হতে পারে")
    .regex(/^[a-z0-9-]+$/, "সাব-ডোমেইনে শুধু ছোট হাতের অক্ষর, সংখ্যা এবং ড্যাশ থাকতে পারে")
    .nullish(),
  image: z.string().url().max(500).nullish(),
  bannerImage: z.string().url().max(500).nullish(),
  tagline: z.string().trim().max(300).nullish(),
  history: z.string().trim().max(10000).nullish(),
  mission: z.string().trim().max(5000).nullish(),
  vision: z.string().trim().max(5000).nullish(),
  principalName: z.string().trim().max(200).nullish(),
  principalRole: z.string().trim().max(100).nullish(),
  principalMessage: z.string().trim().max(5000).nullish(),
  alumniCount: z.string().trim().max(100).nullish(),
  notableAlumni: z.string().trim().max(5000).nullish(),
  admissionRules: z.array(z.string().trim()).default([]),
  admissionImages: z.array(z.string().trim()).default([]),
  departments: z.array(z.object({
    name: z.string().trim().min(1),
    students: z.string().trim().optional(),
    desc: z.string().trim().optional(),
  })).nullish(),
  courses: z
    .array(z.string().trim().min(1).max(100))
    .max(50, "সর্বোচ্চ ৫০টি কোর্স যোগ করা যাবে")
    .default([]),
  facilities: z
    .array(z.string().trim().min(1).max(100))
    .max(50, "সর্বোচ্চ ৫০টি সুবিধা যোগ করা যাবে")
    .default([]),
  teachersList: z.array(z.object({
    id: z.string().optional(),
    name: z.string().trim().min(1, "শিক্ষকের নাম দিন").max(200),
    designation: z.string().trim().min(1, "পদবী দিন").max(200),
    department: z.string().trim().max(100).nullish(),
    image: z.string().url().max(500).nullish().or(z.literal("")),
    bio: z.string().trim().max(5000).nullish(),
  })).nullish(),
});

export const updateMadrasaSchema = createMadrasaSchema.partial().extend({
  admissionOpen: z.boolean().optional(),
  admissionFile: z.string().url().max(500).nullish(),
  admissionFileType: z.string().max(50).nullish(),
  featured: z.boolean().optional(),
  rating: z.number().min(0).max(5).optional(),
});

export const madrasaFilterSchema = z.object({
  division: z.string().max(50).nullish(),
  district: z.string().max(50).nullish(),
  thana: z.string().max(50).nullish(),
  category: z.string().max(50).nullish(),
  board: z.string().max(100).nullish(),
  search: z.string().max(200).nullish(),
  featured: z.enum(["true", "false"]).nullish(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).nullish(),
  directorId: z.string().nullish(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
});

// ─── Madrasa Status ───────────────────────────────

export const updateStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"], {
    errorMap: () => ({ message: "status হতে হবে APPROVED বা REJECTED" }),
  }),
  featured: z.boolean().optional(),
  reviewNote: z.string().trim().max(1000).nullish(),
});

// ─── Subscription Plan ────────────────────────────

export const subscriptionPlanSchema = z.object({
  name: z.string().trim().min(1, "প্ল্যানের নাম দিন").max(100),
  durationYear: z.coerce.number().int().min(1),
  pricePerYear: z.coerce.number().int().min(0),
  totalPrice: z.coerce.number().int().min(0),
  features: z.array(z.string().trim()).min(1, "কমপক্ষে একটি ফিচার দিন"),
  active: z.boolean().default(true),
});

// ─── Gallery ──────────────────────────────────────

export const addGalleryImageSchema = z.object({
  url: z.string().url("সঠিক ইমেজ URL দিন").max(500),
  caption: z.string().trim().max(300, "ক্যাপশন সর্বোচ্চ ৩০০ অক্ষর").nullish(),
  order: z.coerce.number().int().min(0).max(1000).default(0),
});

// ─── Subscription ─────────────────────────────────

export const createSubscriptionSchema = z.object({
  madrasaId: z.string().min(1, "মাদ্রাসা নির্বাচন করুন"),
  planId: z.string().min(1, "প্ল্যান নির্বাচন করুন"),
  paymentMethod: z.enum(["bkash", "nagad", "rocket", "bank", "BKASH", "NAGAD", "ROCKET", "BANK"], {
    errorMap: () => ({ message: "সঠিক পেমেন্ট মেথড নির্বাচন করুন" }),
  }),
  transactionId: z
    .string()
    .trim()
    .min(4, "ট্রানজেকশন আইডি কমপক্ষে ৪ অক্ষরের হতে হবে")
    .max(50, "ট্রানজেকশন আইডি সর্বোচ্চ ৫০ অক্ষর"),
  payerPhone: phoneSchema,
});

export const reviewSubscriptionSchema = z.object({
  status: z.enum(["ACTIVE", "REJECTED"], {
    errorMap: () => ({ message: "status হতে হবে ACTIVE বা REJECTED" }),
  }),
  reviewNote: z.string().trim().max(1000).nullish(),
});

// ─── Subscription Plan ────────────────────────────

export const createPlanSchema = z.object({
  name: z.string().trim().min(2, "প্ল্যান নাম কমপক্ষে ২ অক্ষর").max(100),
  durationYear: z.coerce.number().int().min(1).max(10),
  pricePerYear: z.coerce.number().int().min(0).max(1000000),
  totalPrice: z.coerce.number().int().min(0).max(10000000),
  features: z
    .array(z.string().trim().min(1).max(200))
    .max(20)
    .default([]),
});

// ─── Admin Users ──────────────────────────────────

export const updateUserRoleSchema = z.object({
  userId: z.string().min(1, "userId দিন"),
  role: z.enum(["ADMIN", "DIRECTOR"], {
    errorMap: () => ({ message: "role হতে হবে ADMIN বা DIRECTOR" }),
  }),
});

// ─── CMS ──────────────────────────────────────────

// CMS content is flexible JSON, validate at section level
export const cmsContentSchema = z.record(z.unknown()).refine(
  (data) => Object.keys(data).length > 0,
  { message: "কন্টেন্ট খালি হতে পারে না" }
);

// ─── Utility: Parse & validate ────────────────────

export function parseBody<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const firstError = result.error.errors[0];
    return {
      success: false as const,
      error: firstError?.message || "ভ্যালিডেশন ত্রুটি",
      errors: result.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    };
  }
  return { success: true as const, data: result.data };
}

export function parseSearchParams<T>(
  schema: z.ZodSchema<T>,
  searchParams: URLSearchParams
) {
  const obj: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    obj[key] = value;
  });
  return parseBody(schema, obj);
}
