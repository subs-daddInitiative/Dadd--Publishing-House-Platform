const { pool } = require("../../config/db");

async function findCompletedPurchase(subscriberId, studyId) {
  const [rows] = await pool.query(
    "SELECT id FROM study_purchases WHERE subscriber_id = ? AND study_id = ? AND status = 'completed' LIMIT 1",
    [subscriberId, studyId]
  );
  return rows[0] || null;
}

async function createPendingPurchase(subscriberId, studyId, price, currency) {
  const [result] = await pool.query(
    "INSERT INTO study_purchases (subscriber_id, study_id, price, currency, status) VALUES (?, ?, ?, ?, 'pending')",
    [subscriberId, studyId, price, currency]
  );
  return result.insertId;
}

async function attachTapCharge(purchaseId, tapChargeId) {
  await pool.query("UPDATE study_purchases SET tap_charge_id = ? WHERE id = ?", [
    tapChargeId,
    purchaseId,
  ]);
}

async function findByTapChargeId(tapChargeId) {
  const [rows] = await pool.query(
    "SELECT * FROM study_purchases WHERE tap_charge_id = ? LIMIT 1",
    [tapChargeId]
  );
  return rows[0] || null;
}

async function markResult(id, status) {
  await pool.query("UPDATE study_purchases SET status = ? WHERE id = ?", [status, id]);
}

module.exports = {
  findCompletedPurchase,
  createPendingPurchase,
  attachTapCharge,
  findByTapChargeId,
  markResult,
};
