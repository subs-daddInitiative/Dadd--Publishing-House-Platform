-- ---------------------------------------------------------------------------
-- blogs.stats / studies.stats — up to 6 admin-entered "number + title" pairs
-- shown as a stats strip near the header of a post (e.g. "500 مشارك").
-- Optional: an empty/absent value means the section doesn't render at all.
-- ---------------------------------------------------------------------------
ALTER TABLE blogs ADD COLUMN stats TEXT NULL AFTER content_blocks;
ALTER TABLE studies ADD COLUMN stats TEXT NULL AFTER content_blocks;
