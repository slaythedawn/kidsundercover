import { type NextRequest } from "next/server";
import { isFormId } from "@/content/forms";
import { exportCsv } from "@/lib/forms";

/**
 * Download submissions as a spreadsheet (CSV): /api/forms/export/?form=contact
 * Needs the FORMS_ADMIN_TOKEN, sent as "Authorization: Bearer <token>" or ?token=<token>.
 */
export async function GET(req: NextRequest) {
  const token = process.env.FORMS_ADMIN_TOKEN;
  const given = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? req.nextUrl.searchParams.get("token");
  if (!token || given !== token) return new Response("Not authorised", { status: 401 });
  const asked = req.nextUrl.searchParams.get("form");
  if (asked && !isFormId(asked)) return new Response("Unknown form", { status: 404 });
  const form = asked && isFormId(asked) ? asked : undefined;
  const csv = await exportCsv(form);
  if (csv === undefined) return new Response("The database isn't connected yet (DATABASE_URL).", { status: 503 });
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="kuc-${form ?? "all"}-submissions-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
