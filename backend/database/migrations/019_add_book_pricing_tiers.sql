CREATE TABLE IF NOT EXISTS book_pricing_tiers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tier_key VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  currency VARCHAR(6) NOT NULL DEFAULT 'USD',
  sort_order TINYINT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_book_pricing_tier_key (tier_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO book_pricing_tiers (tier_key, name, price, currency, sort_order) VALUES
  ('econ', 'اقتصادي', 0, 'USD', 1),
  ('pro', 'احترافي', 0, 'USD', 2),
  ('extra', 'مميز', 0, 'USD', 3);

ALTER TABLE books
  ADD COLUMN pricing_tier_id INT UNSIGNED NULL AFTER price,
  ADD CONSTRAINT fk_books_pricing_tier
    FOREIGN KEY (pricing_tier_id) REFERENCES book_pricing_tiers (id)
    ON DELETE SET NULL ON UPDATE CASCADE;
