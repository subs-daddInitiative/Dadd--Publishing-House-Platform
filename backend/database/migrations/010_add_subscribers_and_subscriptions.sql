CREATE TABLE IF NOT EXISTS subscribers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  current_tier ENUM('none', 'beginner', 'verified') NOT NULL DEFAULT 'none',
  tier_expires_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE KEY uq_subscribers_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS subscription_plans (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tier ENUM('beginner', 'verified') NOT NULL,
  billing_cycle ENUM('monthly', 'annual') NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  currency VARCHAR(6) NOT NULL DEFAULT 'SAR',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_plan_tier_cycle (tier, billing_cycle)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO subscription_plans (tier, billing_cycle, price, currency)
SELECT * FROM (
  SELECT 'beginner' AS tier, 'monthly' AS billing_cycle, 0 AS price, 'SAR' AS currency UNION ALL
  SELECT 'beginner', 'annual', 0, 'SAR' UNION ALL
  SELECT 'verified', 'monthly', 0, 'SAR' UNION ALL
  SELECT 'verified', 'annual', 0, 'SAR'
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM subscription_plans);

CREATE TABLE IF NOT EXISTS subscriptions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  subscriber_id INT UNSIGNED NOT NULL,
  plan_id INT UNSIGNED NOT NULL,
  status ENUM('pending', 'active', 'expired', 'cancelled', 'failed') NOT NULL DEFAULT 'pending',
  tap_charge_id VARCHAR(100) NULL,
  starts_at DATETIME NULL,
  ends_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_subscriptions_subscriber FOREIGN KEY (subscriber_id) REFERENCES subscribers (id) ON DELETE CASCADE,
  CONSTRAINT fk_subscriptions_plan FOREIGN KEY (plan_id) REFERENCES subscription_plans (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
