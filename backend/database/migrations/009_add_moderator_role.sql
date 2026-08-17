ALTER TABLE users
  MODIFY COLUMN role ENUM('admin', 'moderator') NOT NULL DEFAULT 'admin';
