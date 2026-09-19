const { pool } = require("../../config/db");

const TRANSLATABLE_LOCALES = ["en", "de"];

function isTranslatableLocale(locale) {
  return TRANSLATABLE_LOCALES.includes(locale);
}

// A ticker item only shows to visitors in a non-Arabic locale once an admin
// has translated its message — no mixed-language fallback.
async function listActiveForAudience(audience, locale) {
  if (isTranslatableLocale(locale)) {
    const [rows] = await pool.query(
      `SELECT i.id, nit.message, i.target
       FROM news_ticker_items i
       INNER JOIN news_ticker_item_translations nit ON nit.item_id = i.id AND nit.locale = ?
       WHERE i.is_active = 1 AND i.deleted_at IS NULL AND (i.target = 'all' OR i.target = ?)
       ORDER BY i.sort_order ASC, i.id ASC`,
      [locale, audience]
    );
    return rows;
  }

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

async function listTranslations(itemId) {
  const [rows] = await pool.query(
    "SELECT locale, message, updated_at FROM news_ticker_item_translations WHERE item_id = ? ORDER BY locale ASC",
    [itemId]
  );
  return rows;
}

async function findTranslation(itemId, locale) {
  const [rows] = await pool.query(
    "SELECT * FROM news_ticker_item_translations WHERE item_id = ? AND locale = ? LIMIT 1",
    [itemId, locale]
  );
  return rows[0] || null;
}

async function upsertTranslation(itemId, locale, data) {
  await pool.query(
    `INSERT INTO news_ticker_item_translations (item_id, locale, message)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE message = VALUES(message)`,
    [itemId, locale, data.message]
  );
  return findTranslation(itemId, locale);
}

async function deleteTranslation(itemId, locale) {
  await pool.query("DELETE FROM news_ticker_item_translations WHERE item_id = ? AND locale = ?", [itemId, locale]);
}

module.exports = {
  listActiveForAudience,
  listAll,
  findById,
  createItem,
  updateItem,
  softDeleteItem,
  TRANSLATABLE_LOCALES,
  listTranslations,
  findTranslation,
  upsertTranslation,
  deleteTranslation,
};
