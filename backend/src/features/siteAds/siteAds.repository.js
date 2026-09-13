const { pool } = require("../../config/db");

const TRANSLATABLE_LOCALES = ["en", "de"];

function isTranslatableLocale(locale) {
  return TRANSLATABLE_LOCALES.includes(locale);
}

async function listActiveForAudience(audience, locale) {
  if (isTranslatableLocale(locale)) {
    const [rows] = await pool.query(
      `SELECT a.id, sat.title, sat.message, a.image, a.link_url, sat.link_label, a.target
       FROM site_ads a
       INNER JOIN site_ad_translations sat ON sat.ad_id = a.id AND sat.locale = ?
       WHERE a.is_active = 1
         AND a.deleted_at IS NULL
         AND (a.target = 'all' OR a.target = ?)
         AND (a.starts_at IS NULL OR a.starts_at <= NOW())
         AND (a.ends_at IS NULL OR a.ends_at >= NOW())
       ORDER BY a.sort_order ASC, a.id ASC`,
      [locale, audience]
    );
    return rows;
  }

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

async function listTranslations(adId) {
  const [rows] = await pool.query(
    "SELECT locale, title, message, link_label, updated_at FROM site_ad_translations WHERE ad_id = ? ORDER BY locale ASC",
    [adId]
  );
  return rows;
}

async function findTranslation(adId, locale) {
  const [rows] = await pool.query(
    "SELECT * FROM site_ad_translations WHERE ad_id = ? AND locale = ? LIMIT 1",
    [adId, locale]
  );
  return rows[0] || null;
}

async function upsertTranslation(adId, locale, data) {
  await pool.query(
    `INSERT INTO site_ad_translations (ad_id, locale, title, message, link_label)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       title = VALUES(title), message = VALUES(message), link_label = VALUES(link_label)`,
    [adId, locale, data.title, data.message || null, data.link_label || null]
  );
  return findTranslation(adId, locale);
}

async function deleteTranslation(adId, locale) {
  await pool.query("DELETE FROM site_ad_translations WHERE ad_id = ? AND locale = ?", [adId, locale]);
}

module.exports = {
  listActiveForAudience,
  listAll,
  findById,
  createAd,
  updateAd,
  softDeleteAd,
  TRANSLATABLE_LOCALES,
  listTranslations,
  findTranslation,
  upsertTranslation,
  deleteTranslation,
};
