// ===================================================
// GET /api/admin/stats — Admin Dashboard Stats
// ===================================================

import { auth } from "@/lib/auth";
import { json, error, withErrorHandler } from "../../_helpers";
import { AdminService } from "@/services/admin.service";

export async function GET() {
  return withErrorHandler(async () => {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return error("অনুমোদিত নয়", 403);
    }

    const stats = await AdminService.getStats();
    return json(stats);
  });
}
