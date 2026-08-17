ALTER TABLE subscribers
  ADD COLUMN account_type ENUM('reader', 'writer') NOT NULL DEFAULT 'reader' AFTER email;

CREATE TABLE IF NOT EXISTS writer_upgrade_requests (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  subscriber_id INT UNSIGNED NOT NULL,
  status ENUM('pending', 'invited', 'rejected') NOT NULL DEFAULT 'pending',
  reason TEXT NULL,
  decided_by INT UNSIGNED NULL,
  decided_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_writer_upgrade_subscriber FOREIGN KEY (subscriber_id) REFERENCES subscribers (id) ON DELETE CASCADE,
  CONSTRAINT fk_writer_upgrade_decided_by FOREIGN KEY (decided_by) REFERENCES users (id) ON DELETE SET NULL,
  KEY idx_writer_upgrade_subscriber (subscriber_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
