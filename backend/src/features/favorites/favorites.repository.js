const { pool } = require("../../config/db");

async function listFavorites(subscriberId) {
  const [blogs] = await pool.query(
    `SELECT f.item_id AS id, b.title, b.slug, b.cover_image, f.created_at
     FROM favorites f
     JOIN blogs b ON b.id = f.item_id AND b.deleted_at IS NULL
     WHERE f.subscriber_id = ? AND f.item_type = 'blog'
     ORDER BY f.created_at DESC`,
    [subscriberId]
  );

  const [studies] = await pool.query(
    `SELECT f.item_id AS id, s.title, s.slug, s.cover_image, f.created_at
     FROM favorites f
     JOIN studies s ON s.id = f.item_id AND s.deleted_at IS NULL
     WHERE f.subscriber_id = ? AND f.item_type = 'study'
     ORDER BY f.created_at DESC`,
    [subscriberId]
  );

  return { blogs, studies };
}

async function listFavoriteIds(subscriberId) {
  const [rows] = await pool.query(
    "SELECT item_type, item_id FROM favorites WHERE subscriber_id = ?",
    [subscriberId]
  );
  return rows;
}

async function addFavorite(subscriberId, itemType, itemId) {
  await pool.query(
    "INSERT IGNORE INTO favorites (subscriber_id, item_type, item_id) VALUES (?, ?, ?)",
    [subscriberId, itemType, itemId]
  );
}

async function removeFavorite(subscriberId, itemType, itemId) {
  await pool.query(
    "DELETE FROM favorites WHERE subscriber_id = ? AND item_type = ? AND item_id = ?",
    [subscriberId, itemType, itemId]
  );
}

module.exports = { listFavorites, listFavoriteIds, addFavorite, removeFavorite };
