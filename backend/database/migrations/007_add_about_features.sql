CREATE TABLE IF NOT EXISTS about_features (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(20) NULL,
  title VARCHAR(190) NOT NULL,
  description VARCHAR(500) NULL,
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  KEY idx_about_features_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO about_features (icon, title, description, sort_order)
SELECT '📚', 'إثراء المحتوى العربي', 'نقدّم محتوى فكريًا وعلميًا هادفًا ومتميزًا للصالح العام، ونشجّع ثقافة القراءة والكتابة.', 0
WHERE NOT EXISTS (SELECT 1 FROM about_features);

INSERT INTO about_features (icon, title, description, sort_order)
SELECT '✍️', 'دعم الكتّاب الجدد', 'نعمل على اكتشاف المواهب الأدبية الناشئة ودعمها من الفكرة إلى الصفحة المطبوعة.', 1
WHERE (SELECT COUNT(*) FROM about_features) < 2;

INSERT INTO about_features (icon, title, description, sort_order)
SELECT '🌟', 'التميز والجودة', 'نلتزم بأعلى معايير الجودة في التحرير والتصميم والطباعة في كل إصدار ننشره.', 2
WHERE (SELECT COUNT(*) FROM about_features) < 3;
