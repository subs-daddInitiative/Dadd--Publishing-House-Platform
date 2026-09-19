const { pool } = require("../../config/db");

const TRANSLATABLE_LOCALES = ["en", "de"];

function isTranslatableLocale(locale) {
  return TRANSLATABLE_LOCALES.includes(locale);
}

// A feature bullet is marketing copy, so it follows the same rule as blogs/
// studies/ads: it simply doesn't exist in a non-Arabic locale until someone
// translates it (no mixed-language fallback).
async function listActive(locale) {
  if (isTranslatableLocale(locale)) {
    const [rows] = await pool.query(
      `SELECT f.id, f.icon, aft.title, aft.description
       FROM about_features f
       INNER JOIN about_feature_translations aft ON aft.feature_id = f.id AND aft.locale = ?
       WHERE f.deleted_at IS NULL
       ORDER BY f.sort_order ASC, f.created_at ASC`,
      [locale]
    );
    return rows;
  }

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

async function listTranslations(featureId) {
  const [rows] = await pool.query(
    "SELECT locale, title, description, updated_at FROM about_feature_translations WHERE feature_id = ? ORDER BY locale ASC",
    [featureId]
  );
  return rows;
}

async function findTranslation(featureId, locale) {
  const [rows] = await pool.query(
    "SELECT * FROM about_feature_translations WHERE feature_id = ? AND locale = ? LIMIT 1",
    [featureId, locale]
  );
  return rows[0] || null;
}

async function upsertTranslation(featureId, locale, data) {
  await pool.query(
    `INSERT INTO about_feature_translations (feature_id, locale, title, description)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description)`,
    [featureId, locale, data.title, data.description || null]
  );
  return findTranslation(featureId, locale);
}

async function deleteTranslation(featureId, locale) {
  await pool.query("DELETE FROM about_feature_translations WHERE feature_id = ? AND locale = ?", [
    featureId,
    locale,
  ]);
}

module.exports = {
  listActive,
  findById,
  create,
  update,
  softDelete,
  TRANSLATABLE_LOCALES,
  listTranslations,
  findTranslation,
  upsertTranslation,
  deleteTranslation,
};
