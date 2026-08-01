const fs = require("fs");
const path = require("path");
const { pool } = require("../src/config/db");

async function run() {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: node runMigration.js <path-to-sql-file>");
    process.exit(1);
  }

  const sql = fs.readFileSync(path.resolve(file), "utf8");
  const statements = sql
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  const connection = await pool.getConnection();
  try {
    for (const statement of statements) {
      try {
        await connection.query(statement);
        console.log("OK:", statement.slice(0, 70).replace(/\s+/g, " "), "...");
      } catch (error) {
        if (error.code === "ER_DUP_FIELDNAME") {
          console.log("Skipped (column already exists):", statement.slice(0, 70).replace(/\s+/g, " "));
        } else {
          throw error;
        }
      }
    }
    console.log("Migration complete.");
  } finally {
    connection.release();
    await pool.end();
  }
}

run().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exit(1);
});
