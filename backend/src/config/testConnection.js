const { pool } = require("./db");

async function testConnection() {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    console.log("Database connection successful:", rows[0]);
    process.exit(0);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

testConnection();
