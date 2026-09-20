-- ---------------------------------------------------------------------------
-- content_trials.content_type (a trial belongs to either blogs or studies,
-- never both, so admins manage blog trials and study trials separately)
-- ---------------------------------------------------------------------------
ALTER TABLE content_trials ADD COLUMN content_type ENUM('blogs', 'studies') NOT NULL DEFAULT 'blogs' AFTER name;

UPDATE content_trials t
SET content_type = COALESCE(
  (SELECT category_type FROM content_trial_categories WHERE trial_id = t.id LIMIT 1),
  'blogs'
);
