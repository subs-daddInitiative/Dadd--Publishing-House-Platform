-- ---------------------------------------------------------------------------
-- books.isbn — optional ISBN-10/ISBN-13, entered by the editor when the book
-- has one (never generated). Stored digits-only (plus a trailing X for ISBN-10).
-- ---------------------------------------------------------------------------
ALTER TABLE books ADD COLUMN isbn VARCHAR(13) NULL AFTER author;
