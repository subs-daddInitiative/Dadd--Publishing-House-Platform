-- ---------------------------------------------------------------------------
-- studies.report_number / studies.series_number — optional free-text numbers
-- for studies published as numbered reports or as part of a numbered series
-- (for example "2026/14" or "Series 3"). Display and structured data only.
-- ---------------------------------------------------------------------------
ALTER TABLE studies ADD COLUMN report_number VARCHAR(60) NULL AFTER doi;
ALTER TABLE studies ADD COLUMN series_number VARCHAR(60) NULL AFTER report_number;
