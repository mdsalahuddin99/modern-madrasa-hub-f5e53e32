import { auth } from "@/lib/auth";
import { json, error } from "../../_helpers";
import { AdminService } from "@/services/admin.service";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return error("অনুমোদিত নয়", 403);
  }

  try {
    const madrasas = await AdminService.getMadrasas();
    return json({ madrasas });
  } catch (err) {
    console.error("Error fetching admin madrasas:", err);
    return error("মাদ্রাসা লিস্ট লোড করতে সমস্যা হয়েছে", 500);
  }
}
