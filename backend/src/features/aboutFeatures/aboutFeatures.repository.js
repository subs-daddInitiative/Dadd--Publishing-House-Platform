const { pool } = require("../../config/db");

async function listActive() {
  const [rows] = await pool.query(
    `SELECT id, icon, title, description
     FROM about_features
     WHERE deleted_at IS NULL
     ORDER BY sort_order ASC, created_at ASC`
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM about_features WHERE id = ? AND deleted_at IS NULL LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

async function create(data) {
  const [result] = await pool.query(
    `INSERT INTO about_features (icon, title, description, sort_order) VALUES (?, ?, ?, ?)`,
    [data.icon || null, data.title, data.description || null, data.sort_order || 0]
  );
  return findById(result.insertId);
}

async function update(id, fields) {
  const allowedKeys = ["icon", "title", "description", "sort_order"];
  const keys = Object.keys(fields).filter((key) => allowedKeys.includes(key));
  if (keys.length === 0) return findById(id);

  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const values = keys.map((key) => fields[key]);
  await pool.query(`UPDATE about_features SET ${setClause} WHERE id = ?`, [...values, id]);
  return findById(id);
}

async function softDelete(id) {
  await pool.query("UPDATE about_features SET deleted_at = NOW() WHERE id = ?", [id]);
}

module.exports = { listActive, findById, create, update, softDelete };
