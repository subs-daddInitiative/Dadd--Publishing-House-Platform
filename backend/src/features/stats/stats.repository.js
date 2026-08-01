const { pool } = require("../../config/db");

async function countPublished(table) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count FROM ${table} WHERE status = 'published' AND deleted_at IS NULL`
  );
  return rows[0].count;
}

async function getContentCounts() {
  const [books, studies, blogs] = await Promise.all([
    countPublished("books"),
    countPublished("studies"),
    countPublished("blogs"),
  ]);

  return { books, studies, blogs };
}

module.exports = { getContentCounts };
