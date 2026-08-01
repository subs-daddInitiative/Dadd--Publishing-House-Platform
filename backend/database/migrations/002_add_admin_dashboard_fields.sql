-- Adds admin-dashboard-managed fields to settings, and the banners table.
-- Safe to run once against an existing publisherhouse database that already
-- has the tables from schema.sql (each ALTER is run individually by
-- runMigration.js, which skips ER_DUP_FIELDNAME so re-runs are safe).

ALTER TABLE settings ADD COLUMN call_number VARCHAR(30) NULL AFTER logo;
ALTER TABLE settings ADD COLUMN whatsapp_number VARCHAR(30) NULL AFTER call_number;
ALTER TABLE settings ADD COLUMN about_text TEXT NULL AFTER whatsapp_number;

CREATE TABLE IF NOT EXISTS banners (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(190) NULL,
  description VARCHAR(500) NULL,
  image VARCHAR(255) NOT NULL,
  link_url VARCHAR(255) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  starts_at DATETIME NULL,
  ends_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  KEY idx_banners_active_sort (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
