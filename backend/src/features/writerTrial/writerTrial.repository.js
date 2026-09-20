const { pool } = require("../../config/db");
const { computeExpiry } = require("../../utils/trialDuration");

const DEFAULT_SETTINGS = { is_enabled: false, duration_value: 1, duration_unit: "month" };

async function getSettings() {
  const [rows] = await pool.query(
    "SELECT id, is_enabled, duration_value, duration_unit, created_at, updated_at FROM writer_trial_settings WHERE id = 1 LIMIT 1"
  );
  if (!rows[0]) return { ...DEFAULT_SETTINGS };
  return { ...rows[0], is_enabled: Boolean(rows[0].is_enabled) };
}

async function updateSettings({ isEnabled, durationValue, durationUnit }) {
  await pool.query(
    `INSERT INTO writer_trial_settings (id, is_enabled, duration_value, duration_unit)
     VALUES (1, ?, ?, ?)
     ON DUPLICATE KEY UPDATE is_enabled = VALUES(is_enabled), duration_value = VALUES(duration_value), duration_unit = VALUES(duration_unit)`,
    [isEnabled ? 1 : 0, durationValue, durationUnit]
  );
  return getSettings();
}

function computeTrialExpiry(settings, from = new Date()) {
  return computeExpiry(settings.duration_value, settings.duration_unit, from);
}

module.exports = { getSettings, updateSettings, computeTrialExpiry };
