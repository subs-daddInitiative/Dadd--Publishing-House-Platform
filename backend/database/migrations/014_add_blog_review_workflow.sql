ALTER TABLE blogs
  ADD COLUMN submitted_by_subscriber_id INT UNSIGNED NULL AFTER author_id,
  ADD COLUMN review_status ENUM('none', 'pending', 'approved', 'rejected') NOT NULL DEFAULT 'none' AFTER status,
  ADD COLUMN review_reason TEXT NULL AFTER review_status,
  ADD COLUMN reviewed_by INT UNSIGNED NULL AFTER review_reason,
  ADD COLUMN reviewed_at DATETIME NULL AFTER reviewed_by,
  ADD CONSTRAINT fk_blogs_submitted_by FOREIGN KEY (submitted_by_subscriber_id) REFERENCES subscribers (id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_blogs_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES users (id) ON DELETE SET NULL,
  ADD KEY idx_blogs_review_status (review_status);
