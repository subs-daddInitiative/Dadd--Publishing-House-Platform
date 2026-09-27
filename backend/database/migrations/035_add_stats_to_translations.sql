-- ---------------------------------------------------------------------------
-- blog_translations.stats / study_translations.stats — the "numbers with
-- titles" strip is now translatable per locale, same hide-model as every
-- other translated field on these tables (no fallback to Arabic).
-- ---------------------------------------------------------------------------
ALTER TABLE blog_translations ADD COLUMN stats TEXT NULL AFTER content_blocks;
ALTER TABLE study_translations ADD COLUMN stats TEXT NULL AFTER content_blocks;
