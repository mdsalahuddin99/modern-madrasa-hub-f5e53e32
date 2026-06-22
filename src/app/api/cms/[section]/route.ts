// ===================================================
// GET /api/cms/[section] — সেকশন কন্টেন্ট
// PUT /api/cms/[section] — সেকশন আপডেট (Admin)
// ===================================================

import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { json, error, validateBody, withErrorHandler } from "../../_helpers";
import { cmsContentSchema } from "@/lib/validations";
import { CMSService } from "@/services/cms.service";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  return withErrorHandler(async () => {
    const { section } = await params;

    try {
      const content = await CMSService.getSection(section);
      return json(content);
    } catch (err: any) {
      if (err.message === "INVALID_SECTION_NAME") return error("অবৈধ section নাম", 400);
      if (err.message === "SECTION_NOT_FOUND") return error("সেকশন পাওয়া যায়নি", 404);
      throw err;
    }
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  return withErrorHandler(async () => {
    const { section } = await params;

    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return error("অনুমোদিত নয়", 403);
    }

    const parsed = await validateBody(req, cmsContentSchema);
    if (parsed.response) return parsed.response;

    try {
      const content = await CMSService.updateSection(section, parsed.data);
      return json(content);
    } catch (err: any) {
      if (err.message === "INVALID_SECTION_NAME") return error("অবৈধ section নাম", 400);
      throw err;
    }
  });
}
