const postgres = require("postgres");
const fs = require("fs");
const path = require("path");

const password = "$GOLUKUMAR.COM";
const host = "db.fmqfqdvmireoivqnmwkw.supabase.co";
const port = 5432;
const database = "postgres";
const username = "postgres";

console.log("Connecting to PostgreSQL at:", host);

const sql = postgres({
  host,
  port,
  database,
  username,
  password,
  ssl: "require",
  connect_timeout: 10
});

async function run() {
  try {
    const migrationPath = path.join(__dirname, "supabase", "production_schema.sql");
    const migrationSql = fs.readFileSync(migrationPath, "utf8");
    
    console.log("Reading migration schema file. Size:", migrationSql.length, "bytes.");
    
    console.log("Executing migration SQL on database...");
    
    // We can run the entire SQL block directly using raw query
    await sql.unsafe(migrationSql);
    
    console.log("\n🚀 SUCCESS: Supabase migration successfully executed and tables created!");
    
    // Quick validation check
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("\nCreated Tables in 'public' Schema:");
    tables.forEach(t => console.log(`- ${t.table_name}`));
    
    process.exit(0);
  } catch (error) {
    console.error("\n❌ ERROR: Migration failed!");
    console.error(error.message);
    process.exit(1);
  }
}

run();
