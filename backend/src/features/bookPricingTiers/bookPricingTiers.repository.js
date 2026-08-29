const { pool } = require("../../config/db");

async function listTiers() {
  const [rows] = await pool.query(
    "SELECT id, tier_key, name, price, currency, sort_order FROM book_pricing_tiers ORDER BY sort_order ASC, id ASC"
  );
  return rows;
}

async function updateTier(id, { name, price, currency }) {
  await pool.query(
    "UPDATE book_pricing_tiers SET name = ?, price = ?, currency = ? WHERE id = ?",
    [name, price, currency, id]
  );
}

module.exports = { listTiers, updateTier };
