// Visual check: sends the EDM screenshot slices to Claude and returns findings.
// Only signed-in portal users can call it, and the prompt is built here on the
// server so the API key cannot be used for anything else.

const MAX_IMAGES = 8;
const MAX_IMAGE_BASE64 = 1_400_000; // about 1 MB per slice
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

const OFFER_LABELS = new Set(["Room package", "F&B package", "Social event", "Meeting package"]);

function clean(value, max = 200) {
  return String(value ?? "").replace(/[\u0000-\u001f]/g, " ").slice(0, max).trim();
}

async function userFromToken(token) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key || !token) return null;
  const r = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: key, Authorization: `Bearer ${token}` },
  });
  if (!r.ok) return null;
  return r.json();
}

function buildPrompt(ctx, imageCount) {
  const verified = ctx.verified.length
    ? `
ALREADY VERIFIED FROM THE EMAIL HTML (exact, not by eye). Treat these as pass and do not raise them again:
${ctx.verified.map((v) => "- " + v).join("\n")}
`
    : "";
  return `You are checking a hotel marketing email (EDM) for SBI (Swiss-Belhotel International) against the group's 2026 EDM template guideline, before it is sent to the Group Digital Marketing team for approval.
The ${imageCount} image(s) are ONE email, a full-page screenshot cut top to bottom into consecutive slices (image 1 is the top).

Hotel: ${ctx.hotelName} (${ctx.hotelCode}). Brand: ${ctx.brandName}. Brand color: ${ctx.brandHex}.
Campaign: ${ctx.campaign || "(not given)"}. Main offer type stated by the hotel: ${ctx.offerLabel}. Subject line: ${ctx.subject || "(not given)"}.

GUIDELINE
1. General: background off-white (#fffffb); body text dark grey (#5f5f5f) in Helvetica Neue; section titles in Georgia italic, dark brown (#5e4501); dividers are thin grey lines (#b4adad). Every image loads fully (no broken, blank, half-loaded or overlapping images). No spelling mistakes in the visible copy. Prices show currency and whether they are nett.
2. Hotel logo: this hotel's horizontal international logo, centred at the top, with a divider below it.
3. Main offer: one HD hero image (sharp, legible text); a room package is highly recommended as the main offer; optional supporting text or images; one button with the text "Book Now" in the brand color; a divider below the button.
4. Other offers, under the title "Explore More Offers": each with an HD image, a title, a description of at most 160 characters and a button. Button text must be exactly "Book Now" for room packages and exactly "Reserve" for every other package (F&B, social events, weddings, meetings). Every button uses the brand color ${ctx.brandHex}. A divider below the last offer.
5. About SBEC: swiss-bel executive logo, "Our Loyalty Program", "#instantbenefits" and "Sign up" shown in the brand color ${ctx.brandHex}.
6. Footer banner: the current "One App Many Benefits" mobile app banner from Group Marcomm, complete with the QR code and store badges, not cropped, distorted or overlapped.
7. Footer email: dark footer with social icons, the country list, this hotel's address and local phone number, the group brand logos, the copyright line and an unsubscribe link. Nothing extra added (for example extra social icons beyond email, Facebook, Instagram, YouTube and LinkedIn).

Dividers are 1px grey lines that often disappear when a screenshot is downscaled or fall exactly on the edge between two slices. Never mark a divider rule as "fail"; mark it "pass" when you see the line or the sections are clearly separated, and use "warn" only if two sections visibly run into each other.
Hotels have creative freedom over copy and visuals: the wording and tone of titles and descriptions, emojis, capitalisation and styling of headings and offer titles (underlined or not), and the design of hero and offer images are their choice. Do not flag any of these. The only copy rules are the button texts, the 160-character description limit, spelling mistakes and prices.
Check only what is visible. Alt text, title text and link targets are invisible in a screenshot, so do not report on them. Compare colors by eye; small rendering differences are fine, a clearly different hue is a fail.
${verified}
Reply with only JSON in this shape:
{"summary":"one or two sentences on the overall result","findings":[{"section":"Hotel logo|Main offer|Other offers|About SBEC|Footer banner|Footer email|General","status":"pass|warn|fail","check":"short rule name","detail":"what you see, quoting the exact button text or heading where useful"}]}
Status rules: "pass" when what you see matches the guideline, even if you cannot measure it exactly. "fail" for a clear breach. "warn" only for a concrete, likely problem you can name (for example a blurry hero, a cut-off banner, text that looks like a typo). Never use "warn" just because you are unsure or would like a person to double-check something that looks correct. Give 10 to 20 findings, covering every section. Write in English.`;
}

function parseJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST." });
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: "The visual check is not set up on this server." });
  }

  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const user = await userFromToken(token).catch(() => null);
  if (!user || !user.id) return res.status(401).json({ error: "Sign in again to run the visual check." });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const images = Array.isArray(body.images) ? body.images : [];
  if (!images.length || images.length > MAX_IMAGES) {
    return res.status(400).json({ error: `Send between 1 and ${MAX_IMAGES} screenshot slices.` });
  }
  for (const img of images) {
    if (typeof img !== "string" || img.length > MAX_IMAGE_BASE64 || !/^[A-Za-z0-9+/=]+$/.test(img)) {
      return res.status(400).json({ error: "A screenshot slice is too large or not a JPEG." });
    }
  }

  const c = body.context || {};
  const brandHex = /^#[0-9a-f]{6}$/i.test(c.brandHex || "") ? c.brandHex : "#000000";
  const ctx = {
    hotelName: clean(c.hotelName, 120),
    hotelCode: clean(c.hotelCode, 12),
    brandName: clean(c.brandName, 60),
    brandHex,
    campaign: clean(c.campaign, 160),
    offerLabel: OFFER_LABELS.has(c.offerLabel) ? c.offerLabel : "Room package",
    subject: clean(c.subject, 200),
    verified: (Array.isArray(c.verified) ? c.verified : []).slice(0, 30).map((v) => clean(v, 120)).filter(Boolean),
  };

  const content = images.map((data) => ({
    type: "image",
    source: { type: "base64", media_type: "image/jpeg", data },
  }));
  content.push({ type: "text", text: buildPrompt(ctx, images.length) });

  let r;
  try {
    r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 4000, messages: [{ role: "user", content }] }),
    });
  } catch {
    return res.status(502).json({ error: "Could not reach Claude. Try again in a moment." });
  }

  if (r.status === 429) return res.status(429).json({ error: "Too many checks right now. Try again in a few minutes." });
  if (!r.ok) {
    const detail = await r.text().catch(() => "");
    console.error("Anthropic API error", r.status, detail.slice(0, 500));
    return res.status(502).json({ error: "The visual check failed. Try again." });
  }

  const out = await r.json();
  const text = (out.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
  const parsed = parseJson(text);
  if (!parsed || !Array.isArray(parsed.findings)) {
    return res.status(502).json({ error: "The answer could not be read. Run the check again." });
  }
  const findings = parsed.findings
    .filter((x) => x && x.check)
    .map((x) => ({
      section: clean(x.section || "General", 40),
      status: ["pass", "warn", "fail"].includes(x.status) ? x.status : "warn",
      check: clean(x.check, 120),
      detail: clean(x.detail, 400),
    }));
  return res.status(200).json({ summary: clean(parsed.summary, 500), findings });
}
