const { pool } = require("../../config/db");

async function createSignup({ email, categorySlug, categoryName, blogSlug }) {
  await pool.query(
    `INSERT IGNORE INTO newsletter_signups (email, category_slug, category_name, blog_slug)
     VALUES (?, ?, ?, ?)`,
    [email, categorySlug, categoryName, blogSlug]
  );
}

module.exports = { createSignup };
