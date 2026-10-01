-- ---------------------------------------------------------------------------
-- studies.study_type — optional kind of study chosen from a fixed list
-- (analytical_study | report | policy_brief | research_paper). Stored as a
-- key, and the label is translated by the frontend dictionaries.
-- ---------------------------------------------------------------------------
ALTER TABLE studies ADD COLUMN study_type VARCHAR(30) NULL AFTER category_id;
