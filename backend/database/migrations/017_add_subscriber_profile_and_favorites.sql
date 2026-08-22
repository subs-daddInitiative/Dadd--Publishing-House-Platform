ALTER TABLE subscribers
  ADD COLUMN bio TEXT NULL AFTER name,
  ADD COLUMN profile_image VARCHAR(255) NULL AFTER bio;

CREATE TABLE IF NOT EXISTS favorites (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  subscriber_id INT UNSIGNED NOT NULL,
  item_type ENUM('blog', 'study') NOT NULL,
  item_id INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_favorite (subscriber_id, item_type, item_id),
  CONSTRAINT fk_favorites_subscriber FOREIGN KEY (subscriber_id) REFERENCES subscribers (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
