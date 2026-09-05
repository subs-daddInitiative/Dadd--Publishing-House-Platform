ALTER TABLE site_ads
  ADD COLUMN starts_at DATETIME NULL AFTER sort_order,
  ADD COLUMN ends_at DATETIME NULL AFTER starts_at;
