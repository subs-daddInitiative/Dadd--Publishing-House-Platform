const { pool } = require("../../config/db");
const { computeExpiry } = require("../../utils/trialDuration");
const { grantCategoryAccess } = require("../subscribers/subscribers.repository");

async function attachCategories(trials) {
  if (trials.length === 0) return trials;
  const ids = trials.map((trial) => trial.id);
  const [rows] = await pool.query(
    `SELECT trial_id, category_type, category_id FROM content_trial_categories WHERE trial_id IN (?)`,
    [ids]
  );
  const byTrial = new Map();
  for (const row of rows) {
    if (!byTrial.has(row.trial_id)) byTrial.set(row.trial_id, []);
    byTrial.get(row.trial_id).push({ category_type: row.category_type, category_id: row.category_id });
  }
  return trials.map((trial) => ({ ...trial, categories: byTrial.get(trial.id) || [] }));
}

async function listAdmin() {
  const [rows] = await pool.query(
    "SELECT * FROM content_trials WHERE deleted_at IS NULL ORDER BY created_at DESC"
  );
  return attachCategories(rows);
}

async function listPublic() {
  const [rows] = await pool.query(
    "SELECT id, name, duration_value, duration_unit, sort_order FROM content_trials WHERE is_active = 1 AND deleted_at IS NULL ORDER BY sort_order ASC, id ASC"
  );
  return attachCategories(rows);
}

async function findById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM content_trials WHERE id = ? AND deleted_at IS NULL LIMIT 1",
    [id]
  );
  if (!rows[0]) return null;
  const [withCategories] = await attachCategories([rows[0]]);
  return withCategories;
}

async function replaceCategories(trialId, categories) {
  await pool.query("DELETE FROM content_trial_categories WHERE trial_id = ?", [trialId]);
  if (categories.length === 0) return;
  const values = categories.map((cat) => [trialId, cat.categoryType, cat.categoryId]);
  await pool.query(
    "INSERT INTO content_trial_categories (trial_id, category_type, category_id) VALUES ?",
    [values]
  );
}

async function create({ name, durationValue, durationUnit, isActive, sortOrder, categories }) {
  const [result] = await pool.query(
    "INSERT INTO content_trials (name, duration_value, duration_unit, is_active, sort_order) VALUES (?, ?, ?, ?, ?)",
    [name, durationValue, durationUnit, isActive ? 1 : 0, sortOrder || 0]
  );
  await replaceCategories(result.insertId, categories || []);
  return result.insertId;
}

async function update(id, { name, durationValue, durationUnit, isActive, sortOrder, categories }) {
  await pool.query(
    "UPDATE content_trials SET name = ?, duration_value = ?, duration_unit = ?, is_active = ?, sort_order = ? WHERE id = ?",
    [name, durationValue, durationUnit, isActive ? 1 : 0, sortOrder || 0, id]
  );
  if (categories !== undefined) {
    await replaceCategories(id, categories || []);
  }
  return findById(id);
}

async function softDelete(id) {
  await pool.query("UPDATE content_trials SET deleted_at = NOW() WHERE id = ?", [id]);
}

async function hasRedeemed(trialId, subscriberId) {
  const [rows] = await pool.query(
    "SELECT 1 FROM content_trial_redemptions WHERE trial_id = ? AND subscriber_id = ? LIMIT 1",
    [trialId, subscriberId]
  );
  return rows.length > 0;
}

async function redeem(trialId, subscriberId, startsAt, endsAt) {
  const [result] = await pool.query(
    "INSERT INTO content_trial_redemptions (trial_id, subscriber_id, starts_at, ends_at) VALUES (?, ?, ?, ?)",
    [trialId, subscriberId, startsAt, endsAt]
  );
  const redemptionId = result.insertId;

  const [categories] = await pool.query(
    "SELECT category_type, category_id FROM content_trial_categories WHERE trial_id = ?",
    [trialId]
  );
  for (const category of categories) {
    await grantCategoryAccess(subscriberId, category.category_type, category.category_id, endsAt, "trial", redemptionId);
  }

  return { id: redemptionId, trial_id: trialId, subscriber_id: subscriberId, starts_at: startsAt, ends_at: endsAt };
}

module.exports = {
  listAdmin,
  listPublic,
  findById,
  create,
  update,
  softDelete,
  hasRedeemed,
  redeem,
  computeExpiry,
};
