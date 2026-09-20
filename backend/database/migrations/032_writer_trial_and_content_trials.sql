-- ---------------------------------------------------------------------------
-- writer_trial_settings (singleton config for the writer beginner-tier trial)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS writer_trial_settings (
  id TINYINT UNSIGNED PRIMARY KEY DEFAULT 1,
  is_enabled TINYINT(1) NOT NULL DEFAULT 1,
  duration_value SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  duration_unit ENUM('day','week','month') NOT NULL DEFAULT 'month',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_writer_trial_settings_singleton CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO writer_trial_settings (id, is_enabled, duration_value, duration_unit)
SELECT 1, 1, 1, 'month' WHERE NOT EXISTS (SELECT 1 FROM writer_trial_settings WHERE id = 1);

-- ---------------------------------------------------------------------------
-- content_trials (admin-created, category-scoped, free temporary access)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content_trials (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(190) NOT NULL,
  duration_value SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  duration_unit ENUM('day','week','month') NOT NULL DEFAULT 'week',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  KEY idx_content_trials_active (is_active, deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS content_trial_categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  trial_id INT UNSIGNED NOT NULL,
  category_type ENUM('blogs','studies') NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_content_trial_category (trial_id, category_type, category_id),
  CONSTRAINT fk_content_trial_categories_trial FOREIGN KEY (trial_id) REFERENCES content_trials (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS content_trial_redemptions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  trial_id INT UNSIGNED NOT NULL,
  subscriber_id INT UNSIGNED NOT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_content_trial_redemption (trial_id, subscriber_id),
  CONSTRAINT fk_content_trial_redemptions_trial FOREIGN KEY (trial_id) REFERENCES content_trials (id) ON DELETE CASCADE,
  CONSTRAINT fk_content_trial_redemptions_subscriber FOREIGN KEY (subscriber_id) REFERENCES subscribers (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS subscriber_category_access (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  subscriber_id INT UNSIGNED NOT NULL,
  category_type ENUM('blogs','studies') NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  source ENUM('subscription','trial') NOT NULL,
  source_id INT UNSIGNED NOT NULL COMMENT 'content_access_subscriptions.id or content_trial_redemptions.id, depending on source',
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_subscriber_category_access_lookup (subscriber_id, category_type, category_id, expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- content_subscription_plan_categories (narrow a paid plan to specific categories)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content_subscription_plan_categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  plan_id INT UNSIGNED NOT NULL,
  category_type ENUM('blogs','studies') NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_content_plan_category (plan_id, category_type, category_id),
  CONSTRAINT fk_content_plan_categories_plan FOREIGN KEY (plan_id) REFERENCES content_subscription_plans (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- banners.placement (homepage hero vs. subscription-offers strip)
-- ---------------------------------------------------------------------------
ALTER TABLE banners ADD COLUMN placement ENUM('hero','subscription_offers') NOT NULL DEFAULT 'hero' AFTER link_url;
