ALTER TABLE blogs
  ADD COLUMN is_highlighted TINYINT(1) NOT NULL DEFAULT 0 AFTER is_premium,
  ADD COLUMN highlighted_until DATETIME NULL AFTER is_highlighted;

ALTER TABLE studies
  ADD COLUMN is_highlighted TINYINT(1) NOT NULL DEFAULT 0 AFTER is_premium,
  ADD COLUMN highlighted_until DATETIME NULL AFTER is_highlighted;
