const { pool } = require("../../config/db");
const { slugify } = require("../../utils/slugify");

const HIGHLIGHT_ACTIVE_EXPR = "(b.is_highlighted = 1 AND (b.highlighted_until IS NULL OR b.highlighted_until >= NOW()))";

const TRANSLATABLE_LOCALES = ["en", "de"];

function isTranslatableLocale(locale) {
  return TRANSLATABLE_LOCALES.includes(locale);
}

const PUBLIC_LIST_FIELDS = `
  b.id, b.title, b.slug, b.excerpt, b.cover_image, b.published_at, b.is_premium,
  b.is_highlighted, b.highlighted_until, ${HIGHLIGHT_ACTIVE_EXPR} AS is_highlighted_active,
  bc.name AS category_name, bc.slug AS category_slug,
  COALESCE(b.author_name, u.name) AS author_name
`;

// Same shape as PUBLIC_LIST_FIELDS, but title/slug/excerpt come from the
// translation row (bt) — used whenever locale is a non-Arabic locale, since a
// blog only exists in that locale once a matching blog_translations row does.
const PUBLIC_LIST_FIELDS_TRANSLATED = `
  b.id, bt.title, bt.slug, bt.excerpt, b.cover_image, b.published_at, b.is_premium,
  b.is_highlighted, b.highlighted_until, ${HIGHLIGHT_ACTIVE_EXPR} AS is_highlighted_active,
  bc.name AS category_name, bc.slug AS category_slug,
  COALESCE(b.author_name, u.name) AS author_name
`;

async function listCategories() {
  const [rows] = await pool.query(
    "SELECT id, name, slug FROM blogs_categories WHERE deleted_at IS NULL ORDER BY name ASC"
  );
  return rows;
}

const PUBLIC_SORT_COLUMNS = {
  newest: "b.published_at DESC",
  oldest: "b.published_at ASC",
};

async function listPublicBlogs({ limit, offset, premium, categorySlug, search, sort, locale }) {
  const translated = isTranslatableLocale(locale);
  const params = [];
  let query = `SELECT ${translated ? PUBLIC_LIST_FIELDS_TRANSLATED : PUBLIC_LIST_FIELDS}
     FROM blogs b
     ${translated ? "INNER JOIN blog_translations bt ON bt.blog_id = b.id AND bt.locale = ?" : ""}
     LEFT JOIN blogs_categories bc ON bc.id = b.category_id
     LEFT JOIN users u ON u.id = b.author_id
     WHERE b.status = 'published' AND b.deleted_at IS NULL`;
  if (translated) params.push(locale);

  if (premium === "premium") {
    query += " AND b.is_premium = 1";
  } else if (premium === "free") {
    query += " AND b.is_premium = 0";
  }
  if (categorySlug) {
    query += " AND bc.slug = ?";
    params.push(categorySlug);
  }
  if (search) {
    query += ` AND ${translated ? "bt.title" : "b.title"} LIKE ?`;
    params.push(`%${search}%`);
  }

  query += ` ORDER BY is_highlighted_active DESC, ${PUBLIC_SORT_COLUMNS[sort] || PUBLIC_SORT_COLUMNS.newest} LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await pool.query(query, params);
  return rows;
}

async function countPublicBlogs({ premium, categorySlug, search, locale } = {}) {
  const translated = isTranslatableLocale(locale);
  const params = [];
  let query = `SELECT COUNT(*) AS count
     FROM blogs b
     ${translated ? "INNER JOIN blog_translations bt ON bt.blog_id = b.id AND bt.locale = ?" : ""}
     LEFT JOIN blogs_categories bc ON bc.id = b.category_id
     WHERE b.status = 'published' AND b.deleted_at IS NULL`;
  if (translated) params.push(locale);

  if (premium === "premium") {
    query += " AND b.is_premium = 1";
  } else if (premium === "free") {
    query += " AND b.is_premium = 0";
  }
  if (categorySlug) {
    query += " AND bc.slug = ?";
    params.push(categorySlug);
  }
  if (search) {
    query += ` AND ${translated ? "bt.title" : "b.title"} LIKE ?`;
    params.push(`%${search}%`);
  }
  const [rows] = await pool.query(query, params);
  return rows[0].count;
}

async function findPublicBlogBySlug(slug, locale) {
  const translated = isTranslatableLocale(locale);

  if (translated) {
    const [rows] = await pool.query(
      `SELECT ${PUBLIC_LIST_FIELDS_TRANSLATED}, b.category_id, bt.content_blocks, bt.seo_keywords, bt.updated_at
       FROM blog_translations bt
       INNER JOIN blogs b ON b.id = bt.blog_id
       LEFT JOIN blogs_categories bc ON bc.id = b.category_id
       LEFT JOIN users u ON u.id = b.author_id
       WHERE bt.slug = ? AND bt.locale = ? AND b.status = 'published' AND b.deleted_at IS NULL
       LIMIT 1`,
      [slug, locale]
    );
    return rows[0] || null;
  }

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

async function findRelatedBlogs(categoryId, excludeId, locale, limit = 3) {
  const translated = isTranslatableLocale(locale);
  const fields = translated ? PUBLIC_LIST_FIELDS_TRANSLATED : PUBLIC_LIST_FIELDS;
  const translationJoin = translated ? "INNER JOIN blog_translations bt ON bt.blog_id = b.id AND bt.locale = ?" : "";

  let sameCategory = [];
  if (categoryId) {
    const params = translated ? [locale, categoryId, excludeId, limit] : [categoryId, excludeId, limit];
    const [rows] = await pool.query(
      `SELECT ${fields}
       FROM blogs b
       ${translationJoin}
       LEFT JOIN blogs_categories bc ON bc.id = b.category_id
       LEFT JOIN users u ON u.id = b.author_id
       WHERE b.category_id = ? AND b.id != ? AND b.status = 'published' AND b.deleted_at IS NULL
       ORDER BY b.published_at DESC
       LIMIT ?`,
      params
    );
    sameCategory = rows;
  }

  if (sameCategory.length >= limit) return sameCategory;

  const latestParams = translated ? [locale, excludeId, limit] : [excludeId, limit];
  const [latest] = await pool.query(
    `SELECT ${fields}
     FROM blogs b
     ${translationJoin}
     LEFT JOIN blogs_categories bc ON bc.id = b.category_id
     LEFT JOIN users u ON u.id = b.author_id
     WHERE b.id != ? AND b.status = 'published' AND b.deleted_at IS NULL
     ORDER BY b.published_at DESC
     LIMIT ?`,
    latestParams
  );

  const seen = new Set(sameCategory.map((row) => row.id));
  const padded = latest.filter((row) => !seen.has(row.id));

  return [...sameCategory, ...padded].slice(0, limit);
}

async function listAdminBlogs({ search, premium, highlighted, category, status } = {}) {
  const params = [];
  let query = `SELECT b.id, b.title, b.slug, b.status, b.review_status, b.cover_image, b.published_at, b.updated_at,
            b.author_name, b.is_premium, b.is_highlighted, b.highlighted_until,
            ${HIGHLIGHT_ACTIVE_EXPR} AS is_highlighted_active, b.category_id, bc.name AS category_name
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
  if (highlighted === "1") {
    query += ` AND ${HIGHLIGHT_ACTIVE_EXPR}`;
  }
  if (category) {
    query += " AND b.category_id = ?";
    params.push(category);
  }
  if (status === "draft" || status === "published") {
    query += " AND b.status = ?";
    params.push(status);
  }

  query += " ORDER BY b.created_at DESC";

  const [rows] = await pool.query(query, params);
  return rows;
}

async function countActiveHighlightedBlogs() {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count FROM blogs b WHERE b.deleted_at IS NULL AND ${HIGHLIGHT_ACTIVE_EXPR}`
  );
  return rows[0].count;
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
       (category_id, author_id, author_name, title, slug, excerpt, content_blocks, seo_keywords, cover_image, status, is_premium, is_highlighted, highlighted_until, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      data.is_highlighted ? 1 : 0,
      data.highlighted_until || null,
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
    "is_highlighted",
    "highlighted_until",
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

async function listTranslations(blogId) {
  const [rows] = await pool.query(
    "SELECT locale, title, slug, excerpt, updated_at FROM blog_translations WHERE blog_id = ? ORDER BY locale ASC",
    [blogId]
  );
  return rows;
}

async function findTranslation(blogId, locale) {
  const [rows] = await pool.query(
    "SELECT * FROM blog_translations WHERE blog_id = ? AND locale = ? LIMIT 1",
    [blogId, locale]
  );
  return rows[0] || null;
}

async function translationSlugExists(locale, slug, excludeBlogId) {
  const params = [locale, slug];
  let query = "SELECT id FROM blog_translations WHERE locale = ? AND slug = ?";
  if (excludeBlogId) {
    query += " AND blog_id != ?";
    params.push(excludeBlogId);
  }
  const [rows] = await pool.query(`${query} LIMIT 1`, params);
  return rows.length > 0;
}

async function ensureUniqueTranslationSlug(locale, title, excludeBlogId) {
  const base = slugify(title) || "post";
  let candidate = base;
  let suffix = 2;
  while (await translationSlugExists(locale, candidate, excludeBlogId)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

async function upsertTranslation(blogId, locale, data) {
  await pool.query(
    `INSERT INTO blog_translations (blog_id, locale, title, slug, excerpt, content_blocks, seo_keywords)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       title = VALUES(title), slug = VALUES(slug), excerpt = VALUES(excerpt),
       content_blocks = VALUES(content_blocks), seo_keywords = VALUES(seo_keywords)`,
    [
      blogId,
      locale,
      data.title,
      data.slug,
      data.excerpt || null,
      data.content_blocks || null,
      data.seo_keywords || null,
    ]
  );
  return findTranslation(blogId, locale);
}

async function deleteTranslation(blogId, locale) {
  await pool.query("DELETE FROM blog_translations WHERE blog_id = ? AND locale = ?", [blogId, locale]);
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
  countActiveHighlightedBlogs,
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
  TRANSLATABLE_LOCALES,
  listTranslations,
  findTranslation,
  ensureUniqueTranslationSlug,
  upsertTranslation,
  deleteTranslation,
};
