import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { json, error } from "../_helpers";
import { UploadService } from "@/services/upload.service";
import { checkRateLimit, API_RATE_LIMIT } from "@/lib/rate-limit";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/", "application/pdf"];

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return error("লগইন করুন", 401);
    }

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rateLimit = await checkRateLimit(`upload_${ip}_${session.user.id}`, API_RATE_LIMIT);
    if (!rateLimit.allowed) {
      return error("অনেক বেশি আপলোড রিকোয়েস্ট এসেছে। কিছুক্ষণ পর আবার চেষ্টা করুন।", 429);
    }

    if (!UploadService.hasConfig()) {
      return error("Cloudinary কনফিগার করা হয়নি", 500);
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "madrasas";

    if (!file) {
      return error("ফাইল পাওয়া যায়নি", 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      return error("ফাইল সাইজ ২MB এর বেশি হতে পারবে না", 400);
    }

    const isAllowed = ALLOWED_TYPES.some((type) => file.type.startsWith(type));
    if (!isAllowed) {
      return error("শুধুমাত্র ছবি অথবা PDF ফাইল আপলোড করা যাবে", 400);
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await UploadService.uploadFile(base64File, folder);

    return json(result);
  } catch (err: any) {
    console.error("Upload API error:", err);
    return error(err.message || "আপলোড ব্যর্থ হয়েছে", 500);
  }
}
