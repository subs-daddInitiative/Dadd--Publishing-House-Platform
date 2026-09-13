-- Publishing House Platform - Initial Schema
-- Database: publisherhouse
-- Run this in phpMyAdmin (select the `publisherhouse` database, then SQL tab)

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------------
-- users (admin accounts only for now, future-ready for public accounts)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'moderator') NOT NULL DEFAULT 'admin',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- books_categories
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS books_categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(180) NOT NULL,
  description TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE KEY uq_books_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- book_pricing_tiers (admin-editable reusable price tiers: econ / pro / extra)
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- books
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS books (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(280) NOT NULL,
  author VARCHAR(190) NULL,
  description TEXT NULL,
  price DECIMAL(10,2) NULL,
  pricing_tier_id INT UNSIGNED NULL,
  currency VARCHAR(6) NOT NULL DEFAULT 'USD',
  rating DECIMAL(2,1) NULL,
  reviews_count INT UNSIGNED NOT NULL DEFAULT 0,
  cover_image VARCHAR(255) NULL,
  pdf_file VARCHAR(255) NULL,
  status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  published_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE KEY uq_books_slug (slug),
  KEY idx_books_status (status),
  CONSTRAINT fk_books_category
    FOREIGN KEY (category_id) REFERENCES books_categories (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_books_pricing_tier
    FOREIGN KEY (pricing_tier_id) REFERENCES book_pricing_tiers (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- book_external_links (external purchase links, e.g. other marketplaces)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS book_external_links (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  book_id INT UNSIGNED NOT NULL,
  label VARCHAR(100) NOT NULL,
  url VARCHAR(255) NOT NULL,
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_book_external_links_book FOREIGN KEY (book_id) REFERENCES books (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- studies_categories
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS studies_categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(180) NOT NULL,
  description TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE KEY uq_studies_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- studies
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS studies (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(280) NOT NULL,
  author VARCHAR(190) NULL,
  description TEXT NULL,
  content_intro LONGTEXT NULL,
  content_body LONGTEXT NULL,
  content_blocks LONGTEXT NULL,
  cover_image VARCHAR(255) NULL,
  main_image VARCHAR(255) NULL,
  pdf_file VARCHAR(255) NULL,
  status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  is_premium TINYINT(1) NOT NULL DEFAULT 0,
  is_highlighted TINYINT(1) NOT NULL DEFAULT 0,
  highlighted_until DATETIME NULL,
  price DECIMAL(10, 2) NULL,
  currency VARCHAR(6) NOT NULL DEFAULT 'USD',
  published_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE KEY uq_studies_slug (slug),
  KEY idx_studies_status (status),
  CONSTRAINT fk_studies_category
    FOREIGN KEY (category_id) REFERENCES studies_categories (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- blogs_categories
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blogs_categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(180) NOT NULL,
  description TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE KEY uq_blogs_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- blogs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blogs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NULL,
  author_id INT UNSIGNED NULL,
  submitted_by_subscriber_id INT UNSIGNED NULL,
  author_name VARCHAR(190) NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(280) NOT NULL,
  excerpt VARCHAR(500) NULL,
  content LONGTEXT NULL,
  content_blocks LONGTEXT NULL,
  seo_keywords VARCHAR(500) NULL,
  cover_image VARCHAR(255) NULL,
  status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  review_status ENUM('none', 'pending', 'approved', 'rejected') NOT NULL DEFAULT 'none',
  review_reason TEXT NULL,
  reviewed_by INT UNSIGNED NULL,
  reviewed_at DATETIME NULL,
  is_premium TINYINT(1) NOT NULL DEFAULT 0,
  is_highlighted TINYINT(1) NOT NULL DEFAULT 0,
  highlighted_until DATETIME NULL,
  published_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE KEY uq_blogs_slug (slug),
  KEY idx_blogs_status (status),
  KEY idx_blogs_review_status (review_status),
  CONSTRAINT fk_blogs_category
    FOREIGN KEY (category_id) REFERENCES blogs_categories (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_blogs_author
    FOREIGN KEY (author_id) REFERENCES users (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_blogs_submitted_by
    FOREIGN KEY (submitted_by_subscriber_id) REFERENCES subscribers (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_blogs_reviewed_by
    FOREIGN KEY (reviewed_by) REFERENCES users (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- about_features (homepage "About" section pillar cards, admin-managed)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS about_features (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(20) NULL,
  title VARCHAR(190) NOT NULL,
  description VARCHAR(500) NULL,
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  KEY idx_about_features_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- settings (singleton row: site identity + SEO defaults)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  site_name VARCHAR(190) NOT NULL DEFAULT 'دار النشر',
  logo VARCHAR(255) NULL,
  call_number VARCHAR(30) NULL,
  whatsapp_number VARCHAR(30) NULL,
  about_text TEXT NULL,
  seo_default_title VARCHAR(190) NULL,
  seo_default_description VARCHAR(500) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ensure exactly one settings row exists
INSERT INTO settings (id, site_name)
SELECT 1, 'دار النشر'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE id = 1);

-- ---------------------------------------------------------------------------
-- social_links (one-to-many: settings -> social platforms)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS social_links (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  settings_id INT UNSIGNED NOT NULL DEFAULT 1,
  platform VARCHAR(50) NOT NULL,
  url VARCHAR(255) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_social_links_platform (settings_id, platform),
  CONSTRAINT fk_social_links_settings
    FOREIGN KEY (settings_id) REFERENCES settings (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- banners (home page hero/announcement banners, admin-managed)
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- site_ads (site-wide popup ads/announcements, targetable by audience, queued)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_ads (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(190) NOT NULL,
  message VARCHAR(500) NULL,
  image VARCHAR(255) NULL,
  link_url VARCHAR(255) NULL,
  link_label VARCHAR(100) NULL,
  target ENUM('all', 'guest', 'reader', 'writer') NOT NULL DEFAULT 'all',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  starts_at DATETIME NULL,
  ends_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- site_ad_translations (English/German copy; an ad only shows to visitors in
-- a non-Arabic locale once a matching row exists here)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_ad_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ad_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  title VARCHAR(190) NOT NULL,
  message VARCHAR(500) NULL,
  link_label VARCHAR(100) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_site_ad_translations_ad_locale (ad_id, locale),
  CONSTRAINT fk_site_ad_translations_ad
    FOREIGN KEY (ad_id) REFERENCES site_ads (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- news_ticker_items (scrolling top-bar announcements, targetable by audience)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS news_ticker_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  message VARCHAR(500) NOT NULL,
  target ENUM('all', 'reader', 'writer') NOT NULL DEFAULT 'all',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- contact_messages (submissions from the public contact form)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(30) NULL,
  subject ENUM('books', 'studies', 'blogs', 'issues') NOT NULL DEFAULT 'issues',
  message TEXT NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  KEY idx_contact_messages_is_read (is_read),
  KEY idx_contact_messages_subject (subject)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- join_requests (volunteer/institution join applications, complaints & suggestions)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS join_requests (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  request_type ENUM('volunteer', 'complaint', 'suggestion') NOT NULL DEFAULT 'volunteer',
  participation_type ENUM('individual', 'institution') NULL,
  institution_name VARCHAR(190) NULL,
  institution_type VARCHAR(100) NULL,
  institution_website VARCHAR(255) NULL,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(30) NULL,
  location VARCHAR(150) NULL,
  interest_areas TEXT NULL,
  message TEXT NULL,
  newsletter_opt_in TINYINT(1) NOT NULL DEFAULT 0,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  KEY idx_join_requests_is_read (is_read),
  KEY idx_join_requests_type (request_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- subscribers (public writer accounts, separate from admin/moderator users)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscribers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  bio TEXT NULL,
  profile_image VARCHAR(255) NULL,
  email VARCHAR(190) NOT NULL,
  account_type ENUM('reader', 'writer') NOT NULL DEFAULT 'reader',
  password_hash VARCHAR(255) NOT NULL,
  current_tier ENUM('none', 'beginner', 'verified') NOT NULL DEFAULT 'none',
  tier_expires_at DATETIME NULL,
  blog_access_expires_at DATETIME NULL,
  studies_access_expires_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE KEY uq_subscribers_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- favorites (a subscriber's saved blogs / studies)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS favorites (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  subscriber_id INT UNSIGNED NOT NULL,
  item_type ENUM('blog', 'study') NOT NULL,
  item_id INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_favorite (subscriber_id, item_type, item_id),
  CONSTRAINT fk_favorites_subscriber FOREIGN KEY (subscriber_id) REFERENCES subscribers (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- newsletter_signups (emails collected from the "notify me" popup on blogs)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS newsletter_signups (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) NOT NULL,
  category_slug VARCHAR(280) NULL,
  category_name VARCHAR(190) NULL,
  blog_slug VARCHAR(280) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_newsletter_signup (email, category_slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- subscription_plans (admin-editable prices for the two writer tiers)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscription_plans (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tier ENUM('beginner', 'verified') NOT NULL,
  billing_cycle ENUM('monthly', 'annual') NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  currency VARCHAR(6) NOT NULL DEFAULT 'USD',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_plan_tier_cycle (tier, billing_cycle)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO subscription_plans (tier, billing_cycle, price, currency)
SELECT * FROM (
  SELECT 'beginner' AS tier, 'monthly' AS billing_cycle, 0 AS price, 'USD' AS currency UNION ALL
  SELECT 'beginner', 'annual', 0, 'USD' UNION ALL
  SELECT 'verified', 'monthly', 0, 'USD' UNION ALL
  SELECT 'verified', 'annual', 0, 'USD'
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM subscription_plans);

-- ---------------------------------------------------------------------------
-- subscriptions (billing history / TAP charge tracking per subscriber)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscriptions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  subscriber_id INT UNSIGNED NOT NULL,
  plan_id INT UNSIGNED NOT NULL,
  status ENUM('pending', 'active', 'expired', 'cancelled', 'failed') NOT NULL DEFAULT 'pending',
  tap_charge_id VARCHAR(100) NULL,
  payment_provider ENUM('tap', 'paypal') NOT NULL DEFAULT 'tap',
  paypal_order_id VARCHAR(64) NULL,
  starts_at DATETIME NULL,
  ends_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_subscriptions_subscriber FOREIGN KEY (subscriber_id) REFERENCES subscribers (id) ON DELETE CASCADE,
  CONSTRAINT fk_subscriptions_plan FOREIGN KEY (plan_id) REFERENCES subscription_plans (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- content_subscription_plans (admin-editable prices for premium blogs/studies access)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content_subscription_plans (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category ENUM('blogs', 'studies') NOT NULL,
  billing_cycle ENUM('monthly', 'annual') NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  currency VARCHAR(6) NOT NULL DEFAULT 'USD',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_content_plan (category, billing_cycle)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO content_subscription_plans (category, billing_cycle, price, currency)
SELECT * FROM (
  SELECT 'blogs' AS category, 'monthly' AS billing_cycle, 0 AS price, 'USD' AS currency UNION ALL
  SELECT 'blogs', 'annual', 0, 'USD' UNION ALL
  SELECT 'studies', 'annual', 0, 'USD'
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM content_subscription_plans);

-- ---------------------------------------------------------------------------
-- content_access_subscriptions (billing history for premium blogs/studies access)
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- study_purchases (one-time per-study purchases)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS study_purchases (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  subscriber_id INT UNSIGNED NOT NULL,
  study_id INT UNSIGNED NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(6) NOT NULL DEFAULT 'USD',
  status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  tap_charge_id VARCHAR(100) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_study_purchases_subscriber FOREIGN KEY (subscriber_id) REFERENCES subscribers (id) ON DELETE CASCADE,
  CONSTRAINT fk_study_purchases_study FOREIGN KEY (study_id) REFERENCES studies (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- writer_upgrade_requests (writer requests to move from beginner to verified)
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- blog_translations / study_translations (English/German content; a blog or
-- study only appears on the site in a given non-Arabic locale once a row
-- exists here for it)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  blog_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(280) NOT NULL,
  excerpt VARCHAR(500) NULL,
  content_blocks LONGTEXT NULL,
  seo_keywords VARCHAR(500) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_blog_translations_blog_locale (blog_id, locale),
  UNIQUE KEY uq_blog_translations_locale_slug (locale, slug),
  CONSTRAINT fk_blog_translations_blog
    FOREIGN KEY (blog_id) REFERENCES blogs (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS study_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  study_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(280) NOT NULL,
  description VARCHAR(500) NULL,
  content_blocks LONGTEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_study_translations_study_locale (study_id, locale),
  UNIQUE KEY uq_study_translations_locale_slug (locale, slug),
  CONSTRAINT fk_study_translations_study
    FOREIGN KEY (study_id) REFERENCES studies (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
