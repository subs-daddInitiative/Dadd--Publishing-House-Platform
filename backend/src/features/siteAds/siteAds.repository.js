const { pool } = require("../../config/db");

async function listActiveForAudience(audience) {
  const [rows] = await pool.query(
    `SELECT id, title, message, image, link_url, link_label, target
     FROM site_ads
     WHERE is_active = 1
       AND deleted_at IS NULL
       AND (target = 'all' OR target = ?)
       AND (starts_at IS NULL OR starts_at <= NOW())
       AND (ends_at IS NULL OR ends_at >= NOW())
     ORDER BY sort_order ASC, id ASC`,
    [audience]
  );
  return rows;
}

async function listAll() {
  const [rows] = await pool.query(
    "SELECT * FROM site_ads WHERE deleted_at IS NULL ORDER BY sort_order ASC, created_at DESC"
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query("SELECT * FROM site_ads WHERE id = ? AND deleted_at IS NULL LIMIT 1", [id]);
  return rows[0] || null;
}

async function createAd(data) {
  const [result] = await pool.query(
    `INSERT INTO site_ads
       (title, message, image, link_url, link_label, target, is_active, sort_order, starts_at, ends_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.title,
      data.message,
      data.image,
      data.link_url,
      data.link_label,
      data.target,
      data.is_active,
      data.sort_order,
      data.starts_at,
      data.ends_at,
    ]
  );
  return result.insertId;
}

async function updateAd(id, fields) {
  const allowedKeys = [
    "title",
    "message",
    "image",
    "link_url",
    "link_label",
    "target",
    "is_active",
    "sort_order",
    "starts_at",
    "ends_at",
  ];
  const keys = Object.keys(fields).filter((key) => allowedKeys.includes(key));
  if (keys.length === 0) return findById(id);

  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const values = keys.map((key) => fields[key]);
  await pool.query(`UPDATE site_ads SET ${setClause} WHERE id = ?`, [...values, id]);
  return findById(id);
}

async function softDeleteAd(id) {
  await pool.query("UPDATE site_ads SET deleted_at = NOW() WHERE id = ?", [id]);
}

module.exports = { listActiveForAudience, listAll, findById, createAd, updateAd, softDeleteAd };
