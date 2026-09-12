const { pool } = require("../../config/db");

const SUBJECTS = ["books", "studies", "blogs", "issues"];

async function createMessage({ name, email, phone, subject, message }) {
  const [result] = await pool.query(
    "INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
    [name, email, phone, subject, message]
  );
  return result.insertId;
}

async function listMessages({ subject, status } = {}) {
  const params = [];
  let query = `SELECT id, name, email, phone, subject, message, is_read, created_at
     FROM contact_messages
     WHERE deleted_at IS NULL`;

  if (subject && SUBJECTS.includes(subject)) {
    query += " AND subject = ?";
    params.push(subject);
  }
  if (status === "unread") {
    query += " AND is_read = 0";
  } else if (status === "read") {
    query += " AND is_read = 1";
  }

  query += " ORDER BY created_at DESC";

  const [rows] = await pool.query(query, params);
  return rows;
}

async function countUnread() {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS count FROM contact_messages WHERE deleted_at IS NULL AND is_read = 0"
  );
  return rows[0].count;
}

async function findMessageById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM contact_messages WHERE id = ? AND deleted_at IS NULL LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

async function markAsRead(id) {
  await pool.query("UPDATE contact_messages SET is_read = 1 WHERE id = ?", [id]);
}

async function softDeleteMessage(id) {
  await pool.query("UPDATE contact_messages SET deleted_at = NOW() WHERE id = ?", [id]);
}

module.exports = {
  SUBJECTS,
  createMessage,
  listMessages,
  countUnread,
  findMessageById,
  markAsRead,
  softDeleteMessage,
};
