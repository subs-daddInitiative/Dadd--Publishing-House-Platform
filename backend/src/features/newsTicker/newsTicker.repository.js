const { pool } = require("../../config/db");

async function listActiveForAudience(audience) {
  const [rows] = await pool.query(
    `SELECT id, message, target
     FROM news_ticker_items
     WHERE is_active = 1 AND deleted_at IS NULL AND (target = 'all' OR target = ?)
     ORDER BY sort_order ASC, id ASC`,
    [audience]
  );
  return rows;
}

async function listAll() {
  const [rows] = await pool.query(
    "SELECT * FROM news_ticker_items WHERE deleted_at IS NULL ORDER BY sort_order ASC, created_at DESC"
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM news_ticker_items WHERE id = ? AND deleted_at IS NULL LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

async function createItem(data) {
  const [result] = await pool.query(
    "INSERT INTO news_ticker_items (message, target, is_active, sort_order) VALUES (?, ?, ?, ?)",
    [data.message, data.target, data.is_active, data.sort_order]
  );
  return result.insertId;
}

async function updateItem(id, fields) {
  const allowedKeys = ["message", "target", "is_active", "sort_order"];
  const keys = Object.keys(fields).filter((key) => allowedKeys.includes(key));
  if (keys.length === 0) return findById(id);

  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const values = keys.map((key) => fields[key]);
  await pool.query(`UPDATE news_ticker_items SET ${setClause} WHERE id = ?`, [...values, id]);
  return findById(id);
}

async function softDeleteItem(id) {
  await pool.query("UPDATE news_ticker_items SET deleted_at = NOW() WHERE id = ?", [id]);
}

module.exports = {
  listActiveForAudience,
  listAll,
  findById,
  createItem,
  updateItem,
  softDeleteItem,
};
