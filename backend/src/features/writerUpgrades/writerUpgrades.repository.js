const { pool } = require("../../config/db");

async function findLatestBySubscriber(subscriberId) {
  const [rows] = await pool.query(
    "SELECT * FROM writer_upgrade_requests WHERE subscriber_id = ? ORDER BY created_at DESC LIMIT 1",
    [subscriberId]
  );
  return rows[0] || null;
}

async function createRequest(subscriberId) {
  const [result] = await pool.query(
    "INSERT INTO writer_upgrade_requests (subscriber_id, status) VALUES (?, 'pending')",
    [subscriberId]
  );
  return result.insertId;
}

async function listPending() {
  const [rows] = await pool.query(
    `SELECT r.id, r.subscriber_id, r.status, r.created_at, s.name, s.email, s.current_tier
     FROM writer_upgrade_requests r
     JOIN subscribers s ON s.id = r.subscriber_id
     WHERE r.status = 'pending'
     ORDER BY r.created_at ASC`
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query("SELECT * FROM writer_upgrade_requests WHERE id = ? LIMIT 1", [id]);
  return rows[0] || null;
}

async function decide(id, status, reason, decidedBy) {
  await pool.query(
    "UPDATE writer_upgrade_requests SET status = ?, reason = ?, decided_by = ?, decided_at = NOW() WHERE id = ?",
    [status, reason || null, decidedBy, id]
  );
}

module.exports = {
  findLatestBySubscriber,
  createRequest,
  listPending,
  findById,
  decide,
};
