const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { pool } = require("../src/config/db");

function generatePassword(length = 20) {
  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*";
  return Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((n) => alphabet[n % alphabet.length])
    .join("");
}

async function seedAdmin() {
  const email = process.argv[2];
  const name = process.argv[3] || "Admin";

  if (!email) {
    console.error("Usage: node database/seedAdmin.js <email> [name]");
    process.exit(1);
  }

  const [existing] = await pool.query(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  if (existing.length > 0) {
    console.error(`A user with email ${email} already exists (id=${existing[0].id}).`);
    process.exit(1);
  }

  const password = generatePassword();
  const passwordHash = await bcrypt.hash(password, 12);

  await pool.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')",
    [name, email, passwordHash]
  );

  console.log("Admin account created.");
  console.log("Email:   ", email);
  console.log("Password:", password);
  console.log("\nSave this password now — it will not be shown again. Change it from the dashboard after first login.");

  await pool.end();
}

seedAdmin().catch((error) => {
  console.error("Failed to seed admin:", error.message);
  process.exit(1);
});
