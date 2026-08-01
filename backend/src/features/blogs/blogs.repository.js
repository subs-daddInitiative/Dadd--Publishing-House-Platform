const { pool } = require("../../config/db");
const { slugify } = require("../../utils/slugify");

const PUBLIC_LIST_FIELDS = `
  b.id, b.title, b.slug, b.excerpt, b.cover_image, b.published_at,
  bc.name AS category_name, bc.slug AS category_slug,
  COALESCE(b.author_name, u.name) AS author_name
`;

async function listCategories() {
  const [rows] = await pool.query(
    "SELECT id, name, slug FROM blogs_categories WHERE deleted_at IS NULL ORDER BY name ASC"
  );
  return rows;
}

async function listPublicBlogs({ limit, offset }) {
  const [rows] = await pool.query(
    `SELECT ${PUBLIC_LIST_FIELDS}
     FROM blogs b
     LEFT JOIN blogs_categories bc ON bc.id = b.category_id
     LEFT JOIN users u ON u.id = b.author_id
     WHERE b.status = 'published' AND b.deleted_at IS NULL
     ORDER BY b.published_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  return rows;
}

async function countPublicBlogs() {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS count FROM blogs WHERE status = 'published' AND deleted_at IS NULL"
  );
  return rows[0].count;
}

async function findPublicBlogBySlug(slug) {
  const [rows] = await pool.query(
    `SELECT ${PUBLIC_LIST_FIELDS}, b.content, b.updated_at
     FROM blogs b
     LEFT JOIN blogs_categories bc ON bc.id = b.category_id
     LEFT JOIN users u ON u.id = b.author_id
     WHERE b.slug = ? AND b.status = 'published' AND b.deleted_at IS NULL
     LIMIT 1`,
    [slug]
  );
  return rows[0] || null;
}

async function listAdminBlogs() {
  const [rows] = await pool.query(
    `SELECT b.id, b.title, b.slug, b.status, b.cover_image, b.published_at, b.updated_at,
            b.author_name, bc.name AS category_name
     FROM blogs b
     LEFT JOIN blogs_categories bc ON bc.id = b.category_id
     WHERE b.deleted_at IS NULL
     ORDER BY b.created_at DESC`
  );
  return rows;
}

async function findAdminBlogById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM blogs WHERE id = ? AND deleted_at IS NULL LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

async function slugExists(slug, excludeId) {
  const params = [slug];
  let query = "SELECT id FROM blogs WHERE slug = ? AND deleted_at IS NULL";
  if (excludeId) {
    query += " AND id != ?";
    params.push(excludeId);
  }
  const [rows] = await pool.query(`${query} LIMIT 1`, params);
  return rows.length > 0;
}

async function ensureUniqueSlug(title, excludeId) {
  const base = slugify(title) || "post";
  let candidate = base;
  let suffix = 2;
  while (await slugExists(candidate, excludeId)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

async function createBlog(data) {
  const publishedAt = data.status === "published" ? new Date() : null;
  const [result] = await pool.query(
    `INSERT INTO blogs
       (category_id, author_id, author_name, title, slug, excerpt, content, cover_image, status, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.category_id || null,
      data.author_id || null,
      data.author_name || null,
      data.title,
      data.slug,
      data.excerpt || null,
      data.content || null,
      data.cover_image || null,
      data.status,
      publishedAt,
    ]
  );
  return result.insertId;
}

async function updateBlog(id, fields) {
  const allowedKeys = [
    "category_id",
    "author_name",
    "title",
    "slug",
    "excerpt",
    "content",
    "cover_image",
    "status",
  ];
  const keys = Object.keys(fields).filter((key) => allowedKeys.includes(key));
  if (keys.length === 0) return findAdminBlogById(id);

  const current = await findAdminBlogById(id);
  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const values = keys.map((key) => fields[key]);

  const willPublishNow =
    fields.status === "published" && current && !current.published_at;

  const sql = willPublishNow
    ? `UPDATE blogs SET ${setClause}, published_at = NOW() WHERE id = ?`
    : `UPDATE blogs SET ${setClause} WHERE id = ?`;

  await pool.query(sql, [...values, id]);
  return findAdminBlogById(id);
}

async function softDeleteBlog(id) {
  await pool.query("UPDATE blogs SET deleted_at = NOW() WHERE id = ?", [id]);
}

module.exports = {
  listCategories,
  listPublicBlogs,
  countPublicBlogs,
  findPublicBlogBySlug,
  listAdminBlogs,
  findAdminBlogById,
  ensureUniqueSlug,
  createBlog,
  updateBlog,
  softDeleteBlog,
};
