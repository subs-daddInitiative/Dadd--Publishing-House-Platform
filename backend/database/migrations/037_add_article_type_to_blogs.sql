-- ---------------------------------------------------------------------------
-- blogs.article_type — optional editorial type chosen from a fixed list
-- (news | analysis | opinion | interview | book_review). Stored as a key;
-- the label is translated by the frontend dictionaries.
-- ---------------------------------------------------------------------------
ALTER TABLE blogs ADD COLUMN article_type VARCHAR(20) NULL AFTER category_id;
