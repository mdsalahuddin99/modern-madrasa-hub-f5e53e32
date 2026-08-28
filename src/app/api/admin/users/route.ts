// ===================================================
// GET /api/admin/users — ইউজার লিস্ট (Admin)
// PATCH /api/admin/users — ইউজার রোল পরিবর্তন
// ===================================================

import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { json, error, validateBody } from "../../_helpers";
import { updateUserRoleSchema } from "@/lib/validations";
import { AdminService } from "@/services/admin.service";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return error("অনুমোদিত নয়", 403);
  }

  const { searchParams } = req.nextUrl;
  const role = searchParams.get("role") || undefined;

  try {
    const users = await AdminService.getUsers(role);
    return json(users);
  } catch (err) {
    console.error("Error fetching admin users:", err);
    return error("ইউজার লিস্ট লোড করতে সমস্যা হয়েছে", 500);
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return error("অনুমোদিত নয়", 403);
  }

  const parsed = await validateBody(req, updateUserRoleSchema);
  if (parsed.response) return parsed.response;

  const { userId, role } = parsed.data;

  try {
    const user = await AdminService.updateUserRole(userId, role, session.user.id!);
    return json(user);
  } catch (err: any) {
    if (err.message === "CANNOT_CHANGE_OWN_ROLE") {
      return error("নিজের রোল পরিবর্তন করা যাবে না", 403);
    }
    console.error("Error updating user role:", err);
    return error("ইউজার রোল আপডেট করতে সমস্যা হয়েছে", 500);
  }
}
