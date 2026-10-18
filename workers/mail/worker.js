/*
 * oriela-mail: email capture + simple analytics + status checks for the Oriela sites.
 * Plain JS, no build step. Paste into the Cloudflare Workers dashboard editor.
 *
 * KV binding required: MAIL_KV
 * Secret required: ADMIN_PASSWORD
 *
 * Endpoints:
 *   POST /api/join         {site, email} -> validate, store, {ok:true}        (CORS: *)
 *   POST /api/view         {site} -> bump view counters, {ok:true}            (CORS: *)
 *   GET  /api/admin/signups?password=PW -> {site: [{email, at}]}              (CORS: admin origin only)
 *   GET  /api/admin/stats?password=PW   -> {views, viewsToday}               (CORS: admin origin only)
 *   GET  /api/admin/status?password=PW  -> [{url, ok, ms}]                   (CORS: admin origin only)
 */

var STATUS_URLS = [
  "https://orielaco.com",
  "https://oriela-studio.pages.dev",
  "https://proving-ground-6bv.pages.dev",
  "https://podcast-repurposing.pages.dev",
  "https://hearth-key.pages.dev",
  "https://half-frame.pages.dev",
  "https://proof-lab.pages.dev",
  "https://unplugged-kit.pages.dev",
];

// Origins allowed to call the admin endpoints. Keep this tight: only the
// admin panel's own origin. Public endpoints use Access-Control-Allow-Origin: *.
var ADMIN_ORIGINS = ["https://orielaco.com", "https://www.orielaco.com"];

var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var SITE_RE = /^[a-z0-9-]{1,40}$/;

// --- tiny in-memory per-IP rate limiter (best effort, per isolate) ---
var hits = new Map(); // ip -> {count, reset}
function rateLimited(ip, limit, windowMs) {
  var now = Date.now();
  var h = hits.get(ip);
  if (!h || now > h.reset) {
    hits.set(ip, { count: 1, reset: now + windowMs });
    return false;
  }
  h.count += 1;
  return h.count > limit;
}

function json(data, status, corsOrigin) {
  var headers = { "Content-Type": "application/json" };
  if (corsOrigin) headers["Access-Control-Allow-Origin"] = corsOrigin;
  return new Response(JSON.stringify(data), { status: status || 200, headers: headers });
}

function todayUTC() {
  return new Date().toISOString().slice(0, 10); // yyyy-mm-dd
}

function adminCors(request) {
  var origin = request.headers.get("Origin") || "";
  return ADMIN_ORIGINS.indexOf(origin) !== -1 ? origin : null;
}

function authed(url, env) {
  return url.searchParams.get("password") === env.ADMIN_PASSWORD;
}

async function handleJoin(request, env) {
  var ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (rateLimited(ip, 10, 60000)) {
    return json({ ok: false, error: "slow down" }, 429, "*");
  }
  var body;
  try { body = await request.json(); }
  catch (e) { return json({ ok: false, error: "bad json" }, 400, "*"); }
  var site = String(body.site || "").toLowerCase().trim();
  var email = String(body.email || "").toLowerCase().trim();
  if (!SITE_RE.test(site)) return json({ ok: false, error: "bad site" }, 400, "*");
  if (!EMAIL_RE.test(email) || email.length > 120) {
    return json({ ok: false, error: "bad email" }, 400, "*");
  }
  var key = "signup:" + site + ":" + Date.now() + ":" + email;
  await env.MAIL_KV.put(key, JSON.stringify({ site: site, email: email, at: Date.now() }));
  return json({ ok: true }, 200, "*");
}

async function handleView(request, env) {
  // Never fail the page: any KV error is swallowed.
  try {
    var body = await request.json();
    var site = String((body && body.site) || "").toLowerCase().trim();
    if (!SITE_RE.test(site)) return json({ ok: true }, 200, "*");
    var day = todayUTC();
    var totalKey = "views:" + site;
    var dayKey = "views:" + site + ":" + day;
    var cur = parseInt((await env.MAIL_KV.get(totalKey)) || "0", 10) || 0;
    var curDay = parseInt((await env.MAIL_KV.get(dayKey)) || "0", 10) || 0;
    await env.MAIL_KV.put(totalKey, String(cur + 1));
    // Daily counters expire after 45 days so KV does not grow forever.
    await env.MAIL_KV.put(dayKey, String(curDay + 1), { expirationTtl: 45 * 86400 });
  } catch (e) { /* swallow */ }
  return json({ ok: true }, 200, "*");
}

function parseSignupKey(key) {
  // key = "signup:<site>:<ts>:<email>"
  var rest = key.slice("signup:".length).split(":");
  if (rest.length < 3) return null;
  return { site: rest[0], at: parseInt(rest[1], 10) || 0, email: rest.slice(2).join(":") };
}

async function handleSignups(url, env) {
  if (!authed(url, env)) return json({ ok: false }, 403);
  var grouped = {};
  var cursor = undefined;
  do {
    var page = await env.MAIL_KV.list({ prefix: "signup:", cursor: cursor });
    for (var i = 0; i < page.keys.length; i++) {
      var p = parseSignupKey(page.keys[i].name);
      if (!p) continue;
      if (!grouped[p.site]) grouped[p.site] = [];
      grouped[p.site].push({ email: p.email, at: p.at });
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  Object.keys(grouped).forEach(function (s) {
    grouped[s].sort(function (a, b) { return b.at - a.at; });
  });
  return json(grouped);
}

async function handleStats(url, env) {
  if (!authed(url, env)) return json({ ok: false }, 403);
  var views = {}, viewsToday = {};
  var day = todayUTC();
  var cursor = undefined;
  do {
    var page = await env.MAIL_KV.list({ prefix: "views:", cursor: cursor });
    for (var i = 0; i < page.keys.length; i++) {
      var name = page.keys[i].name; // "views:<site>" or "views:<site>:<yyyy-mm-dd>"
      var val = parseInt((await env.MAIL_KV.get(name)) || "0", 10) || 0;
      var parts = name.slice("views:".length).split(":");
      if (parts.length === 1) views[parts[0]] = val;
      else if (parts.length === 2 && parts[1] === day) viewsToday[parts[0]] = val;
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  return json({ views: views, viewsToday: viewsToday });
}

async function checkOne(url) {
  var start = Date.now();
  try {
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 8000);
    var res = await fetch(url, { method: "GET", signal: ctrl.signal, redirect: "follow" });
    clearTimeout(timer);
    // Drain nothing: we only need the status line.
    return { url: url, ok: res.ok, ms: Date.now() - start };
  } catch (e) {
    return { url: url, ok: false, ms: Date.now() - start };
  }
}

async function handleStatus(url, env) {
  if (!authed(url, env)) return json({ ok: false }, 403);
  var results = await Promise.all(STATUS_URLS.map(checkOne));
  return json(results);
}

export default {
  async fetch(request, env) {
    var url = new URL(request.url);
    var path = url.pathname;

    // CORS preflight for the public endpoints.
    if (request.method === "OPTIONS" && (path === "/api/join" || path === "/api/view")) {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    if (path === "/api/join" && request.method === "POST") return handleJoin(request, env);
    if (path === "/api/view" && request.method === "POST") return handleView(request, env);

    if (path === "/api/admin/signups" && request.method === "GET") {
      var r1 = await handleSignups(url, env);
      var o1 = adminCors(request);
      if (o1) r1.headers.set("Access-Control-Allow-Origin", o1);
      return r1;
    }
    if (path === "/api/admin/stats" && request.method === "GET") {
      var r2 = await handleStats(url, env);
      var o2 = adminCors(request);
      if (o2) r2.headers.set("Access-Control-Allow-Origin", o2);
      return r2;
    }
    if (path === "/api/admin/status" && request.method === "GET") {
      var r3 = await handleStatus(url, env);
      var o3 = adminCors(request);
      if (o3) r3.headers.set("Access-Control-Allow-Origin", o3);
      return r3;
    }

    return json({ ok: false, error: "not found" }, 404);
  },
};
