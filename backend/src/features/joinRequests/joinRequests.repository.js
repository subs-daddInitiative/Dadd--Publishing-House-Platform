const { pool } = require("../../config/db");

const REQUEST_TYPES = ["volunteer", "complaint", "suggestion"];

async function createRequest(data) {
  const [result] = await pool.query(
    `INSERT INTO join_requests
       (request_type, participation_type, institution_name, institution_type, institution_website,
        full_name, email, phone, location, interest_areas, message, newsletter_opt_in)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.request_type,
      data.participation_type,
      data.institution_name,
      data.institution_type,
      data.institution_website,
      data.full_name,
      data.email,
      data.phone,
      data.location,
      data.interest_areas,
      data.message,
      data.newsletter_opt_in,
    ]
  );
  return result.insertId;
}

async function listRequests({ requestType, status } = {}) {
  const params = [];
  let query = "SELECT * FROM join_requests WHERE deleted_at IS NULL";

  if (requestType && REQUEST_TYPES.includes(requestType)) {
    query += " AND request_type = ?";
    params.push(requestType);
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
    "SELECT COUNT(*) AS count FROM join_requests WHERE deleted_at IS NULL AND is_read = 0"
  );
  return rows[0].count;
}

async function findRequestById(id) {
  const [rows] = await pool.query("SELECT * FROM join_requests WHERE id = ? AND deleted_at IS NULL LIMIT 1", [id]);
  return rows[0] || null;
}

async function markAsRead(id) {
  await pool.query("UPDATE join_requests SET is_read = 1 WHERE id = ?", [id]);
}

async function softDeleteRequest(id) {
  await pool.query("UPDATE join_requests SET deleted_at = NOW() WHERE id = ?", [id]);
}

module.exports = {
  REQUEST_TYPES,
  createRequest,
  listRequests,
  countUnread,
  findRequestById,
  markAsRead,
  softDeleteRequest,
};
