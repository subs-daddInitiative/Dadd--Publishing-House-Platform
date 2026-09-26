// One-off tool: dumps the current CONTENT tables (demo/dummy data only —
// never real accounts, billing, or messages) into database/seedData.json,
// and copies backend/uploads/ into database/seed-assets/ so both are
// versioned in git. Re-run this any time after adding/editing dummy data,
// then commit the two outputs. See DB_CHANGES.md for the workflow.
const fs = require("fs");
const path = require("path");
const { pool } = require("../src/config/db");

// Order matters: parents before the tables that reference them.
const TABLES = [
  "settings",
  "social_links",
  "books_categories",
  "books_categories_translations",
  "blogs_categories",
  "blogs_categories_translations",
  "studies_categories",
  "studies_categories_translations",
  "book_pricing_tiers",
  "books",
  "book_translations",
  "book_external_links",
  "blogs",
  "blog_translations",
  "studies",
  "study_translations",
  "about_features",
  "about_feature_translations",
  "news_ticker_items",
  "news_ticker_item_translations",
  "site_ads",
  "site_ad_translations",
  "banners",
  "subscription_plans",
  "content_subscription_plans",
  "content_subscription_plan_categories",
  "content_trials",
  "content_trial_categories",
  "writer_trial_settings",
];

// Columns that point at real accounts (users/subscribers) rather than at
// other rows in TABLES above — nulled out since those accounts aren't seeded.
const COLUMNS_TO_NULL = {
  blogs: ["author_id", "reviewed_by", "submitted_by_subscriber_id"],
};

async function exportTable(table) {
  const [rows] = await pool.query(`SELECT * FROM \`${table}\``);
  const nullColumns = COLUMNS_TO_NULL[table] || [];
  for (const row of rows) {
    for (const col of nullColumns) {
      if (col in row) row[col] = null;
    }
  }
  return rows;
}

async function main() {
  const data = {};
  for (const table of TABLES) {
    data[table] = await exportTable(table);
    console.log(`exported ${table}: ${data[table].length} rows`);
  }

  const outPath = path.join(__dirname, "seedData.json");
  fs.writeFileSync(outPath, JSON.stringify({ tables: TABLES, data }, null, 2));
  console.log(`\nWrote ${outPath}`);

  const uploadsDir = path.join(__dirname, "..", "uploads");
  const assetsDir = path.join(__dirname, "seed-assets");
  fs.rmSync(assetsDir, { recursive: true, force: true });
  fs.cpSync(uploadsDir, assetsDir, { recursive: true });
  console.log(`Copied uploads/ to ${assetsDir}`);

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
