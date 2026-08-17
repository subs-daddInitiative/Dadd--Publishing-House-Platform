const { pool } = require("../../config/db");

async function listModerators() {
  const [rows] = await pool.query(
    `SELECT id, name, email, is_active, last_login_at, created_at
     FROM users
     WHERE role = 'moderator' AND deleted_at IS NULL
     ORDER BY created_at DESC`
  );
  return rows;
}

async function findByEmail(email) {
  // Checks ALL rows (including soft-deleted) since the DB's unique
  // constraint on email doesn't care about deleted_at — a deleted row
  // would still block the insert if we only checked active rows here.
  const [rows] = await pool.query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
  return rows[0] || null;
}

async function createModerator({ name, email, passwordHash }) {
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'moderator')",
    [name, email, passwordHash]
  );
  return result.insertId;
}

async function findModeratorById(id) {
  const [rows] = await pool.query(
    "SELECT id, name, email FROM users WHERE id = ? AND role = 'moderator' AND deleted_at IS NULL LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

async function softDeleteUser(id) {
  await pool.query("UPDATE users SET deleted_at = NOW() WHERE id = ?", [id]);
}

module.exports = {
  listModerators,
  findByEmail,
  createModerator,
  findModeratorById,
  softDeleteUser,
};
