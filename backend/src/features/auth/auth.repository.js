const { pool } = require("../../config/db");

async function findActiveAdminByEmail(email) {
  const [rows] = await pool.query(
    `SELECT id, name, email, password_hash, role
     FROM users
     WHERE email = ? AND is_active = 1 AND deleted_at IS NULL
     LIMIT 1`,
    [email]
  );
  return rows[0] || null;
}

async function touchLastLogin(userId) {
  await pool.query("UPDATE users SET last_login_at = NOW() WHERE id = ?", [userId]);
}

async function findById(userId) {
  const [rows] = await pool.query(
    `SELECT id, name, email, role
     FROM users
     WHERE id = ? AND is_active = 1 AND deleted_at IS NULL
     LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

module.exports = { findActiveAdminByEmail, touchLastLogin, findById };
