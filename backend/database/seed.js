// Loads database/seedData.json into the local database and copies
// database/seed-assets/ into backend/uploads/, so anyone who pulls the repo
// can get the same demo content (books, blogs, studies, categories, site
// settings, etc.) without a live handoff. Safe to re-run any time — it
// upserts by primary key, so it never duplicates rows or touches real
// accounts/orders/messages (those are never included in the seed).
//
// Usage: node database/seed.js
const fs = require("fs");
const path = require("path");
const { pool } = require("../src/config/db");

function loadSeedData() {
  const seedPath = path.join(__dirname, "seedData.json");
  if (!fs.existsSync(seedPath)) {
    console.error("database/seedData.json not found — nothing to seed.");
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(seedPath, "utf8"));
}

async function upsertRows(table, rows) {
  if (rows.length === 0) return 0;

  for (const row of rows) {
    const columns = Object.keys(row);
    const placeholders = columns.map(() => "?").join(", ");
    const updates = columns
      .filter((col) => col !== "id")
      .map((col) => `\`${col}\` = VALUES(\`${col}\`)`)
      .join(", ");
    const sql = `INSERT INTO \`${table}\` (${columns.map((c) => `\`${c}\``).join(", ")}) VALUES (${placeholders}) ON DUPLICATE KEY UPDATE ${updates}`;
    await pool.query(sql, columns.map((col) => row[col]));
  }
  return rows.length;
}

async function copySeedAssets() {
  const assetsDir = path.join(__dirname, "seed-assets");
  const uploadsDir = path.join(__dirname, "..", "uploads");
  if (!fs.existsSync(assetsDir)) {
    console.log("No database/seed-assets found — skipping upload files.");
    return;
  }
  fs.cpSync(assetsDir, uploadsDir, { recursive: true, force: false });
  console.log("Copied database/seed-assets/ into backend/uploads/ (existing files were not overwritten).");
}

async function main() {
  const { tables, data } = loadSeedData();

  for (const table of tables) {
    const count = await upsertRows(table, data[table] || []);
    console.log(`seeded ${table}: ${count} rows`);
  }

  await copySeedAssets();

  console.log("\nDone. Restart the backend if it was already running.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
