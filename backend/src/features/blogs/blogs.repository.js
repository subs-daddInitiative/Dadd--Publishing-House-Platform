const { pool } = require("../../config/db");
const { slugify } = require("../../utils/slugify");

const PUBLIC_LIST_FIELDS = `
  b.id, b.title, b.slug, b.excerpt, b.cover_image, b.published_at, b.is_premium,
  bc.name AS category_name, bc.slug AS category_slug,
  COALESCE(b.author_name, u.name) AS author_name
`;

async function listCategories() {
  const [rows] = await pool.query(
    "SELECT id, name, slug FROM blogs_categories WHERE deleted_at IS NULL ORDER BY name ASC"
  );
  return rows;
}

async function listPublicBlogs({ limit, offset, premium }) {
  const params = [];
  let query = `SELECT ${PUBLIC_LIST_FIELDS}
     FROM blogs b
     LEFT JOIN blogs_categories bc ON bc.id = b.category_id
     LEFT JOIN users u ON u.id = b.author_id
     WHERE b.status = 'published' AND b.deleted_at IS NULL`;

  if (premium === "premium") {
    query += " AND b.is_premium = 1";
  } else if (premium === "free") {
    query += " AND b.is_premium = 0";
  }

  query += " ORDER BY b.published_at DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const [rows] = await pool.query(query, params);
  return rows;
}

async function countPublicBlogs({ premium } = {}) {
  let query = "SELECT COUNT(*) AS count FROM blogs WHERE status = 'published' AND deleted_at IS NULL";
  if (premium === "premium") {
    query += " AND is_premium = 1";
  } else if (premium === "free") {
    query += " AND is_premium = 0";
  }
  const [rows] = await pool.query(query);
  return rows[0].count;
}

async function findPublicBlogBySlug(slug) {
  const [rows] = await pool.query(
    `SELECT ${PUBLIC_LIST_FIELDS}, b.category_id, b.content_blocks, b.seo_keywords, b.updated_at
     FROM blogs b
     LEFT JOIN blogs_categories bc ON bc.id = b.category_id
     LEFT JOIN users u ON u.id = b.author_id
     WHERE b.slug = ? AND b.status = 'published' AND b.deleted_at IS NULL
     LIMIT 1`,
    [slug]
  );
  return rows[0] || null;
}

async function findRelatedBlogs(categoryId, excludeId, limit = 3) {
  let sameCategory = [];
  if (categoryId) {
    const [rows] = await pool.query(
      `SELECT ${PUBLIC_LIST_FIELDS}
       FROM blogs b
       LEFT JOIN blogs_categories bc ON bc.id = b.category_id
       LEFT JOIN users u ON u.id = b.author_id
       WHERE b.category_id = ? AND b.id != ? AND b.status = 'published' AND b.deleted_at IS NULL
       ORDER BY b.published_at DESC
       LIMIT ?`,
      [categoryId, excludeId, limit]
    );
    sameCategory = rows;
  }

  if (sameCategory.length >= limit) return sameCategory;

  const [latest] = await pool.query(
    `SELECT ${PUBLIC_LIST_FIELDS}
     FROM blogs b
     LEFT JOIN blogs_categories bc ON bc.id = b.category_id
     LEFT JOIN users u ON u.id = b.author_id
     WHERE b.id != ? AND b.status = 'published' AND b.deleted_at IS NULL
     ORDER BY b.published_at DESC
     LIMIT ?`,
    [excludeId, limit]
  );

  const seen = new Set(sameCategory.map((row) => row.id));
  const padded = latest.filter((row) => !seen.has(row.id));

  return [...sameCategory, ...padded].slice(0, limit);
}

async function listAdminBlogs({ search, premium } = {}) {
  const params = [];
  let query = `SELECT b.id, b.title, b.slug, b.status, b.review_status, b.cover_image, b.published_at, b.updated_at,
            b.author_name, b.is_premium, bc.name AS category_name
     FROM blogs b
     LEFT JOIN blogs_categories bc ON bc.id = b.category_id
     WHERE b.deleted_at IS NULL`;

  if (search) {
    query += " AND b.title LIKE ?";
    params.push(`%${search}%`);
  }
  if (premium === "premium") {
    query += " AND b.is_premium = 1";
  } else if (premium === "free") {
    query += " AND b.is_premium = 0";
  }

  query += " ORDER BY b.created_at DESC";

  const [rows] = await pool.query(query, params);
  return rows;
}

async function listPendingReview() {
  const [rows] = await pool.query(
    `SELECT b.id, b.title, b.slug, b.excerpt, b.cover_image, b.created_at,
            bc.name AS category_name, s.name AS writer_name, s.email AS writer_email
     FROM blogs b
     LEFT JOIN blogs_categories bc ON bc.id = b.category_id
     LEFT JOIN subscribers s ON s.id = b.submitted_by_subscriber_id
     WHERE b.review_status = 'pending' AND b.deleted_at IS NULL
     ORDER BY b.created_at ASC`
  );
  return rows;
}

async function listBySubscriber(subscriberId) {
  const [rows] = await pool.query(
    `SELECT b.id, b.title, b.slug, b.status, b.review_status, b.review_reason,
            b.cover_image, b.created_at, b.updated_at
     FROM blogs b
     WHERE b.submitted_by_subscriber_id = ? AND b.deleted_at IS NULL
     ORDER BY b.created_at DESC`,
    [subscriberId]
  );
  return rows;
}

async function findByIdForSubscriber(id, subscriberId) {
  const [rows] = await pool.query(
    "SELECT * FROM blogs WHERE id = ? AND submitted_by_subscriber_id = ? AND deleted_at IS NULL LIMIT 1",
    [id, subscriberId]
  );
  return rows[0] || null;
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
  let query = "SELECT id FROM blogs WHERE slug = ?";
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
       (category_id, author_id, author_name, title, slug, excerpt, content_blocks, seo_keywords, cover_image, status, is_premium, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.category_id || null,
      data.author_id || null,
      data.author_name || null,
      data.title,
      data.slug,
      data.excerpt || null,
      data.content_blocks || null,
      data.seo_keywords || null,
      data.cover_image || null,
      data.status,
      data.is_premium ? 1 : 0,
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
    "content_blocks",
    "seo_keywords",
    "cover_image",
    "status",
    "is_premium",
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

async function createWriterSubmission(data) {
  const [result] = await pool.query(
    `INSERT INTO blogs
       (category_id, submitted_by_subscriber_id, author_name, title, slug, excerpt, content_blocks, cover_image, status, review_status, is_premium)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft', 'pending', 0)`,
    [
      data.category_id || null,
      data.subscriber_id,
      data.author_name || null,
      data.title,
      data.slug,
      data.excerpt || null,
      data.content_blocks || null,
      data.cover_image || null,
    ]
  );
  return result.insertId;
}

async function updateWriterSubmission(id, fields, wasRejected) {
  const allowedKeys = ["category_id", "title", "slug", "excerpt", "content_blocks", "cover_image"];
  const keys = Object.keys(fields).filter((key) => allowedKeys.includes(key));
  if (keys.length === 0) return findAdminBlogById(id);

  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const values = keys.map((key) => fields[key]);

  const sql = wasRejected
    ? `UPDATE blogs SET ${setClause}, review_status = 'pending', review_reason = NULL WHERE id = ?`
    : `UPDATE blogs SET ${setClause} WHERE id = ?`;

  await pool.query(sql, [...values, id]);
  return findAdminBlogById(id);
}

async function reviewBlog(id, { decision, isPremium, reason, reviewerId }) {
  if (decision === "approved") {
    await pool.query(
      `UPDATE blogs
       SET status = 'published', review_status = 'approved', is_premium = ?,
           reviewed_by = ?, reviewed_at = NOW(), published_at = NOW()
       WHERE id = ?`,
      [isPremium ? 1 : 0, reviewerId, id]
    );
  } else {
    await pool.query(
      `UPDATE blogs
       SET review_status = 'rejected', review_reason = ?, reviewed_by = ?, reviewed_at = NOW()
       WHERE id = ?`,
      [reason, reviewerId, id]
    );
  }
}

module.exports = {
  listCategories,
  listPublicBlogs,
  countPublicBlogs,
  findPublicBlogBySlug,
  findRelatedBlogs,
  listAdminBlogs,
  listPendingReview,
  listBySubscriber,
  findByIdForSubscriber,
  findAdminBlogById,
  ensureUniqueSlug,
  createBlog,
  updateBlog,
  softDeleteBlog,
  createWriterSubmission,
  updateWriterSubmission,
  reviewBlog,
};
