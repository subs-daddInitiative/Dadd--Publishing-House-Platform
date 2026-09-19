const { pool } = require("../../config/db");
const { slugify } = require("../../utils/slugify");

const HIGHLIGHT_ACTIVE_EXPR = "(s.is_highlighted = 1 AND (s.highlighted_until IS NULL OR s.highlighted_until >= NOW()))";

const TRANSLATABLE_LOCALES = ["en", "de"];

function isTranslatableLocale(locale) {
  return TRANSLATABLE_LOCALES.includes(locale);
}

const PUBLIC_LIST_FIELDS = `
  s.id, s.title, s.slug, s.description, s.author, s.cover_image, s.published_at,
  s.is_premium, s.price, s.currency,
  s.is_highlighted, s.highlighted_until, ${HIGHLIGHT_ACTIVE_EXPR} AS is_highlighted_active,
  sc.name AS category_name, sc.slug AS category_slug
`;

// Same shape as PUBLIC_LIST_FIELDS, but title/slug/description come from the
// translation row (st) — used whenever locale is a non-Arabic locale, since a
// study only exists in that locale once a matching study_translations row does.
const PUBLIC_LIST_FIELDS_TRANSLATED = `
  s.id, st.title, st.slug, st.description, s.author, s.cover_image, s.published_at,
  s.is_premium, s.price, s.currency,
  s.is_highlighted, s.highlighted_until, ${HIGHLIGHT_ACTIVE_EXPR} AS is_highlighted_active,
  sct.name AS category_name, sc.slug AS category_slug
`;

// Only added when locale is a non-Arabic locale — category_name comes back
// NULL (hiding the tag) rather than falling back to the Arabic name.
const CATEGORY_TRANSLATION_JOIN =
  "LEFT JOIN studies_categories_translations sct ON sct.category_id = sc.id AND sct.locale = ?";

const SORT_COLUMNS = {
  newest: "s.published_at DESC",
  oldest: "s.published_at ASC",
};


async function listPublicStudies({ limit, offset, categorySlug, sort, premium, search, locale }) {
  const translated = isTranslatableLocale(locale);
  const params = [];
  let query = `SELECT ${translated ? PUBLIC_LIST_FIELDS_TRANSLATED : PUBLIC_LIST_FIELDS}
     FROM studies s
     ${translated ? "INNER JOIN study_translations st ON st.study_id = s.id AND st.locale = ?" : ""}
     LEFT JOIN studies_categories sc ON sc.id = s.category_id
     ${translated ? CATEGORY_TRANSLATION_JOIN : ""}
     WHERE s.status = 'published' AND s.deleted_at IS NULL`;
  if (translated) params.push(locale, locale);

  if (categorySlug) {
    query += " AND sc.slug = ?";
    params.push(categorySlug);
  }
  if (premium === "premium") {
    query += " AND s.is_premium = 1";
  } else if (premium === "free") {
    query += " AND s.is_premium = 0";
  }
  if (search) {
    query += ` AND ${translated ? "st.title" : "s.title"} LIKE ?`;
    params.push(`%${search}%`);
  }

  query += ` ORDER BY is_highlighted_active DESC, ${SORT_COLUMNS[sort] || SORT_COLUMNS.newest} LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await pool.query(query, params);
  return rows;
}

async function countPublicStudies({ categorySlug, premium, search, locale } = {}) {
  const translated = isTranslatableLocale(locale);
  const params = [];
  let query = `SELECT COUNT(*) AS count
     FROM studies s
     ${translated ? "INNER JOIN study_translations st ON st.study_id = s.id AND st.locale = ?" : ""}
     LEFT JOIN studies_categories sc ON sc.id = s.category_id
     WHERE s.status = 'published' AND s.deleted_at IS NULL`;
  if (translated) params.push(locale);

  if (categorySlug) {
    query += " AND sc.slug = ?";
    params.push(categorySlug);
  }
  if (premium === "premium") {
    query += " AND s.is_premium = 1";
  } else if (premium === "free") {
    query += " AND s.is_premium = 0";
  }
  if (search) {
    query += ` AND ${translated ? "st.title" : "s.title"} LIKE ?`;
    params.push(`%${search}%`);
  }

  const [rows] = await pool.query(query, params);
  return rows[0].count;
}

async function findPublicStudyBySlug(slug, locale) {
  const translated = isTranslatableLocale(locale);

  if (translated) {
    const [rows] = await pool.query(
      `SELECT ${PUBLIC_LIST_FIELDS_TRANSLATED}, s.category_id, s.main_image,
              st.content_blocks, st.updated_at
       FROM study_translations st
       INNER JOIN studies s ON s.id = st.study_id
       LEFT JOIN studies_categories sc ON sc.id = s.category_id
       ${CATEGORY_TRANSLATION_JOIN}
       WHERE st.slug = ? AND st.locale = ? AND s.status = 'published' AND s.deleted_at IS NULL
       LIMIT 1`,
      [locale, slug, locale]
    );
    return rows[0] || null;
  }

  const [rows] = await pool.query(
    `SELECT ${PUBLIC_LIST_FIELDS}, s.category_id, s.main_image, s.content_intro, s.content_body,
            s.content_blocks, s.pdf_file, s.updated_at
     FROM studies s
     LEFT JOIN studies_categories sc ON sc.id = s.category_id
     WHERE s.slug = ? AND s.status = 'published' AND s.deleted_at IS NULL
     LIMIT 1`,
    [slug]
  );
  return rows[0] || null;
}

async function findRelatedStudies(categoryId, excludeId, locale, limit = 3) {
  const translated = isTranslatableLocale(locale);
  const fields = translated ? PUBLIC_LIST_FIELDS_TRANSLATED : PUBLIC_LIST_FIELDS;
  const translationJoin = translated ? "INNER JOIN study_translations st ON st.study_id = s.id AND st.locale = ?" : "";
  const categoryJoin = translated ? CATEGORY_TRANSLATION_JOIN : "";

  let sameCategory = [];
  if (categoryId) {
    const params = translated ? [locale, locale, categoryId, excludeId, limit] : [categoryId, excludeId, limit];
    const [rows] = await pool.query(
      `SELECT ${fields}
       FROM studies s
       ${translationJoin}
       LEFT JOIN studies_categories sc ON sc.id = s.category_id
       ${categoryJoin}
       WHERE s.category_id = ? AND s.id != ? AND s.status = 'published' AND s.deleted_at IS NULL
       ORDER BY s.published_at DESC
       LIMIT ?`,
      params
    );
    sameCategory = rows;
  }

  if (sameCategory.length >= limit) return sameCategory;

  const latestParams = translated ? [locale, locale, excludeId, limit] : [excludeId, limit];
  const [latest] = await pool.query(
    `SELECT ${fields}
     FROM studies s
     ${translationJoin}
     LEFT JOIN studies_categories sc ON sc.id = s.category_id
     ${categoryJoin}
     WHERE s.id != ? AND s.status = 'published' AND s.deleted_at IS NULL
     ORDER BY s.published_at DESC
     LIMIT ?`,
    latestParams
  );

  const seen = new Set(sameCategory.map((row) => row.id));
  const padded = latest.filter((row) => !seen.has(row.id));

  return [...sameCategory, ...padded].slice(0, limit);
}

async function listAdminStudies({ search, premium, highlighted, category, status } = {}) {
  const params = [];
  let query = `SELECT s.id, s.title, s.slug, s.status, s.cover_image, s.published_at, s.updated_at,
            s.is_premium, s.is_highlighted, s.highlighted_until,
            ${HIGHLIGHT_ACTIVE_EXPR} AS is_highlighted_active, s.category_id, sc.name AS category_name
     FROM studies s
     LEFT JOIN studies_categories sc ON sc.id = s.category_id
     WHERE s.deleted_at IS NULL`;

  if (search) {
    query += " AND s.title LIKE ?";
    params.push(`%${search}%`);
  }
  if (premium === "premium") {
    query += " AND s.is_premium = 1";
  } else if (premium === "free") {
    query += " AND s.is_premium = 0";
  }
  if (highlighted === "1") {
    query += ` AND ${HIGHLIGHT_ACTIVE_EXPR}`;
  }
  if (category) {
    query += " AND s.category_id = ?";
    params.push(category);
  }
  if (status === "draft" || status === "published") {
    query += " AND s.status = ?";
    params.push(status);
  }

  query += " ORDER BY s.created_at DESC";

  const [rows] = await pool.query(query, params);
  return rows;
}

async function countActiveHighlightedStudies() {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count FROM studies s WHERE s.deleted_at IS NULL AND ${HIGHLIGHT_ACTIVE_EXPR}`
  );
  return rows[0].count;
}

async function findStudyById(id) {
  const [rows] = await pool.query(
    "SELECT id, title, is_premium, price, currency FROM studies WHERE id = ? AND deleted_at IS NULL LIMIT 1",
    [id]
  );
  return rows[0] || null;
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
       (category_id, title, slug, author, description, content_intro, content_body, content_blocks,
        cover_image, main_image, pdf_file, status, is_premium, is_highlighted, highlighted_until, price, currency, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.category_id || null,
      data.title,
      data.slug,
      data.author || null,
      data.description || null,
      data.content_intro || null,
      data.content_body || null,
      data.content_blocks || null,
      data.cover_image || null,
      data.main_image || null,
      data.pdf_file || null,
      data.status,
      data.is_premium ? 1 : 0,
      data.is_highlighted ? 1 : 0,
      data.highlighted_until || null,
      data.is_premium ? data.price || null : null,
      data.currency || "USD",
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
    "content_blocks",
    "cover_image",
    "main_image",
    "pdf_file",
    "status",
    "is_premium",
    "is_highlighted",
    "highlighted_until",
    "price",
    "currency",
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

async function listTranslations(studyId) {
  const [rows] = await pool.query(
    "SELECT locale, title, slug, description, updated_at FROM study_translations WHERE study_id = ? ORDER BY locale ASC",
    [studyId]
  );
  return rows;
}

async function findTranslation(studyId, locale) {
  const [rows] = await pool.query(
    "SELECT * FROM study_translations WHERE study_id = ? AND locale = ? LIMIT 1",
    [studyId, locale]
  );
  return rows[0] || null;
}

async function translationSlugExists(locale, slug, excludeStudyId) {
  const params = [locale, slug];
  let query = "SELECT id FROM study_translations WHERE locale = ? AND slug = ?";
  if (excludeStudyId) {
    query += " AND study_id != ?";
    params.push(excludeStudyId);
  }
  const [rows] = await pool.query(`${query} LIMIT 1`, params);
  return rows.length > 0;
}

async function ensureUniqueTranslationSlug(locale, title, excludeStudyId) {
  const base = slugify(title) || "study";
  let candidate = base;
  let suffix = 2;
  while (await translationSlugExists(locale, candidate, excludeStudyId)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

async function upsertTranslation(studyId, locale, data) {
  await pool.query(
    `INSERT INTO study_translations (study_id, locale, title, slug, description, content_blocks)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       title = VALUES(title), slug = VALUES(slug), description = VALUES(description),
       content_blocks = VALUES(content_blocks)`,
    [studyId, locale, data.title, data.slug, data.description || null, data.content_blocks || null]
  );
  return findTranslation(studyId, locale);
}

async function deleteTranslation(studyId, locale) {
  await pool.query("DELETE FROM study_translations WHERE study_id = ? AND locale = ?", [studyId, locale]);
}

module.exports = {
  listPublicStudies,
  countPublicStudies,
  findPublicStudyBySlug,
  findRelatedStudies,
  listAdminStudies,
  countActiveHighlightedStudies,
  findAdminStudyById,
  findStudyById,
  ensureUniqueSlug,
  createStudy,
  updateStudy,
  softDeleteStudy,
  TRANSLATABLE_LOCALES,
  listTranslations,
  findTranslation,
  ensureUniqueTranslationSlug,
  upsertTranslation,
  deleteTranslation,
};
