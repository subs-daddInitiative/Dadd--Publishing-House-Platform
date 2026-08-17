ALTER TABLE blogs
  ADD COLUMN content_blocks LONGTEXT NULL AFTER content,
  ADD COLUMN seo_keywords VARCHAR(500) NULL AFTER content_blocks;

UPDATE blogs
SET content_blocks = JSON_ARRAY(JSON_OBJECT('id', 'legacy', 'type', 'text', 'html', content))
WHERE content_blocks IS NULL AND content IS NOT NULL AND content <> '';
