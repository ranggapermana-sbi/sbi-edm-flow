// Account actions for super admins (Access page): create an account with a temporary
// password, set a temporary password, block or unblock sign-in.
// Admins never see the passwords people choose; a temporary password must be changed
// by its owner at the next sign-in (user_metadata.must_change_password).
// Needs SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SECRET_KEY (server only).

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FOREVER = "876000h"; // about 100 years

async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST." });
  const base = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
  const anon = process.env.SUPABASE_ANON_KEY;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!base || !anon || !secret) return res.status(503).json({ error: "Account management is not set up on the server." });

  // 1. Who is calling, and are they a super admin? (checked with their own login)
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ error: "Sign in first." });
  const asCaller = { apikey: anon, authorization: `Bearer ${token}`, "content-type": "application/json" };
  const me = await fetch(`${base}/auth/v1/user`, { headers: asCaller });
  if (!me.ok) return res.status(401).json({ error: "Your session expired. Sign in again." });
  const caller = await me.json();
  const adm = await fetch(`${base}/rest/v1/rpc/is_admin`, { method: "POST", headers: asCaller, body: "{}" });
  if (!adm.ok || (await adm.json()) !== true) return res.status(403).json({ error: "Only super admins can manage accounts." });

  let body;
  try { body = await readJson(req); } catch { return res.status(400).json({ error: "Invalid request." }); }
  const { action, user_id: userId, email, password } = body || {};
  const admin = { apikey: secret, "content-type": "application/json" }; // new secret keys go on apikey only
  const call = async (path, method, payload) => {
    const r = await fetch(`${base}/auth/v1/admin${path}`, { method, headers: admin, body: JSON.stringify(payload) });
    const text = await r.text();
    let data = {};
    try { data = text ? JSON.parse(text) : {}; } catch {}
    if (!r.ok) {
      const msg = data.msg || data.message || data.error_description || data.error || `Error ${r.status}`;
      const e = new Error(/already.*registered|exists/i.test(msg) ? "This email already has an account. Use Reset password instead." : msg);
      e.status = r.status >= 500 ? 502 : 400;
      throw e;
    }
    return data;
  };
  const checkPassword = () => {
    if (typeof password !== "string" || password.length < 8 || password.length > 72) {
      const e = new Error("The temporary password needs 8 to 72 characters."); e.status = 400; throw e;
    }
  };

  try {
    if (action === "create") {
      if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) return res.status(400).json({ error: "Enter a valid email address." });
      checkPassword();
      const u = await call("/users", "POST", {
        email: email.trim().toLowerCase(), password, email_confirm: true,
        user_metadata: { must_change_password: true, created_by: caller.email },
      });
      return res.status(200).json({ ok: true, user_id: u.id });
    }
    if (!UUID_RE.test(userId || "")) return res.status(400).json({ error: "Unknown account." });
    if (action === "set_password") {
      checkPassword();
      await call(`/users/${userId}`, "PUT", { password, user_metadata: { must_change_password: true } });
      return res.status(200).json({ ok: true });
    }
    if (action === "block" || action === "unblock") {
      if (action === "block" && userId === caller.id) return res.status(400).json({ error: "You cannot block your own account." });
      await call(`/users/${userId}`, "PUT", { ban_duration: action === "block" ? FOREVER : "none" });
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ error: "Unknown action." });
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.message || "Something went wrong." });
  }
}
