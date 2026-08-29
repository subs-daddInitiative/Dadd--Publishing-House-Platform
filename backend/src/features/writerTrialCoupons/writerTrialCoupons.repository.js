const { pool } = require("../../config/db");

async function listCoupons() {
  const [rows] = await pool.query(
    "SELECT id, code, months, max_redemptions, redemptions_count, is_active, created_at FROM writer_trial_coupons ORDER BY created_at DESC"
  );
  return rows;
}

async function codeExists(code) {
  const [rows] = await pool.query("SELECT id FROM writer_trial_coupons WHERE code = ? LIMIT 1", [code]);
  return rows.length > 0;
}

async function createCoupon({ code, months, maxRedemptions, createdBy }) {
  const [result] = await pool.query(
    "INSERT INTO writer_trial_coupons (code, months, max_redemptions, created_by) VALUES (?, ?, ?, ?)",
    [code, months, maxRedemptions, createdBy || null]
  );
  return result.insertId;
}

async function findRedeemableByCode(code) {
  const [rows] = await pool.query(
    `SELECT * FROM writer_trial_coupons
     WHERE code = ? AND is_active = 1 AND redemptions_count < max_redemptions
     LIMIT 1`,
    [code]
  );
  return rows[0] || null;
}

async function hasSubscriberRedeemed(subscriberId) {
  const [rows] = await pool.query(
    "SELECT 1 FROM writer_trial_redemptions WHERE subscriber_id = ? LIMIT 1",
    [subscriberId]
  );
  return rows.length > 0;
}

async function recordRedemption(couponId, subscriberId) {
  await pool.query(
    "INSERT INTO writer_trial_redemptions (coupon_id, subscriber_id) VALUES (?, ?)",
    [couponId, subscriberId]
  );
  await pool.query(
    "UPDATE writer_trial_coupons SET redemptions_count = redemptions_count + 1 WHERE id = ?",
    [couponId]
  );
}

module.exports = {
  listCoupons,
  codeExists,
  createCoupon,
  findRedeemableByCode,
  hasSubscriberRedeemed,
  recordRedemption,
};
