const { pool } = require("../../config/db");
const { slugify } = require("../../utils/slugify");

const PUBLIC_LIST_FIELDS = `
  s.id, s.title, s.slug, s.description, s.author, s.cover_image, s.published_at,
  sc.name AS category_name, sc.slug AS category_slug
`;

const SORT_COLUMNS = {
  newest: "s.published_at DESC",
  oldest: "s.published_at ASC",
};

async function listCategories() {
  const [rows] = await pool.query(
    "SELECT id, name, slug FROM studies_categories WHERE deleted_at IS NULL ORDER BY name ASC"
  );
  return rows;
}

async function listPublicStudies({ limit, offset, categorySlug, sort }) {
  const params = [];
  let query = `SELECT ${PUBLIC_LIST_FIELDS}
     FROM studies s
     LEFT JOIN studies_categories sc ON sc.id = s.category_id
     WHERE s.status = 'published' AND s.deleted_at IS NULL`;

  if (categorySlug) {
    query += " AND sc.slug = ?";
    params.push(categorySlug);
  }

  query += ` ORDER BY ${SORT_COLUMNS[sort] || SORT_COLUMNS.newest} LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await pool.query(query, params);
  return rows;
}

async function countPublicStudies({ categorySlug }) {
  const params = [];
  let query = `SELECT COUNT(*) AS count
     FROM studies s
     LEFT JOIN studies_categories sc ON sc.id = s.category_id
     WHERE s.status = 'published' AND s.deleted_at IS NULL`;

  if (categorySlug) {
    query += " AND sc.slug = ?";
    params.push(categorySlug);
  }

  const [rows] = await pool.query(query, params);
  return rows[0].count;
}

async function findPublicStudyBySlug(slug) {
  const [rows] = await pool.query(
    `SELECT ${PUBLIC_LIST_FIELDS}, s.category_id, s.main_image, s.content_intro, s.content_body,
            s.pdf_file, s.updated_at
     FROM studies s
     LEFT JOIN studies_categories sc ON sc.id = s.category_id
     WHERE s.slug = ? AND s.status = 'published' AND s.deleted_at IS NULL
     LIMIT 1`,
    [slug]
  );
  return rows[0] || null;
}

async function findRelatedStudies(categoryId, excludeId, limit = 3) {
  let sameCategory = [];
  if (categoryId) {
    const [rows] = await pool.query(
      `SELECT ${PUBLIC_LIST_FIELDS}
       FROM studies s
       LEFT JOIN studies_categories sc ON sc.id = s.category_id
       WHERE s.category_id = ? AND s.id != ? AND s.status = 'published' AND s.deleted_at IS NULL
       ORDER BY s.published_at DESC
       LIMIT ?`,
      [categoryId, excludeId, limit]
    );
    sameCategory = rows;
  }

  if (sameCategory.length >= limit) return sameCategory;

  const [latest] = await pool.query(
    `SELECT ${PUBLIC_LIST_FIELDS}
     FROM studies s
     LEFT JOIN studies_categories sc ON sc.id = s.category_id
     WHERE s.id != ? AND s.status = 'published' AND s.deleted_at IS NULL
     ORDER BY s.published_at DESC
     LIMIT ?`,
    [excludeId, limit]
  );

  const seen = new Set(sameCategory.map((row) => row.id));
  const padded = latest.filter((row) => !seen.has(row.id));

  return [...sameCategory, ...padded].slice(0, limit);
}

async function listAdminStudies() {
  const [rows] = await pool.query(
    `SELECT s.id, s.title, s.slug, s.status, s.cover_image, s.published_at, s.updated_at,
            sc.name AS category_name
     FROM studies s
     LEFT JOIN studies_categories sc ON sc.id = s.category_id
     WHERE s.deleted_at IS NULL
     ORDER BY s.created_at DESC`
  );
  return rows;
}

async function findAdminStudyById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM studies WHERE id = ? AND deleted_at IS NULL LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

async function slugExists(slug, excludeId) {
  const params = [slug];
  let query = "SELECT id FROM studies WHERE slug = ?";
  if (excludeId) {
    query += " AND id != ?";
    params.push(excludeId);
  }
  const [rows] = await pool.query(`${query} LIMIT 1`, params);
  return rows.length > 0;
}

async function ensureUniqueSlug(title, excludeId) {
  const base = slugify(title) || "study";
  let candidate = base;
  let suffix = 2;
  while (await slugExists(candidate, excludeId)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

async function createStudy(data) {
  const publishedAt = data.status === "published" ? new Date() : null;
  const [result] = await pool.query(
    `INSERT INTO studies
       (category_id, title, slug, author, description, content_intro, content_body,
        cover_image, main_image, pdf_file, status, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.category_id || null,
      data.title,
      data.slug,
      data.author || null,
      data.description || null,
      data.content_intro || null,
      data.content_body || null,
      data.cover_image || null,
      data.main_image || null,
      data.pdf_file || null,
      data.status,
      publishedAt,
    ]
  );
  return result.insertId;
}

async function updateStudy(id, fields) {
  const allowedKeys = [
    "category_id",
    "title",
    "slug",
    "author",
    "description",
    "content_intro",
    "content_body",
    "cover_image",
    "main_image",
    "pdf_file",
    "status",
  ];
  const keys = Object.keys(fields).filter((key) => allowedKeys.includes(key));
  if (keys.length === 0) return findAdminStudyById(id);

  const current = await findAdminStudyById(id);
  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const values = keys.map((key) => fields[key]);

  const willPublishNow =
    fields.status === "published" && current && !current.published_at;

  const sql = willPublishNow
    ? `UPDATE studies SET ${setClause}, published_at = NOW() WHERE id = ?`
    : `UPDATE studies SET ${setClause} WHERE id = ?`;

  await pool.query(sql, [...values, id]);
  return findAdminStudyById(id);
}

async function softDeleteStudy(id) {
  await pool.query("UPDATE studies SET deleted_at = NOW() WHERE id = ?", [id]);
}

module.exports = {
  listCategories,
  listPublicStudies,
  countPublicStudies,
  findPublicStudyBySlug,
  findRelatedStudies,
  listAdminStudies,
  findAdminStudyById,
  ensureUniqueSlug,
  createStudy,
  updateStudy,
  softDeleteStudy,
};
