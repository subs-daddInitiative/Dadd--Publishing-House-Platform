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

async function resetPassword() {
  const email = process.argv[2];

  if (!email) {
    console.error("Usage: node database/resetAdminPassword.js <email>");
    process.exit(1);
  }

  const [existing] = await pool.query(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  if (existing.length === 0) {
    console.error(`No user found with email ${email}.`);
    process.exit(1);
  }

  const password = generatePassword();
  const passwordHash = await bcrypt.hash(password, 12);

  await pool.query("UPDATE users SET password_hash = ? WHERE email = ?", [
    passwordHash,
    email,
  ]);

  console.log("Password reset.");
  console.log("Email:   ", email);
  console.log("Password:", password);
  console.log("\nSave this password now — it will not be shown again.");

  await pool.end();
}

resetPassword().catch((error) => {
  console.error("Failed to reset password:", error.message);
  process.exit(1);
});
