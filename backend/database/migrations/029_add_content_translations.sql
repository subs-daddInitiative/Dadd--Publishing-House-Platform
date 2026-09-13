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
