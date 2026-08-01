ALTER TABLE contact_messages
  ADD COLUMN subject ENUM('books', 'studies', 'blogs', 'issues') NOT NULL DEFAULT 'issues' AFTER phone;
