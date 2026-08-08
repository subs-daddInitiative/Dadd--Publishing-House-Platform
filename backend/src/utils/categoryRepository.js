const { pool } = require("../config/db");
const { slugify } = require("./slugify");

/**
 * Generic CRUD repository for the *_categories tables (blogs_categories,
 * studies_categories, ...), which all share the same id/name/slug/description
 * shape. `table` is always an internal constant, never user input.
 */
function createCategoryRepository(table) {
  async function list() {
    const [rows] = await pool.query(
      `SELECT id, name, slug, description FROM ${table} WHERE deleted_at IS NULL ORDER BY name ASC`
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

  return { list, findById, ensureUniqueSlug, create, update, softDelete };
}

module.exports = { createCategoryRepository };
