ALTER TABLE blogs
  ADD COLUMN is_premium TINYINT(1) NOT NULL DEFAULT 0 AFTER status;

ALTER TABLE studies
  ADD COLUMN is_premium TINYINT(1) NOT NULL DEFAULT 0 AFTER status,
  ADD COLUMN price DECIMAL(10, 2) NULL AFTER is_premium,
  ADD COLUMN currency VARCHAR(6) NOT NULL DEFAULT 'SAR' AFTER price;

ALTER TABLE subscribers
  ADD COLUMN blog_access_expires_at DATETIME NULL AFTER tier_expires_at,
  ADD COLUMN studies_access_expires_at DATETIME NULL AFTER blog_access_expires_at;

CREATE TABLE IF NOT EXISTS content_subscription_plans (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category ENUM('blogs', 'studies') NOT NULL,
  billing_cycle ENUM('monthly', 'annual') NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  currency VARCHAR(6) NOT NULL DEFAULT 'SAR',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_content_plan (category, billing_cycle)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO content_subscription_plans (category, billing_cycle, price, currency)
SELECT * FROM (
  SELECT 'blogs' AS category, 'monthly' AS billing_cycle, 0 AS price, 'SAR' AS currency UNION ALL
  SELECT 'blogs', 'annual', 0, 'SAR' UNION ALL
  SELECT 'studies', 'annual', 0, 'SAR'
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM content_subscription_plans);

CREATE TABLE IF NOT EXISTS content_access_subscriptions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  subscriber_id INT UNSIGNED NOT NULL,
  plan_id INT UNSIGNED NOT NULL,
  status ENUM('pending', 'active', 'expired', 'cancelled', 'failed') NOT NULL DEFAULT 'pending',
  tap_charge_id VARCHAR(100) NULL,
  starts_at DATETIME NULL,
  ends_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_content_access_subscriber FOREIGN KEY (subscriber_id) REFERENCES subscribers (id) ON DELETE CASCADE,
  CONSTRAINT fk_content_access_plan FOREIGN KEY (plan_id) REFERENCES content_subscription_plans (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS study_purchases (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  subscriber_id INT UNSIGNED NOT NULL,
  study_id INT UNSIGNED NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(6) NOT NULL DEFAULT 'SAR',
  status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  tap_charge_id VARCHAR(100) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_study_purchases_subscriber FOREIGN KEY (subscriber_id) REFERENCES subscribers (id) ON DELETE CASCADE,
  CONSTRAINT fk_study_purchases_study FOREIGN KEY (study_id) REFERENCES studies (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
