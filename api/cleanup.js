// Daily cleanup: deletes tickets (with their reviews and screenshots) created more
// than 3 months and 1 day ago, so the free Supabase database and storage stay small.
// Runs from the Vercel cron in vercel.json. Vercel sends "Authorization: Bearer <CRON_SECRET>".
// Needs SUPABASE_URL, SUPABASE_SECRET_KEY (server only, never sent to the browser) and CRON_SECRET.

const BUCKET = "screenshots";
const BATCH = 100;

export function cutoffIso(now = new Date()) {
  // 3 calendar months back (31 May -> 28/29 Feb, not 3 Mar), then one more day
  const d = new Date(now.getTime());
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() - 3);
  const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(day, last) - 1);
  return d.toISOString();
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: "Not allowed." });
  }
  const base = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!base || !key) return res.status(503).json({ error: "Cleanup is not set up." });

  // new Supabase secret keys are not JWTs: send them on the apikey header only
  const headers = { apikey: key, "content-type": "application/json" };
  const call = async (path, init = {}) => {
    const r = await fetch(base + path, { ...init, headers: { ...headers, ...(init.headers || {}) } });
    const text = await r.text();
    if (!r.ok) throw new Error(`${init.method || "GET"} ${path.split("?")[0]} -> ${r.status} ${text.slice(0, 200)}`);
    return text ? JSON.parse(text) : null;
  };

  const cutoff = cutoffIso();
  const result = { cutoff, tickets: 0, files: 0, errors: [] };
  try {
    const old = await call(
      `/rest/v1/tickets?select=id,owner&created_at=lt.${encodeURIComponent(cutoff)}&order=created_at.asc&limit=${BATCH}`
    );
    const done = [];
    for (const t of old || []) {
      try {
        const prefix = `${t.owner}/${t.id}`;
        const files = await call(`/storage/v1/object/list/${BUCKET}`, {
          method: "POST",
          body: JSON.stringify({ prefix, limit: 1000, offset: 0 }),
        });
        const paths = (files || []).filter((f) => f && f.name && f.id).map((f) => `${prefix}/${f.name}`);
        for (let i = 0; i < paths.length; i += BATCH) {
          await call(`/storage/v1/object/${BUCKET}`, {
            method: "DELETE",
            body: JSON.stringify({ prefixes: paths.slice(i, i + BATCH) }),
          });
        }
        result.files += paths.length;
        done.push(t.id);
      } catch (e) {
        // keep the ticket so its screenshots are tried again tomorrow
        result.errors.push(`${t.id}: ${e.message}`);
      }
    }
    if (done.length) {
      const list = done.map((id) => `"${id}"`).join(",");
      await call(`/rest/v1/tickets?id=in.(${encodeURIComponent(list)})`, {
        method: "DELETE",
        headers: { prefer: "return=minimal" },
      });
      result.tickets = done.length; // reviews are removed with their ticket (on delete cascade)
    }
  } catch (e) {
    result.errors.push(e.message);
    console.error("cleanup failed", JSON.stringify(result));
    return res.status(500).json(result);
  }
  console.log("cleanup done", JSON.stringify(result));
  return res.status(200).json(result);
}
