const { pool } = require("../../config/db");

async function listActiveBanners() {
  const [rows] = await pool.query(
    `SELECT id, title, description, image, link_url
     FROM banners
     WHERE is_active = 1
       AND deleted_at IS NULL
       AND (starts_at IS NULL OR starts_at <= NOW())
       AND (ends_at IS NULL OR ends_at >= NOW())
     ORDER BY sort_order ASC, created_at DESC`
  );
  return rows;
}

async function listAllBanners() {
  const [rows] = await pool.query(
    `SELECT * FROM banners WHERE deleted_at IS NULL ORDER BY sort_order ASC, created_at DESC`
  );
  return rows;
}

async function createBanner(data) {
  const [result] = await pool.query(
    `INSERT INTO banners (title, description, image, link_url, is_active, sort_order, starts_at, ends_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.title,
      data.description,
      data.image,
      data.link_url,
      data.is_active,
      data.sort_order,
      data.starts_at,
      data.ends_at,
    ]
  );
  return result.insertId;
}

async function findBannerById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM banners WHERE id = ? AND deleted_at IS NULL LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

async function updateBanner(id, fields) {
  const allowedKeys = [
    "title",
    "description",
    "image",
    "link_url",
    "is_active",
    "sort_order",
    "starts_at",
    "ends_at",
  ];
  const keys = Object.keys(fields).filter((key) => allowedKeys.includes(key));
  if (keys.length === 0) return findBannerById(id);

  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const values = keys.map((key) => fields[key]);
  await pool.query(`UPDATE banners SET ${setClause} WHERE id = ?`, [...values, id]);
  return findBannerById(id);
}

async function softDeleteBanner(id) {
  await pool.query("UPDATE banners SET deleted_at = NOW() WHERE id = ?", [id]);
}

module.exports = {
  listActiveBanners,
  listAllBanners,
  createBanner,
  findBannerById,
  updateBanner,
  softDeleteBanner,
};
