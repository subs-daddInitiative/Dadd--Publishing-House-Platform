const { pool } = require("../../config/db");

const ALLOWED_PLATFORMS = ["facebook", "instagram", "tiktok", "snapchat", "linkedin"];

async function getSettings() {
  const [rows] = await pool.query("SELECT * FROM settings WHERE id = 1 LIMIT 1");
  return rows[0] || null;
}

async function updateSettings(fields) {
  const allowedKeys = ["site_name", "call_number", "whatsapp_number", "about_text"];
  const keys = Object.keys(fields).filter((key) => allowedKeys.includes(key));

  if (keys.length === 0) return getSettings();

  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const values = keys.map((key) => fields[key]);

  await pool.query(`UPDATE settings SET ${setClause} WHERE id = 1`, values);
  return getSettings();
}

async function updateLogo(logoPath) {
  await pool.query("UPDATE settings SET logo = ? WHERE id = 1", [logoPath]);
  return getSettings();
}

async function getSocialLinks() {
  const [rows] = await pool.query(
    "SELECT platform, url, is_active FROM social_links WHERE settings_id = 1 ORDER BY sort_order ASC"
  );
  return rows;
}

async function upsertSocialLink(platform, url) {
  if (!ALLOWED_PLATFORMS.includes(platform)) {
    const error = new Error(`Unsupported platform: ${platform}`);
    error.status = 400;
    throw error;
  }

  await pool.query(
    `INSERT INTO social_links (settings_id, platform, url, is_active)
     VALUES (1, ?, ?, 1)
     ON DUPLICATE KEY UPDATE url = VALUES(url), is_active = 1`,
    [platform, url]
  );
  return getSocialLinks();
}

async function removeSocialLink(platform) {
  await pool.query(
    "DELETE FROM social_links WHERE settings_id = 1 AND platform = ?",
    [platform]
  );
  return getSocialLinks();
}

module.exports = {
  ALLOWED_PLATFORMS,
  getSettings,
  updateSettings,
  updateLogo,
  getSocialLinks,
  upsertSocialLink,
  removeSocialLink,
};
