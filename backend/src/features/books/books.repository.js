const { pool } = require("../../config/db");
const { slugify } = require("../../utils/slugify");

const PUBLIC_LIST_FIELDS = `
  b.id, b.title, b.slug, b.author, b.description, b.price, b.currency,
  b.rating, b.reviews_count, b.cover_image, b.published_at,
  bc.name AS category_name, bc.slug AS category_slug
`;

const SORT_COLUMNS = {
  newest: "b.published_at DESC",
  oldest: "b.published_at ASC",
  price_asc: "b.price ASC",
  price_desc: "b.price DESC",
};

async function listPublicBooks({ limit, offset, categorySlug, sort }) {
  const params = [];
  let query = `SELECT ${PUBLIC_LIST_FIELDS}
     FROM books b
     LEFT JOIN books_categories bc ON bc.id = b.category_id
     WHERE b.status = 'published' AND b.deleted_at IS NULL`;

  if (categorySlug) {
    query += " AND bc.slug = ?";
    params.push(categorySlug);
  }

  query += ` ORDER BY ${SORT_COLUMNS[sort] || SORT_COLUMNS.newest} LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await pool.query(query, params);
  return rows;
}

async function countPublicBooks({ categorySlug }) {
  const params = [];
  let query = `SELECT COUNT(*) AS count
     FROM books b
     LEFT JOIN books_categories bc ON bc.id = b.category_id
     WHERE b.status = 'published' AND b.deleted_at IS NULL`;

  if (categorySlug) {
    query += " AND bc.slug = ?";
    params.push(categorySlug);
  }

  const [rows] = await pool.query(query, params);
  return rows[0].count;
}

async function listExternalLinks(bookId) {
  const [rows] = await pool.query(
    "SELECT id, label, url FROM book_external_links WHERE book_id = ? ORDER BY sort_order ASC, id ASC",
    [bookId]
  );
  return rows;
}

async function findPublicBookBySlug(slug) {
  const [rows] = await pool.query(
    `SELECT ${PUBLIC_LIST_FIELDS}, b.category_id, b.pdf_file, b.updated_at
     FROM books b
     LEFT JOIN books_categories bc ON bc.id = b.category_id
     WHERE b.slug = ? AND b.status = 'published' AND b.deleted_at IS NULL
     LIMIT 1`,
    [slug]
  );
  const book = rows[0];
  if (!book) return null;

  book.external_links = await listExternalLinks(book.id);
  return book;
}

async function findRelatedBooks(categoryId, excludeId, limit = 3) {
  let sameCategory = [];
  if (categoryId) {
    const [rows] = await pool.query(
      `SELECT ${PUBLIC_LIST_FIELDS}
       FROM books b
       LEFT JOIN books_categories bc ON bc.id = b.category_id
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
     FROM books b
     LEFT JOIN books_categories bc ON bc.id = b.category_id
     WHERE b.id != ? AND b.status = 'published' AND b.deleted_at IS NULL
     ORDER BY b.published_at DESC
     LIMIT ?`,
    [excludeId, limit]
  );

  const seen = new Set(sameCategory.map((row) => row.id));
  const padded = latest.filter((row) => !seen.has(row.id));

  return [...sameCategory, ...padded].slice(0, limit);
}

async function listAdminBooks() {
  const [rows] = await pool.query(
    `SELECT b.id, b.title, b.slug, b.status, b.price, b.currency, b.cover_image,
            b.published_at, b.updated_at, bc.name AS category_name
     FROM books b
     LEFT JOIN books_categories bc ON bc.id = b.category_id
     WHERE b.deleted_at IS NULL
     ORDER BY b.created_at DESC`
  );
  return rows;
}

async function findAdminBookById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM books WHERE id = ? AND deleted_at IS NULL LIMIT 1",
    [id]
  );
  const book = rows[0];
  if (!book) return null;

  book.external_links = await listExternalLinks(book.id);
  return book;
}

async function slugExists(slug, excludeId) {
  const params = [slug];
  let query = "SELECT id FROM books WHERE slug = ?";
  if (excludeId) {
    query += " AND id != ?";
    params.push(excludeId);
  }
  const [rows] = await pool.query(`${query} LIMIT 1`, params);
  return rows.length > 0;
}

async function ensureUniqueSlug(title, excludeId) {
  const base = slugify(title) || "book";
  let candidate = base;
  let suffix = 2;
  while (await slugExists(candidate, excludeId)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

async function replaceExternalLinks(bookId, links) {
  await pool.query("DELETE FROM book_external_links WHERE book_id = ?", [bookId]);
  if (!links || links.length === 0) return;

  const values = links.map((link, index) => [bookId, link.label, link.url, index]);
  await pool.query(
    "INSERT INTO book_external_links (book_id, label, url, sort_order) VALUES ?",
    [values]
  );
}

async function createBook(data) {
  const publishedAt = data.status === "published" ? new Date() : null;
  const [result] = await pool.query(
    `INSERT INTO books
       (category_id, title, slug, author, description, price, currency, rating,
        reviews_count, cover_image, pdf_file, status, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.category_id || null,
      data.title,
      data.slug,
      data.author || null,
      data.description || null,
      data.price ?? null,
      data.currency || "SAR",
      data.rating ?? null,
      data.reviews_count ?? 0,
      data.cover_image || null,
      data.pdf_file || null,
      data.status,
      publishedAt,
    ]
  );
  return result.insertId;
}

async function updateBook(id, fields) {
  const allowedKeys = [
    "category_id",
    "title",
    "slug",
    "author",
    "description",
    "price",
    "currency",
    "rating",
    "reviews_count",
    "cover_image",
    "pdf_file",
    "status",
  ];
  const keys = Object.keys(fields).filter((key) => allowedKeys.includes(key));
  if (keys.length === 0) return findAdminBookById(id);

  const current = await findAdminBookById(id);
  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const values = keys.map((key) => fields[key]);

  const willPublishNow =
    fields.status === "published" && current && !current.published_at;

  const sql = willPublishNow
    ? `UPDATE books SET ${setClause}, published_at = NOW() WHERE id = ?`
    : `UPDATE books SET ${setClause} WHERE id = ?`;

  await pool.query(sql, [...values, id]);
  return findAdminBookById(id);
}

async function softDeleteBook(id) {
  await pool.query("UPDATE books SET deleted_at = NOW() WHERE id = ?", [id]);
}

module.exports = {
  listPublicBooks,
  countPublicBooks,
  findPublicBookBySlug,
  findRelatedBooks,
  listAdminBooks,
  findAdminBookById,
  ensureUniqueSlug,
  createBook,
  updateBook,
  softDeleteBook,
  replaceExternalLinks,
};
