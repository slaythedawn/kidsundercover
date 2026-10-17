/**
 * Audits everything the current kuc.org.au WordPress site holds or does, so the
 * migration leaves nothing behind. Runs in GitHub Actions (.github/workflows/
 * audit-wordpress.yml) because the build environment can't reach kuc.org.au.
 *
 * Writes media/wp-audit/:
 *   rest.json        REST namespaces (each one is a plugin) and routes
 *   types.json       post types and taxonomies
 *   content/*.json   every post, page and custom post type, with full HTML and Yoast SEO
 *   terms/*.json     categories, tags and other taxonomies
 *   sitemaps.json    every address in the Yoast sitemaps
 *   robots.txt       the live robots file
 *   crawl.json       per page: forms, iframes, scripts, tracking IDs, embeds, files, outbound links
 *   external.json    the same for the other KUC sites (donatenow, connect, Salesforce, portal)
 *   redirects.json   how the live site answers every address in docs/audit/ga-paths.tsv
 *   summary.json     everything above rolled up
 *
 * With WP_USER and WP_APP_PASSWORD set (a WordPress Application Password) it also
 * reads drafts, private and scheduled content, revisions counts and reusable blocks.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "media/wp-audit");
const BASE = "https://www.kuc.org.au";
const UA = "Mozilla/5.0 (KUC site migration audit)";
const AUTH = process.env.WP_USER && process.env.WP_APP_PASSWORD
  ? "Basic " + Buffer.from(`${process.env.WP_USER}:${process.env.WP_APP_PASSWORD.replace(/\s+/g, "")}`).toString("base64")
  : null;

fs.mkdirSync(path.join(OUT, "content"), { recursive: true });
fs.mkdirSync(path.join(OUT, "terms"), { recursive: true });
const write = (name, data) =>
  fs.writeFileSync(path.join(OUT, name), typeof data === "string" ? data : JSON.stringify(data, null, 1) + "\n");

async function get(url, { auth = false, redirect = "follow", tries = 3 } = {}) {
  const headers = { "User-Agent": UA };
  if (auth && AUTH) headers.Authorization = AUTH;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers, redirect, signal: AbortSignal.timeout(30000) });
      if (r.status < 500) return r;
    } catch {}
    await new Promise((res) => setTimeout(res, 1500 * (i + 1)));
  }
  return null;
}
const json = async (url, opts) => {
  const r = await get(url, opts);
  if (!r || !r.ok) return null;
  try { return { data: await r.json(), headers: r.headers }; } catch { return null; }
};

/** Runs fn over items, n at a time. */
async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); }
  }));
  return out;
}

// 1. REST index: namespaces show which plugins expose an API.
const index = (await json(`${BASE}/wp-json/`))?.data ?? {};
const rest = {
  name: index.name, url: index.url, namespaces: index.namespaces ?? [],
  routes: Object.keys(index.routes ?? {}),
  authenticated: !!AUTH,
};
if (AUTH) {
  const me = await json(`${BASE}/wp-json/wp/v2/users/me?context=edit`, { auth: true });
  rest.user = me ? { name: me.data.name, roles: me.data.roles, capabilities: Object.keys(me.data.capabilities ?? {}).filter((c) => me.data.capabilities[c]) } : "login failed";
}
write("rest.json", rest);

// Logged in: everything the account can see beyond the public site. Editor access returns drafts,
// private pages, reusable blocks and revisions; Admin access also returns plugins (with versions,
// which shows paid editions), site settings, menus and the Redirection plugin's full rule list.
if (AUTH) {
  const tries = {
    plugins: "wp/v2/plugins?context=edit",
    settings: "wp/v2/settings",
    menus: "wp/v2/menus?per_page=100",
    menuItems: "wp/v2/menu-items?per_page=100",
    blocks: "wp/v2/blocks?per_page=100&context=edit",
    users: "wp/v2/users?per_page=100&context=edit",
    redirects: "redirection/v1/redirect?per_page=200",
    redirectGroups: "redirection/v1/group",
    yoastSettings: "yoast/v1/configuration",
  };
  const authed = {};
  for (const [k, route] of Object.entries(tries)) {
    const r = await get(`${BASE}/wp-json/${route}`, { auth: true });
    authed[k] = { status: r?.status ?? 0 };
    if (r?.ok) {
      try { authed[k].data = await r.json(); } catch {}
    }
  }
  // Users: keep names and roles only, never emails.
  if (Array.isArray(authed.users?.data)) authed.users.data = authed.users.data.map((u) => ({ name: u.name, roles: u.roles }));
  if (authed.settings?.data) delete authed.settings.data.email;
  write("logged-in.json", authed);
  console.log("logged in:", Object.entries(authed).map(([k, v]) => `${k} ${v.status}`).join(", "));
}
console.log(`rest: ${rest.namespaces.length} namespaces, auth ${AUTH ? "on" : "off"}`);

// 2. Post types and taxonomies.
const types = (await json(`${BASE}/wp-json/wp/v2/types${AUTH ? "?context=edit" : ""}`, { auth: true }))?.data ?? {};
const taxonomies = (await json(`${BASE}/wp-json/wp/v2/taxonomies`, { auth: true }))?.data ?? {};
write("types.json", {
  types: Object.fromEntries(Object.entries(types).map(([k, t]) => [k, { name: t.name, rest_base: t.rest_base, taxonomies: t.taxonomies, viewable: t.viewable }])),
  taxonomies: Object.fromEntries(Object.entries(taxonomies).map(([k, t]) => [k, { name: t.name, rest_base: t.rest_base, types: t.types }])),
});

// 3. Every item of every content type, with full HTML.
const SKIP = new Set(["attachment", "nav_menu_item", "wp_template", "wp_template_part", "wp_global_styles", "wp_navigation", "wp_font_family", "wp_font_face"]);
async function all(base, params) {
  const rows = [];
  let pages = 1;
  for (let p = 1; p <= pages; p++) {
    const res = await json(`${BASE}/wp-json/wp/v2/${base}?per_page=100&page=${p}&${params}`, { auth: true });
    if (!res) break;
    pages = Number(res.headers.get("x-wp-totalpages") ?? 1);
    if (Array.isArray(res.data)) rows.push(...res.data);
  }
  return rows;
}
const contentCounts = {};
for (const [key, t] of Object.entries(types)) {
  if (SKIP.has(key) || !t.rest_base) continue;
  const params = AUTH ? "status=publish,draft,private,future,pending&context=edit" : "";
  const rows = await all(t.rest_base, params);
  const slim = rows.map((r) => ({
    id: r.id, type: r.type, status: r.status, slug: r.slug, link: r.link, date: r.date, modified: r.modified,
    parent: r.parent, menu_order: r.menu_order, template: r.template, author: r.author,
    title: r.title?.raw ?? r.title?.rendered, excerpt: r.excerpt?.rendered,
    featured_media: r.featured_media, categories: r.categories, tags: r.tags,
    acf: r.acf && Object.keys(r.acf).length ? r.acf : undefined,
    meta: r.meta && Object.keys(r.meta).length ? r.meta : undefined,
    yoast: r.yoast_head_json ? {
      title: r.yoast_head_json.title, description: r.yoast_head_json.description,
      canonical: r.yoast_head_json.canonical, robots: r.yoast_head_json.robots,
      og_image: r.yoast_head_json.og_image?.[0]?.url,
      schema: (r.yoast_head_json.schema?.["@graph"] ?? []).map((g) => g["@type"]).flat(),
    } : undefined,
    html: r.content?.rendered, raw: r.content?.raw,
  }));
  if (slim.length) write(`content/${key}.json`, slim);
  contentCounts[key] = slim.reduce((a, r) => ((a[r.status] = (a[r.status] ?? 0) + 1), a), {});
  console.log(`${key}: ${slim.length}`);
}

// 4. Terms.
for (const [key, t] of Object.entries(taxonomies)) {
  if (!t.rest_base) continue;
  const rows = await all(t.rest_base, "_fields=id,name,slug,count,parent,link,description");
  write(`terms/${key}.json`, rows);
}

// 5. Users who appear as authors, and comments (are any approved comments shown?).
const users = await all("users", "_fields=id,name,slug,link");
const comments = await json(`${BASE}/wp-json/wp/v2/comments?per_page=1`);
const extra = { authors: users, comments: Number(comments?.headers.get("x-wp-total") ?? 0) };

// 6. Sitemaps and robots.
async function sitemap(url, seen = new Set()) {
  if (seen.has(url)) return [];
  seen.add(url);
  const r = await get(url);
  if (!r || !r.ok) return [];
  const xml = await r.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (/<sitemapindex/.test(xml)) return (await Promise.all(locs.map((l) => sitemap(l, seen)))).flat();
  const mods = [...xml.matchAll(/<url>[\s\S]*?<loc>([^<]+)<\/loc>(?:[\s\S]*?<lastmod>([^<]+)<\/lastmod>)?/g)];
  return mods.map((m) => ({ url: m[1].trim(), lastmod: m[2], sitemap: url }));
}
const sitemapUrls = await sitemap(`${BASE}/sitemap_index.xml`);
write("sitemaps.json", sitemapUrls);
write("robots.txt", (await (await get(`${BASE}/robots.txt`))?.text()) ?? "");
console.log(`sitemaps: ${sitemapUrls.length}`);

// 7. Crawl each page and record what it runs and collects.
const decode = (s = "") => s.replace(/&amp;/g, "&").replace(/&#038;/g, "&").replace(/&quot;/g, '"').replace(/&#8211;/g, "-").replace(/&nbsp;/g, " ");
const attr = (tag, name) => decode(tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"))?.slice(2).find((x) => x !== undefined) ?? "");
const text = (html) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

function inspect(html, pageUrl) {
  const host = new URL(pageUrl).host;
  const abs = (u) => { try { return new URL(u, pageUrl).href; } catch { return null; } };
  const plugins = [...new Set([...html.matchAll(/wp-content\/plugins\/([a-z0-9_-]+)\//gi)].map((m) => m[1]))];
  const themes = [...new Set([...html.matchAll(/wp-content\/themes\/([a-z0-9_-]+)\//gi)].map((m) => m[1]))];
  const scripts = [...new Set([...html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)].map((m) => abs(decode(m[1]))).filter(Boolean))]
    .filter((u) => !u.includes(host));
  const ids = {
    gtm: [...new Set(html.match(/GTM-[A-Z0-9]{4,10}/g) ?? [])],
    ga4: [...new Set(html.match(/\bG-[A-Z0-9]{6,12}\b/g) ?? [])],
    ua: [...new Set(html.match(/\bUA-\d{4,10}-\d{1,3}\b/g) ?? [])],
    googleAds: [...new Set(html.match(/\bAW-\d{6,12}\b/g) ?? [])],
    metaPixel: [...new Set([...html.matchAll(/fbq\(\s*['"]init['"]\s*,\s*['"](\d+)['"]/g)].map((m) => m[1]))],
    hotjar: [...new Set([...html.matchAll(/hjid\s*:\s*(\d+)/g)].map((m) => m[1]))],
    linkedin: [...new Set([...html.matchAll(/_linkedin_partner_id\s*=\s*["']?(\d+)/g)].map((m) => m[1]))],
    tiktok: [...new Set([...html.matchAll(/ttq\.load\(\s*['"]([A-Z0-9]+)['"]/g)].map((m) => m[1]))],
    recaptcha: /recaptcha/i.test(html), monsterinsights: /monsterinsights/i.test(html),
  };
  const iframes = [...html.matchAll(/<iframe\b[^>]*>/gi)].map((m) => abs(attr(m[0], "src") || attr(m[0], "data-src"))).filter(Boolean);
  const forms = [...html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)].map((m) => {
    const tag = `<form ${m[1]}>`;
    const body = m[2];
    const fields = [...body.matchAll(/<(input|select|textarea)\b[^>]*>/gi)].map((f) => ({
      tag: f[1].toLowerCase(), type: attr(f[0], "type") || f[1].toLowerCase(), name: attr(f[0], "name"),
      required: /\brequired\b|aria-required=["']true/i.test(f[0]),
      value: attr(f[0], "type") === "hidden" ? attr(f[0], "value").slice(0, 120) : undefined,
    })).filter((f) => f.name && !["submit", "button"].includes(f.type));
    const labels = [...body.matchAll(/<label\b[^>]*>([\s\S]*?)<\/label>/gi)].map((l) => text(l[1])).filter(Boolean);
    const cls = attr(tag, "class"), id = attr(tag, "id");
    const plugin = /gform/.test(cls + id) ? "Gravity Forms" : /wpcf7/.test(cls + body) ? "Contact Form 7"
      : /wpforms/.test(cls + id) ? "WPForms" : /nf-form|ninja/.test(cls + body) ? "Ninja Forms"
      : /elementor/.test(cls) ? "Elementor" : /search/.test(cls + id + attr(tag, "role")) || fields.some((f) => f.name === "s") ? "Search"
      : /mc4wp|mailchimp/.test(cls + body) ? "Mailchimp" : /hs-form/.test(cls) ? "HubSpot" : "Unknown";
    return { plugin, id, action: abs(attr(tag, "action")) ?? "", method: attr(tag, "method") || "get", fields, labels: [...new Set(labels)].slice(0, 40) };
  }).filter((f) => f.plugin !== "Search");
  const links = [...html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"'#][^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)].map((m) => ({ href: abs(decode(m[1])), label: text(m[2]).slice(0, 80) })).filter((l) => l.href);
  const outbound = links.filter((l) => /^https?:/.test(l.href) && !new URL(l.href).host.endsWith("kuc.org.au"));
  const files = links.filter((l) => /\/wp-content\/uploads\/.+\.(pdf|docx?|xlsx?|pptx?|zip|csv)$/i.test(l.href)).map((l) => l.href);
  const videos = [...new Set([...html.matchAll(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/|player\.vimeo\.com\/video\/|vimeo\.com\/)([A-Za-z0-9_-]{6,})/g)].map((m) => m[0]))];
  const jsonld = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].flatMap((m) => {
    try { const d = JSON.parse(m[1]); return (d["@graph"] ?? [d]).map((g) => g["@type"]).flat(); } catch { return []; }
  });
  const meta = {
    title: text(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? ""),
    robots: attr(html.match(/<meta[^>]+name=["']robots["'][^>]*>/i)?.[0] ?? "", "content"),
    canonical: attr(html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0] ?? "", "href"),
    bodyClass: attr(html.match(/<body\b[^>]*>/i)?.[0] ?? "", "class").split(/\s+/).filter((c) => /^(page-template|elementor|wp-theme|theme-)/.test(c)),
  };
  // Donation and form embeds (Raisely, Giveasy, Salesforce widgets) show up as tags or inline config.
  const widgets = [...new Set([
    ...[...html.matchAll(/<(?!a\b|link\b)[a-z]+\b[^>]*(?:raisely|giveasy|giveeasy|npsp|salesforce|data-campaign|data-profile)[^>]*>/gi)].map((m) => m[0].slice(0, 300)),
    ...[...html.matchAll(/(?:Raisely|raisely)[\w.]*\s*\([^)]{0,200}\)|campaign(?:Uuid|Path|Id)\s*[:=]\s*["'][^"']+["']/g)].map((m) => m[0].slice(0, 300)),
  ])].slice(0, 12);
  const popups = /popup|modal|optin|subscribe-box|elementor-popup/i.test(html) ? [...new Set(html.match(/(?:pum|popup|elementor-popup)[-_a-z0-9]*/gi) ?? [])].slice(0, 10) : [];
  return { meta, plugins, themes, scripts, ids, iframes, forms, outbound, files, videos, jsonld, widgets, popups };
}

const contentLinks = fs.readdirSync(path.join(OUT, "content")).flatMap((f) =>
  JSON.parse(fs.readFileSync(path.join(OUT, "content", f), "utf8")).filter((r) => r.status === "publish").map((r) => r.link));
const toCrawl = [...new Set([BASE + "/", ...sitemapUrls.map((s) => s.url), ...contentLinks])].filter((u) => u?.startsWith(BASE));
const crawl = (await pool(toCrawl, 4, async (url) => {
  const r = await get(url);
  if (!r) return { url, error: "no response" };
  const html = r.ok ? await r.text() : "";
  return { url, status: r.status, finalUrl: r.url !== url ? r.url : undefined, ...(html ? inspect(html, r.url) : {}) };
}));
write("crawl.json", crawl);

// Full HTML of the pages that embed payment or form widgets, to read their settings.
fs.mkdirSync(path.join(OUT, "html"), { recursive: true });
for (const p of ["/regular-donation/", "/donate-your-car-towing-contributions/", "/partner-donations/", "/return-to-give/", "/silent_auction/", "/get-involved/donate-your-car/", "/about/contact/", "/target450/", "/get-involved/donate-your-car-drop-off-locations/"]) {
  const r = await get(BASE + p);
  if (r?.ok) fs.writeFileSync(path.join(OUT, "html", p.replace(/^\/|\/$/g, "").replace(/\//g, "__") + ".html"), await r.text());
}
for (const [name, url] of [["salesforce-donateyourcar", "https://kuc.my.salesforce-sites.com/Donateyourcar"], ["npsp-dropin", "https://connect.kuc.org.au/resource/npsp_plus__DonateDropIn/dropin.js"]]) {
  const r = await get(url);
  if (r?.ok) fs.writeFileSync(path.join(OUT, "html", name + (url.endsWith(".js") ? ".js" : ".html")), await r.text());
}
console.log(`crawled: ${crawl.length}`);

// 8. The other KUC sites seen in GA4 (donation platform, car form, portal, connect).
const externalUrls = [
  "https://donatenow.kuc.org.au/", "https://donatenow.kuc.org.au/2026-giving-day/donate", "https://donatenow.kuc.org.au/futures-for-kids/donate",
  "https://donatenow.kuc.org.au/christmas/brents-story", "https://donatenow.kuc.org.au/aminahs-story/donate", "https://donatenow.kuc.org.au/big-build-4-kids-2025/donate",
  "https://kids-under-cover.giveeasy.org/", "https://connect.kuc.org.au/", "https://connect.kuc.org.au/donateyourcar",
  "https://kuc.my.salesforce-sites.com/Donateyourcar", "https://kuc.my.salesforce-sites.com/",
  "https://kuc.my.site.com/portal/s/login/", "https://cubbyhousechallenge.org.au/", "https://offer.autograb.com.au/",
  `${BASE}/regular-donation/`, `${BASE}/get-involved/donate/`, `${BASE}/sign-up-for-our-newsletter/`, `${BASE}/about/contact/`,
];
const external = await pool(externalUrls, 3, async (url) => {
  const r = await get(url);
  if (!r) return { url, error: "no response" };
  const html = r.ok ? await r.text() : "";
  const platform = /giveasy|giveeasy/i.test(html) ? "Giveasy" : /salesforce|visualforce|force\.com/i.test(html) ? "Salesforce"
    : /ng-app|angular/i.test(html) ? "Angular app" : /wp-content/.test(html) ? "WordPress" : undefined;
  return { url, status: r.status, finalUrl: r.url !== url ? r.url : undefined, platform, angular: (html.match(/angular(?:\.min)?\.js[^"']*|angularjs\/[\d.]+/i) ?? [])[0], ...(html ? inspect(html, r.url) : {}) };
});
write("external.json", external);

// 9. How the live site answers every address people actually visit (GA4, two years).
const gaFile = path.join(ROOT, "docs/audit/ga-paths.tsv");
const gaPaths = fs.existsSync(gaFile) ? fs.readFileSync(gaFile, "utf8").trim().split("\n").slice(1).map((l) => l.split("\t")[1]).filter(Boolean) : [];
const redirects = await pool([...new Set(gaPaths)], 4, async (p) => {
  const r = await get(BASE + p, { redirect: "manual" });
  return { path: p, status: r?.status ?? 0, location: r?.headers.get("location") ?? undefined };
});
write("redirects.json", redirects);

// 10. Roll up.
const count = (arr) => Object.entries(arr.reduce((a, k) => ((a[k] = (a[k] ?? 0) + 1), a), {})).sort((a, b) => b[1] - a[1]);
const pagesOk = crawl.filter((c) => c.meta);
const summary = {
  generated: new Date().toISOString(), authenticated: !!AUTH,
  restNamespaces: rest.namespaces, content: contentCounts, ...extra,
  sitemapUrls: sitemapUrls.length, crawled: crawl.length, crawlErrors: crawl.filter((c) => !c.meta).map((c) => ({ url: c.url, status: c.status })),
  plugins: count(pagesOk.flatMap((c) => c.plugins)), themes: count(pagesOk.flatMap((c) => c.themes)),
  scriptHosts: count(pagesOk.flatMap((c) => c.scripts.map((s) => { try { return new URL(s).host; } catch { return s; } }))),
  trackingIds: Object.fromEntries(Object.keys(pagesOk[0]?.ids ?? {}).map((k) => [k, [...new Set(pagesOk.flatMap((c) => [c.ids[k]].flat()))]])),
  forms: Object.values(pagesOk.flatMap((c) => c.forms.map((f) => ({ ...f, page: c.url }))).reduce((a, f) => {
    const key = `${f.plugin}|${f.id}|${f.action}`;
    (a[key] ??= { plugin: f.plugin, id: f.id, action: f.action, fields: f.fields, labels: f.labels, pages: [] }).pages.push(f.page);
    return a;
  }, {})),
  iframes: count(pagesOk.flatMap((c) => c.iframes)),
  widgets: pagesOk.filter((c) => c.widgets.length).map((c) => ({ url: c.url, widgets: c.widgets })),
  videos: count(pagesOk.flatMap((c) => c.videos)),
  outboundHosts: count(pagesOk.flatMap((c) => c.outbound.map((l) => new URL(l.href).host))),
  files: count(pagesOk.flatMap((c) => c.files)),
  jsonld: count(pagesOk.flatMap((c) => c.jsonld)),
  templates: count(pagesOk.flatMap((c) => c.meta.bodyClass)),
  noindex: pagesOk.filter((c) => /noindex/.test(c.meta.robots)).map((c) => c.url),
  liveRedirects: redirects.filter((r) => r.status >= 300 && r.status < 400),
  liveMissing: redirects.filter((r) => r.status >= 400 || r.status === 0).map((r) => `${r.status} ${r.path}`),
  external: external.map((e) => ({ url: e.url, status: e.status, finalUrl: e.finalUrl, platform: e.platform, angular: e.angular, forms: e.forms?.length, iframes: e.iframes, ids: e.ids, scriptHosts: [...new Set((e.scripts ?? []).map((s) => { try { return new URL(s).host; } catch { return s; } }))] })),
};
write("summary.json", summary);
console.log("done");
