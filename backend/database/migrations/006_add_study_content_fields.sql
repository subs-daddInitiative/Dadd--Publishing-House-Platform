ALTER TABLE studies
  ADD COLUMN main_image VARCHAR(255) NULL AFTER cover_image,
  ADD COLUMN content_intro LONGTEXT NULL AFTER description,
  ADD COLUMN content_body LONGTEXT NULL AFTER content_intro;
