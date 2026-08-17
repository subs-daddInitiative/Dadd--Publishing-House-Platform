const { pool } = require("../../config/db");

async function listPlans() {
  const [rows] = await pool.query(
    "SELECT id, tier, billing_cycle, price, currency FROM subscription_plans ORDER BY tier ASC, billing_cycle ASC"
  );
  return rows;
}

async function findPlanById(id) {
  const [rows] = await pool.query(
    "SELECT id, tier, billing_cycle, price, currency FROM subscription_plans WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

async function upsertPlanPrice(tier, billingCycle, price) {
  await pool.query(
    "UPDATE subscription_plans SET price = ? WHERE tier = ? AND billing_cycle = ?",
    [price, tier, billingCycle]
  );
}

module.exports = { listPlans, findPlanById, upsertPlanPrice };
