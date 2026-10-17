import { NextResponse, type NextRequest } from "next/server";
import { forms, isFormId } from "@/content/forms";
import { humanCheck, submit } from "@/lib/forms";

/**
 * Receives the website's forms (content/forms.ts). Works with or without JavaScript:
 * a plain form post gets a redirect to the thank you page, a fetch gets JSON.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ form: string }> }) {
  const { form } = await params;
  if (!isFormId(form)) return NextResponse.json({ ok: false, message: "Unknown form." }, { status: 404 });
  const def = forms[form];
  const isJson = req.headers.get("content-type")?.includes("application/json");

  let raw: Record<string, unknown> = {};
  if (isJson) raw = ((await req.json().catch(() => null)) as Record<string, unknown> | null) ?? {};
  else {
    // Repeated names (ticked checkboxes) become a list.
    for (const [k, v] of (await req.formData().catch(() => new FormData())).entries()) {
      const prev = raw[k];
      raw[k] = prev === undefined ? String(v) : [prev].flat().concat(String(v));
    }
  }

  // Hidden field people never see; bots fill it in. Pretend it worked.
  const done = () => (isJson ? NextResponse.json({ ok: true, redirect: def.thanks }) : NextResponse.redirect(new URL(def.thanks, req.url), 303));
  if (raw.website) return done();

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!(await humanCheck(raw["cf-turnstile-response"] as string | undefined, ip))) {
    return NextResponse.json({ ok: false, message: "Please confirm you're not a robot and try again." }, { status: 400 });
  }

  const data: Record<string, string | string[]> = {};
  for (const f of def.fields) {
    const v = raw[f.name];
    if (f.type === "checkboxes") data[f.name] = [v ?? []].flat().map(String);
    else if (f.type === "consent") data[f.name] = v ? "yes" : "";
    else data[f.name] = typeof v === "string" ? v.trim() : "";
  }
  const utm = Object.fromEntries(Object.entries(raw).filter(([k, v]) => k.startsWith("utm_") && typeof v === "string" && v)) as Record<string, string>;
  const page = typeof raw.page === "string" ? raw.page.slice(0, 300) : undefined;

  const result = await submit({ form, data, page, utm: Object.keys(utm).length ? utm : undefined });
  if (result.ok) return done();
  if (isJson) return NextResponse.json(result, { status: result.status });
  // Without JavaScript there's no inline error display; send them back with the message.
  return new NextResponse(`${result.message}${result.errors ? "\n\n" + Object.values(result.errors).join("\n") : ""}\n\nPlease go back and try again.`, {
    status: result.status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
