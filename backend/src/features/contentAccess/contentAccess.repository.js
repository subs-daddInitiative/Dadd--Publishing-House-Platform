const { pool } = require("../../config/db");

async function listPlans() {
  const [rows] = await pool.query(
    "SELECT id, category, billing_cycle, price, currency FROM content_subscription_plans ORDER BY category ASC, billing_cycle ASC"
  );
  return rows;
}

async function findPlanById(id) {
  const [rows] = await pool.query(
    "SELECT id, category, billing_cycle, price, currency FROM content_subscription_plans WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

async function upsertPlanPrice(category, billingCycle, price) {
  await pool.query(
    "UPDATE content_subscription_plans SET price = ? WHERE category = ? AND billing_cycle = ?",
    [price, category, billingCycle]
  );
}

async function createPendingAccessSubscription(subscriberId, planId) {
  const [result] = await pool.query(
    "INSERT INTO content_access_subscriptions (subscriber_id, plan_id, status) VALUES (?, ?, 'pending')",
    [subscriberId, planId]
  );
  return result.insertId;
}

async function attachTapCharge(subscriptionId, tapChargeId) {
  await pool.query("UPDATE content_access_subscriptions SET tap_charge_id = ? WHERE id = ?", [
    tapChargeId,
    subscriptionId,
  ]);
}

async function findByTapChargeId(tapChargeId) {
  const [rows] = await pool.query(
    "SELECT * FROM content_access_subscriptions WHERE tap_charge_id = ? LIMIT 1",
    [tapChargeId]
  );
  return rows[0] || null;
}

async function markResult(id, status, startsAt, endsAt) {
  await pool.query(
    "UPDATE content_access_subscriptions SET status = ?, starts_at = ?, ends_at = ? WHERE id = ?",
    [status, startsAt, endsAt, id]
  );
}

async function listPlanCategories(planId) {
  const [rows] = await pool.query(
    "SELECT category_type, category_id FROM content_subscription_plan_categories WHERE plan_id = ?",
    [planId]
  );
  return rows;
}

async function replacePlanCategories(planId, categories) {
  await pool.query("DELETE FROM content_subscription_plan_categories WHERE plan_id = ?", [planId]);
  if (categories.length === 0) return;
  const values = categories.map((cat) => [planId, cat.categoryType, cat.categoryId]);
  await pool.query(
    "INSERT INTO content_subscription_plan_categories (plan_id, category_type, category_id) VALUES ?",
    [values]
  );
}

module.exports = {
  listPlans,
  findPlanById,
  upsertPlanPrice,
  createPendingAccessSubscription,
  attachTapCharge,
  findByTapChargeId,
  markResult,
  listPlanCategories,
  replacePlanCategories,
};
