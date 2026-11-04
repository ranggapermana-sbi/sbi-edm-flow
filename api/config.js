// Public settings for the browser. The anon key is designed to be public:
// what it can read or write is limited by the security rules in supabase/schema.sql.
export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    supabaseUrl: process.env.SUPABASE_URL || "",
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
    visualCheck: Boolean(process.env.ANTHROPIC_API_KEY),
  });
}
