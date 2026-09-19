CREATE TABLE IF NOT EXISTS about_feature_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  feature_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  title VARCHAR(190) NOT NULL,
  description VARCHAR(500) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_about_feature_translations (feature_id, locale),
  CONSTRAINT fk_about_feature_translations_feature
    FOREIGN KEY (feature_id) REFERENCES about_features (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS news_ticker_item_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  item_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  message VARCHAR(500) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_news_ticker_item_translations (item_id, locale),
  CONSTRAINT fk_news_ticker_item_translations_item
    FOREIGN KEY (item_id) REFERENCES news_ticker_items (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS book_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  book_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  title VARCHAR(255) NULL,
  author VARCHAR(190) NULL,
  description TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_book_translations (book_id, locale),
  CONSTRAINT fk_book_translations_book
    FOREIGN KEY (book_id) REFERENCES books (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS books_categories_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_books_categories_translations (category_id, locale),
  CONSTRAINT fk_books_categories_translations_category
    FOREIGN KEY (category_id) REFERENCES books_categories (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blogs_categories_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_blogs_categories_translations (category_id, locale),
  CONSTRAINT fk_blogs_categories_translations_category
    FOREIGN KEY (category_id) REFERENCES blogs_categories (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS studies_categories_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_studies_categories_translations (category_id, locale),
  CONSTRAINT fk_studies_categories_translations_category
    FOREIGN KEY (category_id) REFERENCES studies_categories (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
