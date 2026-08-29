const { pool } = require("../../config/db");

async function createPendingSubscription(subscriberId, planId) {
  const [result] = await pool.query(
    "INSERT INTO subscriptions (subscriber_id, plan_id, status) VALUES (?, ?, 'pending')",
    [subscriberId, planId]
  );
  return result.insertId;
}

async function attachTapCharge(subscriptionId, tapChargeId) {
  await pool.query("UPDATE subscriptions SET tap_charge_id = ? WHERE id = ?", [
    tapChargeId,
    subscriptionId,
  ]);
}

async function findByTapChargeId(tapChargeId) {
  const [rows] = await pool.query(
    "SELECT * FROM subscriptions WHERE tap_charge_id = ? LIMIT 1",
    [tapChargeId]
  );
  return rows[0] || null;
}

async function attachPaypalOrder(subscriptionId, orderId) {
  await pool.query("UPDATE subscriptions SET payment_provider = 'paypal', paypal_order_id = ? WHERE id = ?", [
    orderId,
    subscriptionId,
  ]);
}

async function findByPaypalOrderId(orderId) {
  const [rows] = await pool.query(
    "SELECT * FROM subscriptions WHERE paypal_order_id = ? LIMIT 1",
    [orderId]
  );
  return rows[0] || null;
}

async function findById(id, subscriberId) {
  const [rows] = await pool.query(
    "SELECT * FROM subscriptions WHERE id = ? AND subscriber_id = ? LIMIT 1",
    [id, subscriberId]
  );
  return rows[0] || null;
}

async function markSubscriptionResult(id, status, startsAt, endsAt) {
  await pool.query(
    "UPDATE subscriptions SET status = ?, starts_at = ?, ends_at = ? WHERE id = ?",
    [status, startsAt, endsAt, id]
  );
}

module.exports = {
  createPendingSubscription,
  attachTapCharge,
  findByTapChargeId,
  attachPaypalOrder,
  findByPaypalOrderId,
  findById,
  markSubscriptionResult,
};
