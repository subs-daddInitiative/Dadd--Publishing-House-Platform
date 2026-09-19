const { pool } = require("../config/db");
const { slugify } = require("./slugify");

/**
 * Generic CRUD repository for the *_categories tables (blogs_categories,
 * studies_categories, ...), which all share the same id/name/slug/description
 * shape. `table` is always an internal constant, never user input.
 */
const TRANSLATABLE_LOCALES = ["en", "de"];

function createCategoryRepository(table) {
  const translationsTable = `${table}_translations`;
  const parentIdColumn = "category_id";

  async function list() {
    const [rows] = await pool.query(
      `SELECT id, name, slug, description FROM ${table} WHERE deleted_at IS NULL ORDER BY name ASC`
    );
    return rows;
  }

  // For a non-Arabic locale, only categories an admin has translated are
  // returned — an untranslated category simply doesn't exist in that locale,
  // matching how blogs/studies/ads already behave.
  async function listPublic(locale) {
    if (!TRANSLATABLE_LOCALES.includes(locale)) return list();

    const [rows] = await pool.query(
      `SELECT c.id, ct.name, c.slug, ct.description
       FROM ${table} c
       INNER JOIN ${translationsTable} ct ON ct.${parentIdColumn} = c.id AND ct.locale = ?
       WHERE c.deleted_at IS NULL
       ORDER BY ct.name ASC`,
      [locale]
    );
    return rows;
  }

  async function findById(id) {
    const [rows] = await pool.query(
      `SELECT id, name, slug, description FROM ${table} WHERE id = ? AND deleted_at IS NULL LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  }

  async function slugExists(slug, excludeId) {
    const params = [slug];
    let query = `SELECT id FROM ${table} WHERE slug = ?`;
    if (excludeId) {
      query += " AND id != ?";
      params.push(excludeId);
    }
    const [rows] = await pool.query(`${query} LIMIT 1`, params);
    return rows.length > 0;
  }

  async function ensureUniqueSlug(name, excludeId) {
    const base = slugify(name) || "category";
    let candidate = base;
    let suffix = 2;
    while (await slugExists(candidate, excludeId)) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }
    return candidate;
  }

  async function create(data) {
    const slug = await ensureUniqueSlug(data.slug || data.name);
    const [result] = await pool.query(
      `INSERT INTO ${table} (name, slug, description) VALUES (?, ?, ?)`,
      [data.name, slug, data.description || null]
    );
    return findById(result.insertId);
  }

  async function update(id, fields) {
    const allowedKeys = ["name", "slug", "description"];
    const keys = Object.keys(fields).filter((key) => allowedKeys.includes(key));
    if (keys.length === 0) return findById(id);

    const updates = { ...fields };
    if (keys.includes("slug")) {
      updates.slug = await ensureUniqueSlug(updates.slug, id);
    }

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const values = keys.map((key) => updates[key]);
    await pool.query(`UPDATE ${table} SET ${setClause} WHERE id = ?`, [...values, id]);
    return findById(id);
  }

  async function softDelete(id) {
    await pool.query(`UPDATE ${table} SET deleted_at = NOW() WHERE id = ?`, [id]);
  }

  async function listTranslations(categoryId) {
    const [rows] = await pool.query(
      `SELECT locale, name, description, updated_at FROM ${translationsTable} WHERE ${parentIdColumn} = ? ORDER BY locale ASC`,
      [categoryId]
    );
    return rows;
  }

  async function findTranslation(categoryId, locale) {
    const [rows] = await pool.query(
      `SELECT * FROM ${translationsTable} WHERE ${parentIdColumn} = ? AND locale = ? LIMIT 1`,
      [categoryId, locale]
    );
    return rows[0] || null;
  }

  async function upsertTranslation(categoryId, locale, data) {
    await pool.query(
      `INSERT INTO ${translationsTable} (${parentIdColumn}, locale, name, description)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description)`,
      [categoryId, locale, data.name, data.description || null]
    );
    return findTranslation(categoryId, locale);
  }

  async function deleteTranslation(categoryId, locale) {
    await pool.query(`DELETE FROM ${translationsTable} WHERE ${parentIdColumn} = ? AND locale = ?`, [
      categoryId,
      locale,
    ]);
  }

  return {
    list,
    listPublic,
    findById,
    ensureUniqueSlug,
    create,
    update,
    softDelete,
    listTranslations,
    findTranslation,
    upsertTranslation,
    deleteTranslation,
  };
}

module.exports = { createCategoryRepository, TRANSLATABLE_LOCALES };
