const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Parse .env.local manually
let supabaseUrl = "";
let supabaseKey = "";

try {
  const envContent = fs.readFileSync(path.join(__dirname, ".env.local"), "utf8");
  const lines = envContent.split("\n");
  for (const line of lines) {
    const parts = line.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join("=").trim().replace(/^["']|["']$/g, "");
      if (key === "NEXT_PUBLIC_SUPABASE_URL") supabaseUrl = value;
      if (key === "SUPABASE_SERVICE_ROLE_KEY" || key === "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
        if (!supabaseKey || key === "SUPABASE_SERVICE_ROLE_KEY") {
          supabaseKey = value;
        }
      }
    }
  }
} catch (err) {
  console.error("Error reading .env.local:", err.message);
}

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Connecting to Supabase at:", supabaseUrl);
  
  // 1. Check blog posts count
  const { data: posts, error: postErr } = await supabase
    .from("blog_posts")
    .select("id, slug, title, published_at")
    .order("created_at", { ascending: false });
    
  if (postErr) {
    console.error("Error reading blog_posts:", postErr);
  } else {
    console.log(`\n--- Blog Posts Count: ${posts ? posts.length : 0} ---`);
    if (posts) {
      posts.slice(0, 5).forEach(p => {
        console.log(`- [${p.published_at ? 'Published' : 'Draft'}] ID: ${p.id}, Slug: ${p.slug}, Title: ${p.title}`);
      });
    }
  }

  // 2. Check cron executions
  const { data: crons, error: cronErr } = await supabase
    .from("cron_executions")
    .select("*")
    .order("ts", { ascending: false })
    .limit(5);

  if (cronErr) {
    console.error("Error reading cron_executions:", cronErr);
  } else {
    console.log(`\n--- Cron Executions Count: ${crons ? crons.length : 0} ---`);
    if (crons) {
      crons.forEach(c => {
        console.log(`- Date: ${c.ts}, Status: ${c.status}, Published: ${c.published_slug}, Err: ${c.error_message || 'None'}`);
      });
    }
  }

  // 3. Check recent generation logs
  const { data: logs, error: logErr } = await supabase
    .from("generation_logs")
    .select("id, ts, action, status, details")
    .order("ts", { ascending: false })
    .limit(10);

  if (logErr) {
    console.error("Error reading generation_logs:", logErr);
  } else {
    console.log(`\n--- Recent Generation Logs ---`);
    if (logs) {
      logs.forEach(l => {
        console.log(`- [${l.ts}] Action: ${l.action}, Status: ${l.status}, Details: ${l.details}`);
      });
    }
  }
}

check();
