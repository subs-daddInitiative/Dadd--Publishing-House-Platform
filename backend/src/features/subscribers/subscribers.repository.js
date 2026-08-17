const { pool } = require("../../config/db");

async function findByEmail(email) {
  // Checks ALL rows (including soft-deleted) since the DB's unique
  // constraint on email doesn't care about deleted_at.
  const [rows] = await pool.query(
    "SELECT id, name, email, password_hash, deleted_at FROM subscribers WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0] || null;
}

async function findActiveByEmail(email) {
  const [rows] = await pool.query(
    "SELECT id, name, email, account_type, password_hash FROM subscribers WHERE email = ? AND deleted_at IS NULL LIMIT 1",
    [email]
  );
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT id, name, email, account_type, current_tier, tier_expires_at,
            blog_access_expires_at, studies_access_expires_at, created_at
     FROM subscribers
     WHERE id = ? AND deleted_at IS NULL
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function hasActiveBlogAccess(id) {
  const [rows] = await pool.query(
    "SELECT 1 FROM subscribers WHERE id = ? AND blog_access_expires_at > NOW() LIMIT 1",
    [id]
  );
  return rows.length > 0;
}

async function hasActiveStudiesAccess(id) {
  const [rows] = await pool.query(
    "SELECT 1 FROM subscribers WHERE id = ? AND studies_access_expires_at > NOW() LIMIT 1",
    [id]
  );
  return rows.length > 0;
}

async function grantContentAccess(subscriberId, category, expiresAt) {
  const column = category === "blogs" ? "blog_access_expires_at" : "studies_access_expires_at";
  await pool.query(`UPDATE subscribers SET ${column} = ? WHERE id = ?`, [expiresAt, subscriberId]);
}

async function createSubscriber({ name, email, passwordHash, accountType }) {
  const [result] = await pool.query(
    "INSERT INTO subscribers (name, email, password_hash, account_type) VALUES (?, ?, ?, ?)",
    [name, email, passwordHash, accountType || "reader"]
  );
  return result.insertId;
}

async function updateTier(subscriberId, tier, expiresAt) {
  await pool.query(
    "UPDATE subscribers SET current_tier = ?, tier_expires_at = ? WHERE id = ?",
    [tier, expiresAt, subscriberId]
  );
}

module.exports = {
  findByEmail,
  findActiveByEmail,
  findById,
  createSubscriber,
  updateTier,
  hasActiveBlogAccess,
  hasActiveStudiesAccess,
  grantContentAccess,
};
