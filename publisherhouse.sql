-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 19, 2026 at 07:21 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `publisherhouse`
--

-- --------------------------------------------------------

--
-- Table structure for table `about_features`
--

CREATE TABLE `about_features` (
  `id` int UNSIGNED NOT NULL,
  `icon` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` smallint UNSIGNED NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `about_features`
--

INSERT INTO `about_features` (`id`, `icon`, `title`, `description`, `sort_order`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '📚', 'إثراء المحتوى العربي', 'نقدّم محتوى فكريًا وعلميًا هادفًا ومتميزًا للصالح العام، ونشجّع ثقافة القراءة والكتابة.', 0, '2026-08-08 13:11:56', '2026-08-08 13:11:56', NULL),
(2, '✍️', 'دعم الكتّاب الجدد', 'نعمل على اكتشاف المواهب الأدبية الناشئة ودعمها من الفكرة إلى الصفحة المطبوعة.', 1, '2026-08-08 13:11:56', '2026-08-08 13:11:56', NULL),
(3, '🌟', 'التميز والجودة', 'نلتزم بأعلى معايير الجودة في التحرير والتصميم والطباعة في كل إصدار ننشره.', 2, '2026-08-08 13:11:56', '2026-08-08 13:11:56', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `about_feature_translations`
--

CREATE TABLE `about_feature_translations` (
  `id` int UNSIGNED NOT NULL,
  `feature_id` int UNSIGNED NOT NULL,
  `locale` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `about_feature_translations`
--

INSERT INTO `about_feature_translations` (`id`, `feature_id`, `locale`, `title`, `description`, `created_at`, `updated_at`) VALUES
(2, 1, 'en', 'Enriching Arabic Content', 'We produce purposeful, distinguished intellectual and scholarly content for the public good, and champion a culture of reading and writing.', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(3, 1, 'de', 'Bereicherung arabischer Inhalte', 'Wir schaffen zielgerichtete, herausragende intellektuelle und wissenschaftliche Inhalte zum Nutzen der Allgemeinheit und fördern eine Kultur des Lesens und Schreibens.', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(4, 2, 'en', 'Supporting New Writers', 'We discover emerging literary talent and support it from first idea to printed page.', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(5, 2, 'de', 'Förderung neuer Autoren', 'Wir entdecken aufstrebende literarische Talente und begleiten sie von der ersten Idee bis zur gedruckten Seite.', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(6, 3, 'en', 'Excellence & Quality', 'We uphold the highest standards of editing, design, and printing in every title we publish.', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(7, 3, 'de', 'Exzellenz und Qualität', 'Wir halten in jedem von uns veröffentlichten Titel die höchsten Standards bei Lektorat, Gestaltung und Druck ein.', '2026-09-19 19:47:04', '2026-09-19 19:47:04');

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` int UNSIGNED NOT NULL,
  `title` varchar(190) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `link_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` smallint UNSIGNED NOT NULL DEFAULT '0',
  `starts_at` datetime DEFAULT NULL,
  `ends_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `title`, `description`, `image`, `link_url`, `is_active`, `sort_order`, `starts_at`, `ends_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Launch Event', NULL, '/uploads/banners/f440c235-a99f-41ee-adfe-f8863fd7b3f1.png', NULL, 1, 1, NULL, NULL, '2026-07-27 06:12:10', '2026-07-27 06:12:34', '2026-07-27 06:12:34'),
(2, '?????? ??????', NULL, '/uploads/banners/697bfed6-cc6b-4d44-af50-fdec824f51db.png', NULL, 1, 1, NULL, NULL, '2026-07-27 06:24:02', '2026-07-27 06:25:02', '2026-07-27 06:25:02'),
(3, 'عنوان البانر الاول', NULL, '/uploads/banners/4211f351-41b4-40bc-99bf-0401412ab644.webp', NULL, 1, 0, NULL, NULL, '2026-07-27 17:27:52', '2026-07-27 17:27:52', NULL),
(4, 'عنوان البانر التاني', NULL, '/uploads/banners/ed0ae206-4f12-455d-9f46-0f1ffa59567a.jpg', NULL, 1, 0, NULL, NULL, '2026-07-27 17:28:04', '2026-07-27 17:28:04', NULL),
(5, 'فعالية توقيع كتاب', NULL, '/uploads/banners/2a7b35ec-d05a-48cd-bf56-41a31f6bbe3f.png', NULL, 1, 0, NULL, NULL, '2026-07-27 17:40:03', '2026-07-27 17:40:27', '2026-07-27 17:40:27'),
(6, 'إصدار جديد', NULL, '/uploads/banners/168ca570-7e12-466d-8e97-9178cf7ad0c9.png', NULL, 1, 0, NULL, NULL, '2026-07-27 17:40:03', '2026-07-27 17:40:27', '2026-07-27 17:40:27');

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int UNSIGNED NOT NULL,
  `category_id` int UNSIGNED DEFAULT NULL,
  `author_id` int UNSIGNED DEFAULT NULL,
  `submitted_by_subscriber_id` int UNSIGNED DEFAULT NULL,
  `author_name` varchar(190) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(280) COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `content_blocks` longtext COLLATE utf8mb4_unicode_ci,
  `seo_keywords` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cover_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('draft','published') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `review_status` enum('none','pending','approved','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'none',
  `review_reason` text COLLATE utf8mb4_unicode_ci,
  `reviewed_by` int UNSIGNED DEFAULT NULL,
  `reviewed_at` datetime DEFAULT NULL,
  `is_premium` tinyint(1) NOT NULL DEFAULT '0',
  `is_highlighted` tinyint(1) NOT NULL DEFAULT '0',
  `highlighted_until` datetime DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `category_id`, `author_id`, `submitted_by_subscriber_id`, `author_name`, `title`, `slug`, `excerpt`, `content`, `content_blocks`, `seo_keywords`, `cover_image`, `status`, `review_status`, `review_reason`, `reviewed_by`, `reviewed_at`, `is_premium`, `is_highlighted`, `highlighted_until`, `published_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, NULL, 1, NULL, 'دار النشر', 'مقالة رقم 1', 'blog1', 'مقتطف قصير من مقالة  رقم 1', 'محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 ', '[{\"id\": \"legacy\", \"html\": \"محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 محتوى المقالة 1 \", \"type\": \"text\"}]', NULL, '/uploads/blogs/8a314133-52a3-41be-bd37-665d2ab8bce8.jpg', 'published', 'none', NULL, NULL, NULL, 0, 0, NULL, '2026-08-01 09:03:54', '2026-08-01 09:03:53', '2026-08-14 00:26:26', NULL),
(2, NULL, 1, NULL, 'دار النشر', '????? ??????? ?? ????? ???????', 'post', '??? ???? ??????? ??????? ?? ???? ????? ??????? ??????.', '<p>??????? ???? ???? ????? ???????? ?? ?? ???? ?????? ????? ??????? ?????? ???????.</p><p>?? ???? ??????? ????????? ????? ??????? ?????? ?????? ????? ???? ??? ??????? ???????? ??????.</p>', '[{\"id\": \"legacy\", \"html\": \"<p>??????? ???? ???? ????? ???????? ?? ?? ???? ?????? ????? ??????? ?????? ???????.</p><p>?? ???? ??????? ????????? ????? ??????? ?????? ?????? ????? ???? ??? ??????? ???????? ??????.</p>\", \"type\": \"text\"}]', NULL, NULL, 'published', 'none', NULL, NULL, NULL, 0, 0, NULL, '2026-08-08 12:58:30', '2026-08-08 12:58:30', '2026-08-14 00:26:26', '2026-08-08 20:42:03'),
(3, NULL, 1, NULL, 'دار النشر', '??? ????? ??? ???? ?????', 'post-2', '????? ????? ????? ?????? ??????? ??? ????? ?????? ?????????.', '<p>??????? ????? ????? ????????? ????????? ????? ??? ??????? ???? ???? ?? ????? ?? ??? ??????.</p><p>?? ??? ??? ???????: ??????? ???????? ???????? ?????? ???? ????????? ?? ???????.</p>', '[{\"id\": \"legacy\", \"html\": \"<p>??????? ????? ????? ????????? ????????? ????? ??? ??????? ???? ???? ?? ????? ?? ??? ??????.</p><p>?? ??? ??? ???????: ??????? ???????? ???????? ?????? ???? ????????? ?? ???????.</p>\", \"type\": \"text\"}]', NULL, NULL, 'published', 'none', NULL, NULL, NULL, 0, 0, NULL, '2026-08-08 12:58:30', '2026-08-08 12:58:30', '2026-08-14 00:26:26', '2026-08-08 20:42:03'),
(4, NULL, 1, NULL, 'دار النشر', '??? ????? ????? ???????', 'post-3', '???? ????? ??????? ?????? ??????? ??? ????????? ???????.', '<p>?????? ?????? ??????? ?? ???? ?????? ??? ???? ?????? ?? ????????? ???????.</p><p>???? ?????? ?? ????????? ???????? ?? ?????? ???????? ??? ?????? ?????.</p>', '[{\"id\": \"legacy\", \"html\": \"<p>?????? ?????? ??????? ?? ???? ?????? ??? ???? ?????? ?? ????????? ???????.</p><p>???? ?????? ?? ????????? ???????? ?? ?????? ???????? ??? ?????? ?????.</p>\", \"type\": \"text\"}]', NULL, NULL, 'published', 'none', NULL, NULL, NULL, 0, 0, NULL, '2026-08-08 12:58:31', '2026-08-08 12:58:30', '2026-08-14 00:26:26', '2026-08-08 20:42:03'),
(5, NULL, 1, NULL, 'دار النشر', '???? ??? ????? ?????', 'post-4', '????? ????? ?? ?????? ??? ?????? ???????.', '<p>??? ??? ???? ?? ??? ????? ?????? ?? ???????? ???? ????? ????? ???????? ?????.</p><p>???? ?????? ?????? ??????? ?? ???????? ????????? ??????? ??????? ????????.</p>', '[{\"id\": \"legacy\", \"html\": \"<p>??? ??? ???? ?? ??? ????? ?????? ?? ???????? ???? ????? ????? ???????? ?????.</p><p>???? ?????? ?????? ??????? ?? ???????? ????????? ??????? ??????? ????????.</p>\", \"type\": \"text\"}]', NULL, NULL, 'published', 'none', NULL, NULL, NULL, 0, 0, NULL, '2026-08-08 12:58:31', '2026-08-08 12:58:30', '2026-08-14 00:26:26', '2026-08-08 20:42:03'),
(6, NULL, 1, NULL, 'دار النشر', '????? ?????? ?? ????? ??????', 'post-5', '??? ????? ??????? ??????? ?? ??? ??????? ???????.', '<p>??? ????? ?????? ?????? ????? ?? ?????? ??????? ??????? ?????? ????? ???????.</p><p>???? ?????? ??????? ?????? ??? ????? ????? ??? ??? ???? ?????? ????? ????? ??????? ???????.</p>', '[{\"id\": \"legacy\", \"html\": \"<p>??? ????? ?????? ?????? ????? ?? ?????? ??????? ??????? ?????? ????? ???????.</p><p>???? ?????? ??????? ?????? ??? ????? ????? ??? ??? ???? ?????? ????? ????? ??????? ???????.</p>\", \"type\": \"text\"}]', NULL, NULL, 'published', 'none', NULL, NULL, NULL, 0, 0, NULL, '2026-08-08 12:58:31', '2026-08-08 12:58:30', '2026-08-14 00:26:26', '2026-08-08 20:42:03'),
(7, NULL, 1, NULL, 'دار النشر', 'أهمية القراءة في تكوين الشخصية', 'أهمية-القراءة-في-تكوين-الشخصية', 'كيف تسهم القراءة اليومية في بناء شخصية متوازنة وواعية.', '<p>القراءة ليست مجرد وسيلة للترفيه، بل هي أداة أساسية لبناء الشخصية وتوسيع المدارك.</p><p>من خلال القراءة المنتظمة، يكتسب الإنسان مفردات جديدة، وقدرة أكبر على التحليل والتفكير النقدي.</p>', '[{\"id\":\"legacy\",\"type\":\"text\",\"html\":\"<p>القراءة ليست مجرد وسيلة للترفيه، بل هي أداة أساسية لبناء الشخصية وتوسيع المدارك.</p><p>من خلال القراءة المنتظمة، يكتسب الإنسان مفردات جديدة، وقدرة أكبر على التحليل والتفكير النقدي.</p>\"},{\"id\":\"block-1787061581533-vtla70\",\"type\":\"image_text\",\"url\":\"/uploads/blogs-blocks/images/394c50a4-4c84-404b-a714-20c173f8c76f.png\",\"alt\":\"صورة ونص\",\"html\":\"صورة ونص داخل المقالة\",\"layout\":\"image-right\"},{\"id\":\"block-1787061792633-a3y4r9\",\"type\":\"quote\",\"text\":\"اقتباس جيد جدا\",\"author\":\"احمد\"}]', '', '/uploads/blogs/3b455781-7db1-4cd5-bf1d-6f39ef92b817.png', 'published', 'none', NULL, NULL, NULL, 1, 0, NULL, '2026-08-08 21:20:12', '2026-08-08 21:20:12', '2026-08-18 17:03:25', NULL),
(8, NULL, 1, NULL, 'دار النشر', 'خمس عادات لكل كاتب مبتدئ', 'خمس-عادات-لكل-كاتب-مبتدئ', 'نصائح عملية تساعد الكاتب المبتدئ على تطوير أسلوبه وإنتاجيته.', '<p>الكتابة مهارة تُصقل بالممارسة المستمرة، وهناك بعض العادات التي يمكن أن تسرّع من هذا التطور.</p><p>من أهم هذه العادات: القراءة اليومية، والكتابة الحرة، وطلب الملاحظات من الآخرين.</p>', '[{\"id\": \"legacy\", \"html\": \"<p>الكتابة مهارة تُصقل بالممارسة المستمرة، وهناك بعض العادات التي يمكن أن تسرّع من هذا التطور.</p><p>من أهم هذه العادات: القراءة اليومية، والكتابة الحرة، وطلب الملاحظات من الآخرين.</p>\", \"type\": \"text\"}]', NULL, NULL, 'published', 'none', NULL, NULL, NULL, 0, 0, NULL, '2026-08-08 21:20:12', '2026-08-08 21:20:12', '2026-08-14 00:26:26', NULL),
(9, NULL, 1, NULL, 'دار النشر', 'كيف تختار كتابك القادم؟', 'كيف-تختار-كتابك-القادم', 'دليل مختصر لاختيار الكتاب المناسب وفق اهتماماتك وأهدافك.', '<p>اختيار الكتاب المناسب قد يكون تحديًا وسط الكم الهائل من الإصدارات المتاحة.</p><p>ننصح بالبدء من اهتماماتك الشخصية، ثم التوسع تدريجيًا نحو مواضيع جديدة.</p>', '[{\"id\": \"legacy\", \"html\": \"<p>اختيار الكتاب المناسب قد يكون تحديًا وسط الكم الهائل من الإصدارات المتاحة.</p><p>ننصح بالبدء من اهتماماتك الشخصية، ثم التوسع تدريجيًا نحو مواضيع جديدة.</p>\", \"type\": \"text\"}]', NULL, NULL, 'published', 'none', NULL, NULL, NULL, 0, 0, NULL, '2026-08-08 21:20:12', '2026-08-08 21:20:12', '2026-08-14 00:26:26', NULL),
(10, NULL, 1, NULL, 'دار النشر', 'رحلة نشر كتابك الأول', 'رحلة-نشر-كتابك-الأول', 'خطوات عملية من الفكرة إلى الكتاب المطبوع.', '<p>نشر أول كتاب هو حلم يراود كثيرًا من الكتّاب، لكنه يتطلب صبرًا وتخطيطًا جيدًا.</p><p>تبدأ الرحلة بصياغة الفكرة، ثم التحرير، فالتصميم، وأخيرًا الطباعة والتوزيع.</p>', '[{\"id\": \"legacy\", \"html\": \"<p>نشر أول كتاب هو حلم يراود كثيرًا من الكتّاب، لكنه يتطلب صبرًا وتخطيطًا جيدًا.</p><p>تبدأ الرحلة بصياغة الفكرة، ثم التحرير، فالتصميم، وأخيرًا الطباعة والتوزيع.</p>\", \"type\": \"text\"}]', NULL, NULL, 'published', 'none', NULL, NULL, NULL, 0, 0, NULL, '2026-08-08 21:20:12', '2026-08-08 21:20:12', '2026-08-14 00:26:26', NULL),
(11, NULL, 1, NULL, 'دار النشر', 'الأدب العربي في العصر الرقمي', 'الأدب-العربي-في-العصر-الرقمي', 'كيف تتكيف الكتابة العربية مع عصر المنصات الرقمية.', '<p>شهد الأدب العربي تحولات كبيرة مع انتشار المنصات الرقمية ووسائل النشر الحديثة.</p><p>أصبح بإمكان الكتّاب الوصول إلى جمهور أوسع، لكن ذلك يفرض تحديات جديدة تتعلق بالجودة والتميز.</p>', '[{\"id\": \"legacy\", \"html\": \"<p>شهد الأدب العربي تحولات كبيرة مع انتشار المنصات الرقمية ووسائل النشر الحديثة.</p><p>أصبح بإمكان الكتّاب الوصول إلى جمهور أوسع، لكن ذلك يفرض تحديات جديدة تتعلق بالجودة والتميز.</p>\", \"type\": \"text\"}]', NULL, NULL, 'published', 'none', NULL, NULL, NULL, 0, 0, NULL, '2026-08-08 21:20:12', '2026-08-08 21:20:12', '2026-08-14 00:26:26', NULL),
(12, NULL, 1, NULL, 'دار النشر', 'مقال مميز للتجربة', 'مقال-مميز-للتجربة', NULL, NULL, NULL, NULL, NULL, 'published', 'none', NULL, NULL, NULL, 1, 0, NULL, '2026-08-13 15:36:05', '2026-08-13 15:36:05', '2026-08-13 15:36:06', '2026-08-13 15:36:06'),
(13, NULL, 1, NULL, 'دار النشر', 'مقال بأقسام متعددة', 'مقال-بأقسام-متعددة', NULL, NULL, '[{\"id\":\"b1\",\"type\":\"text\",\"html\":\"<p>مرحبا بكم في هذا المقال</p>\"},{\"id\":\"b2\",\"type\":\"image\",\"url\":\"/uploads/blogs-blocks/images/5d94b5b0-030b-432a-adb9-54d08114a103.png\",\"alt\":\"صورة تجريبية\",\"caption\":\"تعليق\"},{\"id\":\"b3\",\"type\":\"quote\",\"text\":\"هذا اقتباس تجريبي\",\"author\":\"كاتب\"},{\"id\":\"b4\",\"type\":\"tags\",\"tags\":[\"تقنية\",\"أدب\"]},{\"id\":\"b5\",\"type\":\"pdf\",\"url\":\"/uploads/blogs-blocks/images/5d94b5b0-030b-432a-adb9-54d08114a103.png\",\"label\":\"ملف مميز\",\"access\":\"premium\"},{\"id\":\"b6\",\"type\":\"voice\",\"url\":\"/uploads/blogs-blocks/images/5d94b5b0-030b-432a-adb9-54d08114a103.png\",\"label\":\"تسجيل مجاني\",\"access\":\"free\"}]', 'تجربة, مقال, كلمات مفتاحية', NULL, 'published', 'none', NULL, NULL, NULL, 0, 0, NULL, '2026-08-14 00:35:49', '2026-08-14 00:35:49', '2026-08-14 00:35:49', '2026-08-14 00:35:49'),
(14, NULL, NULL, NULL, 'كاتب المراجعة', 'مقال من كاتب (معدل)', 'مقال-من-كاتب', 'مقتطف تجريبي', NULL, '[{\"id\":\"b1\",\"type\":\"text\",\"html\":\"<p>محتوى المقال المُرسل</p>\"}]', NULL, NULL, 'published', 'approved', NULL, 1, '2026-08-17 10:25:39', 1, 0, NULL, '2026-08-17 10:25:39', '2026-08-17 10:25:39', '2026-08-17 10:25:39', '2026-08-17 10:25:39'),
(15, NULL, 1, NULL, 'دار النشر', 'مقال مجاني للفلترة', 'مقال-مجاني-للفلترة', NULL, NULL, NULL, NULL, NULL, 'published', 'none', NULL, NULL, NULL, 0, 0, NULL, '2026-08-18 00:22:57', '2026-08-18 00:22:57', '2026-08-18 00:22:57', '2026-08-18 00:22:57'),
(16, NULL, 1, NULL, 'دار النشر', 'مقال مميز للفلترة', 'مقال-مميز-للفلترة', NULL, NULL, NULL, NULL, NULL, 'published', 'none', NULL, NULL, NULL, 1, 0, NULL, '2026-08-18 00:22:58', '2026-08-18 00:22:57', '2026-08-18 00:22:57', '2026-08-18 00:22:57'),
(17, 1, 1, NULL, 'دار إتقان للنشر', 'فن الكتابة: من الفكرة إلى الأثر', 'فن-الكتابة-من-الفكرة-إلى-الأثر', 'رحلة في عالم الكتابة الجادة، من ولادة الفكرة إلى وصولها للقارئ، وأثر دور النشر في صناعة الأصوات الجديدة.', NULL, '[{\"id\":\"b-text-1\",\"type\":\"text\",\"html\":\"<p>تُعدّ الكتابة الجادة رحلةً طويلة تبدأ بفكرة صغيرة وتنتهي بأثرٍ يبقى في وجدان القارئ. في هذا المقال نستعرض كيف يمكن للكاتب أن يوازن بين الأسلوب الأدبي والمحتوى الموضوعي، وكيف تتشكل ملامح الهوية الكتابية عبر الزمن.</p><p>سنتناول أيضًا أبرز التحديات التي تواجه الكُتّاب العرب في العصر الرقمي، ودور دور النشر الحديثة في دعم الأصوات الجديدة.</p>\"},{\"id\":\"b-image-1\",\"type\":\"image\",\"url\":\"/uploads/blogs-blocks/images/818fcd22-a1ca-4ac4-a04f-a8c26f14c6bb.png\",\"alt\":\"صورة توضيحية لمكتبة عربية\",\"caption\":\"المكتبات العربية شاهدة على إرث حضاري عريق\"},{\"id\":\"b-quote-1\",\"type\":\"quote\",\"text\":\"الكتابة الجيدة لا تولد من الفراغ، بل من قراءة عميقة وتجربة صادقة مع الحياة.\",\"author\":\"نجيب محفوظ\"},{\"id\":\"b-tags-1\",\"type\":\"tags\",\"tags\":[\"أدب\",\"كتابة إبداعية\",\"دار نشر\",\"ثقافة عربية\"]},{\"id\":\"b-pdf-1\",\"type\":\"pdf\",\"url\":\"/uploads/blogs-blocks/pdfs/c445d94a-862a-4c12-a80e-e756452d6e72.pdf\",\"label\":\"دليل الكاتب المبتدئ (PDF) - حصري للمشتركين\",\"access\":\"premium\"},{\"id\":\"b-imagetext-1\",\"type\":\"image_text\",\"url\":\"/uploads/blogs-blocks/images/56870d15-ee7a-4bf6-a6f5-2fdc1d6b0459.png\",\"alt\":\"كاتب يعمل على مخطوطته\",\"html\":\"<p>يرى كثير من النقاد أن جودة النص لا تقاس بطول الجمل أو تعقيدها، بل بقدرته على إيصال الفكرة بوضوح وأثر. لذلك ينصح المحررون الكُتّاب الجدد بمراجعة نصوصهم أكثر من مرة، والاستماع إلى ملاحظات القراء الأوائل.</p>\",\"layout\":\"image-right\"},{\"id\":\"block-1788029572343-p56d4b\",\"type\":\"video\",\"url\":\"/uploads/blogs-blocks/videos/a0707459-de8f-4749-9197-b69e497f53ff.mp4\",\"label\":\"عنوان الفيديو\",\"access\":\"free\"}]', 'كتابة إبداعية, أدب عربي, دار نشر, نصائح للكتاب, مقالات ثقافية', '/uploads/blogs/e9f0671a-7afb-441b-926a-a4bab3476c0e.png', 'published', 'none', NULL, NULL, NULL, 0, 1, NULL, '2026-08-18 17:05:43', '2026-08-18 17:05:42', '2026-09-19 19:42:33', NULL),
(21, 1, 1, NULL, 'الإدارة', 'الأدب العربي المعاصر: قراءة معمقة (1)', 'الأدب-العربي-المعاصر-قراءة-معمقة-1', 'مقالة حول الأدب العربي المعاصر، تستعرض أبرز الأفكار والزوايا المرتبطة بالموضوع بأسلوب شيق.', NULL, '[{\"id\":\"b1-1\",\"type\":\"text\",\"html\":\"<p>مقدمة حول الأدب العربي المعاصر: هذا نص تمهيدي يوضح أهمية الموضوع وسياقه العام، ويأخذ القارئ في جولة سريعة قبل الدخول في التفاصيل.</p>\"},{\"id\":\"b1-2\",\"type\":\"image\",\"url\":\"/uploads/blogs-blocks/images/demo1.jpg\",\"alt\":\"صورة توضيحية عن الأدب العربي المعاصر\",\"caption\":\"لقطة تعبيرية عن الأدب العربي المعاصر\"},{\"id\":\"b1-3\",\"type\":\"image_text\",\"url\":\"/uploads/blogs-blocks/images/demo1.jpg\",\"alt\":\"صورة جانبية\",\"html\":\"<p>فقرة مرافقة للصورة تشرح جانبًا من الأدب العربي المعاصر بأسلوب سردي مع تفاصيل إضافية تثري الموضوع.</p>\",\"layout\":\"image-right\"},{\"id\":\"b1-4\",\"type\":\"quote\",\"text\":\"الأدب العربي المعاصر يفتح آفاقًا جديدة للفهم والتأمل.\",\"author\":\"مقولة مختارة\"},{\"id\":\"b1-5\",\"type\":\"tags\",\"tags\":[\"الأدب العربي المعاصر\",\"ثقافة\",\"قراءة\",\"معرفة\"]},{\"id\":\"b1-6\",\"type\":\"pdf\",\"url\":\"/uploads/blogs-blocks/pdfs/demo1.pdf\",\"label\":\"ملف PDF مرفق عن الأدب العربي المعاصر\",\"access\":\"free\"},{\"id\":\"b1-7\",\"type\":\"voice\",\"url\":\"/uploads/blogs-blocks/audio/demo1.mp3\",\"label\":\"تسجيل صوتي حول الأدب العربي المعاصر\",\"access\":\"free\"},{\"id\":\"b1-8\",\"type\":\"video\",\"url\":\"/uploads/blogs-blocks/videos/demo1.mp4\",\"label\":\"فيديو تعريفي عن الأدب العربي المعاصر\",\"access\":\"free\"}]', 'الأدب العربي المعاصر, مدونة, ثقافة', '/uploads/blogs/dcd4ec84-40f1-4869-a9d1-2b77fe8f0abd.jpg', 'published', 'none', NULL, NULL, NULL, 0, 1, NULL, '2026-09-05 19:38:01', '2026-09-05 19:38:01', '2026-09-19 19:42:02', NULL),
(22, 1, 1, NULL, 'الإدارة', 'فلسفة القراءة: قراءة معمقة (2)', 'فلسفة-القراءة-قراءة-معمقة-2', 'مقالة حول فلسفة القراءة، تستعرض أبرز الأفكار والزوايا المرتبطة بالموضوع بأسلوب شيق.', NULL, '[{\"id\":\"b2-1\",\"type\":\"text\",\"html\":\"<p>مقدمة حول فلسفة القراءة: هذا نص تمهيدي يوضح أهمية الموضوع وسياقه العام، ويأخذ القارئ في جولة سريعة قبل الدخول في التفاصيل.</p>\"},{\"id\":\"b2-2\",\"type\":\"image\",\"url\":\"/uploads/blogs-blocks/images/demo2.jpg\",\"alt\":\"صورة توضيحية عن فلسفة القراءة\",\"caption\":\"لقطة تعبيرية عن فلسفة القراءة\"},{\"id\":\"b2-3\",\"type\":\"image_text\",\"url\":\"/uploads/blogs-blocks/images/demo2.jpg\",\"alt\":\"صورة جانبية\",\"html\":\"<p>فقرة مرافقة للصورة تشرح جانبًا من فلسفة القراءة بأسلوب سردي مع تفاصيل إضافية تثري الموضوع.</p>\",\"layout\":\"image-left\"},{\"id\":\"b2-4\",\"type\":\"quote\",\"text\":\"فلسفة القراءة يفتح آفاقًا جديدة للفهم والتأمل.\",\"author\":\"مقولة مختارة\"},{\"id\":\"b2-5\",\"type\":\"tags\",\"tags\":[\"فلسفة القراءة\",\"ثقافة\",\"قراءة\",\"معرفة\"]},{\"id\":\"b2-6\",\"type\":\"pdf\",\"url\":\"/uploads/blogs-blocks/pdfs/demo1.pdf\",\"label\":\"ملف PDF مرفق عن فلسفة القراءة\",\"access\":\"free\"},{\"id\":\"b2-7\",\"type\":\"voice\",\"url\":\"/uploads/blogs-blocks/audio/demo1.mp3\",\"label\":\"تسجيل صوتي حول فلسفة القراءة\",\"access\":\"free\"},{\"id\":\"b2-8\",\"type\":\"video\",\"url\":\"/uploads/blogs-blocks/videos/demo1.mp4\",\"label\":\"فيديو تعريفي عن فلسفة القراءة\",\"access\":\"free\"}]', 'فلسفة القراءة, مدونة, ثقافة', '/uploads/blogs/cover2.jpg', 'published', 'none', NULL, NULL, NULL, 1, 0, NULL, '2026-09-05 19:38:01', '2026-09-05 19:38:01', '2026-09-05 19:38:01', NULL),
(23, 1, 1, NULL, 'الإدارة', 'تاريخ الطباعة: قراءة معمقة (3)', 'تاريخ-الطباعة-قراءة-معمقة-3', 'مقالة حول تاريخ الطباعة، تستعرض أبرز الأفكار والزوايا المرتبطة بالموضوع بأسلوب شيق.', NULL, '[{\"id\":\"b3-1\",\"type\":\"text\",\"html\":\"<p>مقدمة حول تاريخ الطباعة: هذا نص تمهيدي يوضح أهمية الموضوع وسياقه العام، ويأخذ القارئ في جولة سريعة قبل الدخول في التفاصيل.</p>\"},{\"id\":\"b3-2\",\"type\":\"image\",\"url\":\"/uploads/blogs-blocks/images/demo1.jpg\",\"alt\":\"صورة توضيحية عن تاريخ الطباعة\",\"caption\":\"لقطة تعبيرية عن تاريخ الطباعة\"},{\"id\":\"b3-3\",\"type\":\"image_text\",\"url\":\"/uploads/blogs-blocks/images/demo1.jpg\",\"alt\":\"صورة جانبية\",\"html\":\"<p>فقرة مرافقة للصورة تشرح جانبًا من تاريخ الطباعة بأسلوب سردي مع تفاصيل إضافية تثري الموضوع.</p>\",\"layout\":\"image-right\"},{\"id\":\"b3-4\",\"type\":\"quote\",\"text\":\"تاريخ الطباعة يفتح آفاقًا جديدة للفهم والتأمل.\",\"author\":\"مقولة مختارة\"},{\"id\":\"b3-5\",\"type\":\"tags\",\"tags\":[\"تاريخ الطباعة\",\"ثقافة\",\"قراءة\",\"معرفة\"]},{\"id\":\"b3-6\",\"type\":\"pdf\",\"url\":\"/uploads/blogs-blocks/pdfs/demo1.pdf\",\"label\":\"ملف PDF مرفق عن تاريخ الطباعة\",\"access\":\"premium\"},{\"id\":\"b3-7\",\"type\":\"voice\",\"url\":\"/uploads/blogs-blocks/audio/demo1.mp3\",\"label\":\"تسجيل صوتي حول تاريخ الطباعة\",\"access\":\"free\"},{\"id\":\"b3-8\",\"type\":\"video\",\"url\":\"/uploads/blogs-blocks/videos/demo1.mp4\",\"label\":\"فيديو تعريفي عن تاريخ الطباعة\",\"access\":\"free\"}]', 'تاريخ الطباعة, مدونة, ثقافة', '/uploads/blogs/cover3.jpg', 'published', 'none', NULL, NULL, NULL, 0, 0, NULL, '2026-09-05 19:38:01', '2026-09-05 19:38:01', '2026-09-05 19:38:01', NULL),
(24, 1, 2, NULL, 'مشرف تجريبي', 'الشعر الحديث: قراءة معمقة (4)', 'الشعر-الحديث-قراءة-معمقة-4', 'مقالة حول الشعر الحديث، تستعرض أبرز الأفكار والزوايا المرتبطة بالموضوع بأسلوب شيق.', NULL, '[{\"id\":\"b4-1\",\"type\":\"text\",\"html\":\"<p>مقدمة حول الشعر الحديث: هذا نص تمهيدي يوضح أهمية الموضوع وسياقه العام، ويأخذ القارئ في جولة سريعة قبل الدخول في التفاصيل.</p>\"},{\"id\":\"b4-2\",\"type\":\"image\",\"url\":\"/uploads/blogs-blocks/images/demo2.jpg\",\"alt\":\"صورة توضيحية عن الشعر الحديث\",\"caption\":\"لقطة تعبيرية عن الشعر الحديث\"},{\"id\":\"b4-3\",\"type\":\"image_text\",\"url\":\"/uploads/blogs-blocks/images/demo2.jpg\",\"alt\":\"صورة جانبية\",\"html\":\"<p>فقرة مرافقة للصورة تشرح جانبًا من الشعر الحديث بأسلوب سردي مع تفاصيل إضافية تثري الموضوع.</p>\",\"layout\":\"image-left\"},{\"id\":\"b4-4\",\"type\":\"quote\",\"text\":\"الشعر الحديث يفتح آفاقًا جديدة للفهم والتأمل.\",\"author\":\"مقولة مختارة\"},{\"id\":\"b4-5\",\"type\":\"tags\",\"tags\":[\"الشعر الحديث\",\"ثقافة\",\"قراءة\",\"معرفة\"]},{\"id\":\"b4-6\",\"type\":\"pdf\",\"url\":\"/uploads/blogs-blocks/pdfs/demo1.pdf\",\"label\":\"ملف PDF مرفق عن الشعر الحديث\",\"access\":\"free\"},{\"id\":\"b4-7\",\"type\":\"voice\",\"url\":\"/uploads/blogs-blocks/audio/demo1.mp3\",\"label\":\"تسجيل صوتي حول الشعر الحديث\",\"access\":\"premium\"},{\"id\":\"b4-8\",\"type\":\"video\",\"url\":\"/uploads/blogs-blocks/videos/demo1.mp4\",\"label\":\"فيديو تعريفي عن الشعر الحديث\",\"access\":\"free\"}]', 'الشعر الحديث, مدونة, ثقافة', '/uploads/blogs/cover4.jpg', 'published', 'none', NULL, NULL, NULL, 0, 0, NULL, '2026-09-05 19:38:01', '2026-09-05 19:38:01', '2026-09-05 19:38:01', NULL),
(25, 1, 3, NULL, 'مشرف تجريبي 2', 'الرواية العربية: قراءة معمقة (5)', 'الرواية-العربية-قراءة-معمقة-5', 'مقالة حول الرواية العربية، تستعرض أبرز الأفكار والزوايا المرتبطة بالموضوع بأسلوب شيق.', NULL, '[{\"id\":\"b5-1\",\"type\":\"text\",\"html\":\"<p>مقدمة حول الرواية العربية: هذا نص تمهيدي يوضح أهمية الموضوع وسياقه العام، ويأخذ القارئ في جولة سريعة قبل الدخول في التفاصيل.</p>\"},{\"id\":\"b5-2\",\"type\":\"image\",\"url\":\"/uploads/blogs-blocks/images/demo1.jpg\",\"alt\":\"صورة توضيحية عن الرواية العربية\",\"caption\":\"لقطة تعبيرية عن الرواية العربية\"},{\"id\":\"b5-3\",\"type\":\"image_text\",\"url\":\"/uploads/blogs-blocks/images/demo1.jpg\",\"alt\":\"صورة جانبية\",\"html\":\"<p>فقرة مرافقة للصورة تشرح جانبًا من الرواية العربية بأسلوب سردي مع تفاصيل إضافية تثري الموضوع.</p>\",\"layout\":\"image-right\"},{\"id\":\"b5-4\",\"type\":\"quote\",\"text\":\"الرواية العربية يفتح آفاقًا جديدة للفهم والتأمل.\",\"author\":\"مقولة مختارة\"},{\"id\":\"b5-5\",\"type\":\"tags\",\"tags\":[\"الرواية العربية\",\"ثقافة\",\"قراءة\",\"معرفة\"]},{\"id\":\"b5-6\",\"type\":\"pdf\",\"url\":\"/uploads/blogs-blocks/pdfs/demo1.pdf\",\"label\":\"ملف PDF مرفق عن الرواية العربية\",\"access\":\"free\"},{\"id\":\"b5-7\",\"type\":\"voice\",\"url\":\"/uploads/blogs-blocks/audio/demo1.mp3\",\"label\":\"تسجيل صوتي حول الرواية العربية\",\"access\":\"free\"},{\"id\":\"b5-8\",\"type\":\"video\",\"url\":\"/uploads/blogs-blocks/videos/demo1.mp4\",\"label\":\"فيديو تعريفي عن الرواية العربية\",\"access\":\"premium\"}]', 'الرواية العربية, مدونة, ثقافة', '/uploads/blogs/cover5.jpg', 'published', 'none', NULL, NULL, NULL, 1, 0, NULL, '2026-09-05 19:38:01', '2026-09-05 19:38:01', '2026-09-05 19:38:01', NULL),
(26, 1, NULL, 20, 'كاتب مبتدئ', 'أدب الرحلات: قراءة معمقة (6)', 'أدب-الرحلات-قراءة-معمقة-6', 'مقالة حول أدب الرحلات، تستعرض أبرز الأفكار والزوايا المرتبطة بالموضوع بأسلوب شيق.', NULL, '[{\"id\":\"b6-1\",\"type\":\"text\",\"html\":\"<p>مقدمة حول أدب الرحلات: هذا نص تمهيدي يوضح أهمية الموضوع وسياقه العام، ويأخذ القارئ في جولة سريعة قبل الدخول في التفاصيل.</p>\"},{\"id\":\"b6-2\",\"type\":\"image\",\"url\":\"/uploads/blogs-blocks/images/demo2.jpg\",\"alt\":\"صورة توضيحية عن أدب الرحلات\",\"caption\":\"لقطة تعبيرية عن أدب الرحلات\"},{\"id\":\"b6-3\",\"type\":\"image_text\",\"url\":\"/uploads/blogs-blocks/images/demo2.jpg\",\"alt\":\"صورة جانبية\",\"html\":\"<p>فقرة مرافقة للصورة تشرح جانبًا من أدب الرحلات بأسلوب سردي مع تفاصيل إضافية تثري الموضوع.</p>\",\"layout\":\"image-left\"},{\"id\":\"b6-4\",\"type\":\"quote\",\"text\":\"أدب الرحلات يفتح آفاقًا جديدة للفهم والتأمل.\",\"author\":\"مقولة مختارة\"},{\"id\":\"b6-5\",\"type\":\"tags\",\"tags\":[\"أدب الرحلات\",\"ثقافة\",\"قراءة\",\"معرفة\"]},{\"id\":\"b6-6\",\"type\":\"pdf\",\"url\":\"/uploads/blogs-blocks/pdfs/demo1.pdf\",\"label\":\"ملف PDF مرفق عن أدب الرحلات\",\"access\":\"premium\"},{\"id\":\"b6-7\",\"type\":\"voice\",\"url\":\"/uploads/blogs-blocks/audio/demo1.mp3\",\"label\":\"تسجيل صوتي حول أدب الرحلات\",\"access\":\"free\"},{\"id\":\"b6-8\",\"type\":\"video\",\"url\":\"/uploads/blogs-blocks/videos/demo1.mp4\",\"label\":\"فيديو تعريفي عن أدب الرحلات\",\"access\":\"free\"}]', NULL, '/uploads/blogs/cover6.jpg', 'published', 'approved', NULL, 1, '2026-09-05 19:38:01', 0, 0, NULL, '2026-09-05 19:38:01', '2026-09-05 19:38:01', '2026-09-05 19:38:01', NULL),
(27, 1, NULL, 20, 'كاتب مبتدئ', 'النقد الأدبي: قراءة معمقة (7)', 'النقد-الأدبي-قراءة-معمقة-7', 'مقالة حول النقد الأدبي، تستعرض أبرز الأفكار والزوايا المرتبطة بالموضوع بأسلوب شيق.', NULL, '[{\"id\":\"b7-1\",\"type\":\"text\",\"html\":\"<p>مقدمة حول النقد الأدبي: هذا نص تمهيدي يوضح أهمية الموضوع وسياقه العام، ويأخذ القارئ في جولة سريعة قبل الدخول في التفاصيل.</p>\"},{\"id\":\"b7-2\",\"type\":\"image\",\"url\":\"/uploads/blogs-blocks/images/demo1.jpg\",\"alt\":\"صورة توضيحية عن النقد الأدبي\",\"caption\":\"لقطة تعبيرية عن النقد الأدبي\"},{\"id\":\"b7-3\",\"type\":\"image_text\",\"url\":\"/uploads/blogs-blocks/images/demo1.jpg\",\"alt\":\"صورة جانبية\",\"html\":\"<p>فقرة مرافقة للصورة تشرح جانبًا من النقد الأدبي بأسلوب سردي مع تفاصيل إضافية تثري الموضوع.</p>\",\"layout\":\"image-right\"},{\"id\":\"b7-4\",\"type\":\"quote\",\"text\":\"النقد الأدبي يفتح آفاقًا جديدة للفهم والتأمل.\",\"author\":\"مقولة مختارة\"},{\"id\":\"b7-5\",\"type\":\"tags\",\"tags\":[\"النقد الأدبي\",\"ثقافة\",\"قراءة\",\"معرفة\"]},{\"id\":\"b7-6\",\"type\":\"pdf\",\"url\":\"/uploads/blogs-blocks/pdfs/demo1.pdf\",\"label\":\"ملف PDF مرفق عن النقد الأدبي\",\"access\":\"free\"},{\"id\":\"b7-7\",\"type\":\"voice\",\"url\":\"/uploads/blogs-blocks/audio/demo1.mp3\",\"label\":\"تسجيل صوتي حول النقد الأدبي\",\"access\":\"free\"},{\"id\":\"b7-8\",\"type\":\"video\",\"url\":\"/uploads/blogs-blocks/videos/demo1.mp4\",\"label\":\"فيديو تعريفي عن النقد الأدبي\",\"access\":\"free\"}]', NULL, '/uploads/blogs/cover7.jpg', 'published', 'approved', NULL, 1, '2026-09-05 19:38:01', 1, 0, NULL, '2026-09-05 19:38:01', '2026-09-05 19:38:01', '2026-09-05 19:38:01', NULL),
(28, 1, NULL, 20, 'كاتب مبتدئ', 'الترجمة الأدبية: قراءة معمقة (8)', 'الترجمة-الأدبية-قراءة-معمقة-8', 'مقالة حول الترجمة الأدبية، تستعرض أبرز الأفكار والزوايا المرتبطة بالموضوع بأسلوب شيق.', NULL, '[{\"id\":\"b8-1\",\"type\":\"text\",\"html\":\"<p>مقدمة حول الترجمة الأدبية: هذا نص تمهيدي يوضح أهمية الموضوع وسياقه العام، ويأخذ القارئ في جولة سريعة قبل الدخول في التفاصيل.</p>\"},{\"id\":\"b8-2\",\"type\":\"image\",\"url\":\"/uploads/blogs-blocks/images/demo2.jpg\",\"alt\":\"صورة توضيحية عن الترجمة الأدبية\",\"caption\":\"لقطة تعبيرية عن الترجمة الأدبية\"},{\"id\":\"b8-3\",\"type\":\"image_text\",\"url\":\"/uploads/blogs-blocks/images/demo2.jpg\",\"alt\":\"صورة جانبية\",\"html\":\"<p>فقرة مرافقة للصورة تشرح جانبًا من الترجمة الأدبية بأسلوب سردي مع تفاصيل إضافية تثري الموضوع.</p>\",\"layout\":\"image-left\"},{\"id\":\"b8-4\",\"type\":\"quote\",\"text\":\"الترجمة الأدبية يفتح آفاقًا جديدة للفهم والتأمل.\",\"author\":\"مقولة مختارة\"},{\"id\":\"b8-5\",\"type\":\"tags\",\"tags\":[\"الترجمة الأدبية\",\"ثقافة\",\"قراءة\",\"معرفة\"]},{\"id\":\"b8-6\",\"type\":\"pdf\",\"url\":\"/uploads/blogs-blocks/pdfs/demo1.pdf\",\"label\":\"ملف PDF مرفق عن الترجمة الأدبية\",\"access\":\"free\"},{\"id\":\"b8-7\",\"type\":\"voice\",\"url\":\"/uploads/blogs-blocks/audio/demo1.mp3\",\"label\":\"تسجيل صوتي حول الترجمة الأدبية\",\"access\":\"premium\"},{\"id\":\"b8-8\",\"type\":\"video\",\"url\":\"/uploads/blogs-blocks/videos/demo1.mp4\",\"label\":\"فيديو تعريفي عن الترجمة الأدبية\",\"access\":\"free\"}]', NULL, '/uploads/blogs/cover8.jpg', 'published', 'approved', NULL, 1, '2026-09-05 19:38:01', 0, 0, NULL, '2026-09-05 19:38:01', '2026-09-05 19:38:01', '2026-09-05 19:38:01', NULL),
(29, 1, NULL, 21, 'كاتب موثق', 'أدب الطفل: قراءة معمقة (9)', 'أدب-الطفل-قراءة-معمقة-9', 'مقالة حول أدب الطفل، تستعرض أبرز الأفكار والزوايا المرتبطة بالموضوع بأسلوب شيق.', NULL, '[{\"id\":\"b9-1\",\"type\":\"text\",\"html\":\"<p>مقدمة حول أدب الطفل: هذا نص تمهيدي يوضح أهمية الموضوع وسياقه العام، ويأخذ القارئ في جولة سريعة قبل الدخول في التفاصيل.</p>\"},{\"id\":\"b9-2\",\"type\":\"image\",\"url\":\"/uploads/blogs-blocks/images/demo1.jpg\",\"alt\":\"صورة توضيحية عن أدب الطفل\",\"caption\":\"لقطة تعبيرية عن أدب الطفل\"},{\"id\":\"b9-3\",\"type\":\"image_text\",\"url\":\"/uploads/blogs-blocks/images/demo1.jpg\",\"alt\":\"صورة جانبية\",\"html\":\"<p>فقرة مرافقة للصورة تشرح جانبًا من أدب الطفل بأسلوب سردي مع تفاصيل إضافية تثري الموضوع.</p>\",\"layout\":\"image-right\"},{\"id\":\"b9-4\",\"type\":\"quote\",\"text\":\"أدب الطفل يفتح آفاقًا جديدة للفهم والتأمل.\",\"author\":\"مقولة مختارة\"},{\"id\":\"b9-5\",\"type\":\"tags\",\"tags\":[\"أدب الطفل\",\"ثقافة\",\"قراءة\",\"معرفة\"]},{\"id\":\"b9-6\",\"type\":\"pdf\",\"url\":\"/uploads/blogs-blocks/pdfs/demo1.pdf\",\"label\":\"ملف PDF مرفق عن أدب الطفل\",\"access\":\"premium\"},{\"id\":\"b9-7\",\"type\":\"voice\",\"url\":\"/uploads/blogs-blocks/audio/demo1.mp3\",\"label\":\"تسجيل صوتي حول أدب الطفل\",\"access\":\"free\"},{\"id\":\"b9-8\",\"type\":\"video\",\"url\":\"/uploads/blogs-blocks/videos/demo1.mp4\",\"label\":\"فيديو تعريفي عن أدب الطفل\",\"access\":\"free\"}]', NULL, '/uploads/blogs/cover9.jpg', 'published', 'approved', NULL, 1, '2026-09-05 19:38:01', 0, 0, NULL, '2026-09-05 19:38:01', '2026-09-05 19:38:01', '2026-09-05 19:38:01', NULL),
(30, 1, NULL, 21, 'كاتب موثق', 'الكتابة الإبداعية: قراءة معمقة (10)', 'الكتابة-الإبداعية-قراءة-معمقة-10', 'مقالة حول الكتابة الإبداعية، تستعرض أبرز الأفكار والزوايا المرتبطة بالموضوع بأسلوب شيق.', NULL, '[{\"id\":\"b10-1\",\"type\":\"text\",\"html\":\"<p>مقدمة حول الكتابة الإبداعية: هذا نص تمهيدي يوضح أهمية الموضوع وسياقه العام، ويأخذ القارئ في جولة سريعة قبل الدخول في التفاصيل.</p>\"},{\"id\":\"b10-2\",\"type\":\"image\",\"url\":\"/uploads/blogs-blocks/images/demo2.jpg\",\"alt\":\"صورة توضيحية عن الكتابة الإبداعية\",\"caption\":\"لقطة تعبيرية عن الكتابة الإبداعية\"},{\"id\":\"b10-3\",\"type\":\"image_text\",\"url\":\"/uploads/blogs-blocks/images/demo2.jpg\",\"alt\":\"صورة جانبية\",\"html\":\"<p>فقرة مرافقة للصورة تشرح جانبًا من الكتابة الإبداعية بأسلوب سردي مع تفاصيل إضافية تثري الموضوع.</p>\",\"layout\":\"image-left\"},{\"id\":\"b10-4\",\"type\":\"quote\",\"text\":\"الكتابة الإبداعية يفتح آفاقًا جديدة للفهم والتأمل.\",\"author\":\"مقولة مختارة\"},{\"id\":\"b10-5\",\"type\":\"tags\",\"tags\":[\"الكتابة الإبداعية\",\"ثقافة\",\"قراءة\",\"معرفة\"]},{\"id\":\"b10-6\",\"type\":\"pdf\",\"url\":\"/uploads/blogs-blocks/pdfs/demo1.pdf\",\"label\":\"ملف PDF مرفق عن الكتابة الإبداعية\",\"access\":\"free\"},{\"id\":\"b10-7\",\"type\":\"voice\",\"url\":\"/uploads/blogs-blocks/audio/demo1.mp3\",\"label\":\"تسجيل صوتي حول الكتابة الإبداعية\",\"access\":\"free\"},{\"id\":\"b10-8\",\"type\":\"video\",\"url\":\"/uploads/blogs-blocks/videos/demo1.mp4\",\"label\":\"فيديو تعريفي عن الكتابة الإبداعية\",\"access\":\"premium\"}]', NULL, '/uploads/blogs/cover10.jpg', 'published', 'approved', NULL, 1, '2026-09-05 19:38:01', 1, 0, NULL, '2026-09-05 19:38:01', '2026-09-05 19:38:01', '2026-09-05 19:38:01', NULL),
(31, NULL, 1, NULL, 'دار النشر', 'مقالة رقم 1 تيست', 'test-blog-1', 'dawdawdawda', NULL, '[]', '', '/uploads/blogs/e2e534a7-3e82-46c7-941b-e0ea0875b445.png', 'published', 'none', NULL, NULL, NULL, 0, 0, NULL, '2026-09-05 21:43:10', '2026-09-05 21:43:09', '2026-09-05 21:43:44', '2026-09-05 21:43:44'),
(32, NULL, 1, NULL, 'دار النشر', '????? ????? ????????', 'post-6', '?????? ?????? ???????', NULL, NULL, NULL, NULL, 'published', 'none', NULL, NULL, NULL, 0, 1, NULL, '2026-09-12 09:29:35', '2026-09-12 09:29:35', '2026-09-12 09:30:23', '2026-09-12 09:30:23');

-- --------------------------------------------------------

--
-- Table structure for table `blogs_categories`
--

CREATE TABLE `blogs_categories` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blogs_categories`
--

INSERT INTO `blogs_categories` (`id`, `name`, `slug`, `description`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'مقالات ثقافية', 'مقالات-ثقافية', NULL, '2026-08-18 17:04:50', '2026-08-18 17:04:50', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `blogs_categories_translations`
--

CREATE TABLE `blogs_categories_translations` (
  `id` int UNSIGNED NOT NULL,
  `category_id` int UNSIGNED NOT NULL,
  `locale` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blogs_categories_translations`
--

INSERT INTO `blogs_categories_translations` (`id`, `category_id`, `locale`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 1, 'en', 'Cultural Articles', NULL, '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(2, 1, 'de', 'Kulturelle Artikel', NULL, '2026-09-19 19:47:04', '2026-09-19 19:47:04');

-- --------------------------------------------------------

--
-- Table structure for table `blog_translations`
--

CREATE TABLE `blog_translations` (
  `id` int UNSIGNED NOT NULL,
  `blog_id` int UNSIGNED NOT NULL,
  `locale` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(280) COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content_blocks` longtext COLLATE utf8mb4_unicode_ci,
  `seo_keywords` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blog_translations`
--

INSERT INTO `blog_translations` (`id`, `blog_id`, `locale`, `title`, `slug`, `excerpt`, `content_blocks`, `seo_keywords`, `created_at`, `updated_at`) VALUES
(3, 1, 'en', 'Article Number 1', 'article-one', 'A short excerpt from article number 1.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(4, 1, 'de', 'Artikel Nummer 1', 'artikel-eins', 'Ein kurzer Auszug aus Artikel Nummer 1.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(5, 7, 'en', 'The Importance of Reading in Shaping Character', 'importance-of-reading-in-shaping-character', 'How daily reading helps build a balanced, self-aware character.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(6, 7, 'de', 'Die Bedeutung des Lesens für die Charakterbildung', 'bedeutung-des-lesens-fuer-charakterbildung', 'Wie tägliches Lesen zu einem ausgeglichenen, bewussten Charakter beiträgt.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(7, 8, 'en', 'Five Habits for Every Beginning Writer', 'five-habits-for-every-beginning-writer', 'Practical tips to help beginning writers develop their style and productivity.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(8, 8, 'de', 'Fünf Gewohnheiten für jeden angehenden Schriftsteller', 'fuenf-gewohnheiten-fuer-angehende-schriftsteller', 'Praktische Tipps, die angehenden Schriftstellern helfen, ihren Stil und ihre Produktivität zu entwickeln.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(9, 9, 'en', 'How to Choose Your Next Book?', 'how-to-choose-your-next-book', 'A brief guide to picking the right book based on your interests and goals.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(10, 9, 'de', 'Wie wählen Sie Ihr nächstes Buch?', 'wie-waehlen-sie-ihr-naechstes-buch', 'Ein kurzer Leitfaden, um das passende Buch nach Ihren Interessen und Zielen auszuwählen.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(11, 10, 'en', 'The Journey of Publishing Your First Book', 'journey-of-publishing-your-first-book', 'Practical steps from idea to printed book.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(12, 10, 'de', 'Die Reise zur Veröffentlichung Ihres ersten Buches', 'reise-zur-veroeffentlichung-ihres-ersten-buches', 'Praktische Schritte von der Idee bis zum gedruckten Buch.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(13, 11, 'en', 'Arabic Literature in the Digital Age', 'arabic-literature-in-the-digital-age', 'How Arabic writing is adapting to the age of digital platforms.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(14, 11, 'de', 'Arabische Literatur im digitalen Zeitalter', 'arabische-literatur-im-digitalen-zeitalter', 'Wie sich das arabische Schreiben an das Zeitalter der digitalen Plattformen anpasst.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(16, 17, 'de', 'Die Kunst des Schreibens: Von der Idee zur Wirkung', 'die-kunst-des-schreibens-von-der-idee-zur-wirkung', 'Eine Reise durch die Welt des ernsthaften Schreibens – von der Geburt einer Idee bis zum Leser – und die Rolle der Verlage bei der Förderung neuer Stimmen.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(17, 21, 'en', 'Contemporary Arabic Literature: In-Depth Read (1)', 'contemporary-arabic-literature-in-depth-read-1', 'An article about contemporary arabic literature, reviewing the key ideas and angles related to the topic in an engaging style.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(18, 21, 'de', 'Zeitgenössische arabische Literatur: Vertiefte Lektüre (1)', 'zeitgenoessische-arabische-literatur-vertiefte-lektuere-1', 'Ein Artikel über Zeitgenössische arabische Literatur, der die wichtigsten Ideen und Aspekte des Themas auf ansprechende Weise beleuchtet.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(19, 22, 'en', 'The Philosophy of Reading: In-Depth Read (2)', 'the-philosophy-of-reading-in-depth-read-2', 'An article about the philosophy of reading, reviewing the key ideas and angles related to the topic in an engaging style.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(20, 22, 'de', 'Die Philosophie des Lesens: Vertiefte Lektüre (2)', 'die-philosophie-des-lesens-vertiefte-lektuere-2', 'Ein Artikel über Die Philosophie des Lesens, der die wichtigsten Ideen und Aspekte des Themas auf ansprechende Weise beleuchtet.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(21, 23, 'en', 'The History of Printing: In-Depth Read (3)', 'the-history-of-printing-in-depth-read-3', 'An article about the history of printing, reviewing the key ideas and angles related to the topic in an engaging style.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(22, 23, 'de', 'Die Geschichte des Buchdrucks: Vertiefte Lektüre (3)', 'die-geschichte-des-buchdrucks-vertiefte-lektuere-3', 'Ein Artikel über Die Geschichte des Buchdrucks, der die wichtigsten Ideen und Aspekte des Themas auf ansprechende Weise beleuchtet.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(23, 24, 'en', 'Modern Poetry: In-Depth Read (4)', 'modern-poetry-in-depth-read-4', 'An article about modern poetry, reviewing the key ideas and angles related to the topic in an engaging style.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(24, 24, 'de', 'Moderne Poesie: Vertiefte Lektüre (4)', 'moderne-poesie-vertiefte-lektuere-4', 'Ein Artikel über Moderne Poesie, der die wichtigsten Ideen und Aspekte des Themas auf ansprechende Weise beleuchtet.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(25, 25, 'en', 'The Arabic Novel: In-Depth Read (5)', 'the-arabic-novel-in-depth-read-5', 'An article about the arabic novel, reviewing the key ideas and angles related to the topic in an engaging style.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(26, 25, 'de', 'Der arabische Roman: Vertiefte Lektüre (5)', 'der-arabische-roman-vertiefte-lektuere-5', 'Ein Artikel über Der arabische Roman, der die wichtigsten Ideen und Aspekte des Themas auf ansprechende Weise beleuchtet.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(27, 26, 'en', 'Travel Literature: In-Depth Read (6)', 'travel-literature-in-depth-read-6', 'An article about travel literature, reviewing the key ideas and angles related to the topic in an engaging style.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(28, 26, 'de', 'Reiseliteratur: Vertiefte Lektüre (6)', 'reiseliteratur-vertiefte-lektuere-6', 'Ein Artikel über Reiseliteratur, der die wichtigsten Ideen und Aspekte des Themas auf ansprechende Weise beleuchtet.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(29, 27, 'en', 'Literary Criticism: In-Depth Read (7)', 'literary-criticism-in-depth-read-7', 'An article about literary criticism, reviewing the key ideas and angles related to the topic in an engaging style.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(30, 27, 'de', 'Literaturkritik: Vertiefte Lektüre (7)', 'literaturkritik-vertiefte-lektuere-7', 'Ein Artikel über Literaturkritik, der die wichtigsten Ideen und Aspekte des Themas auf ansprechende Weise beleuchtet.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(31, 28, 'en', 'Literary Translation: In-Depth Read (8)', 'literary-translation-in-depth-read-8', 'An article about literary translation, reviewing the key ideas and angles related to the topic in an engaging style.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(32, 28, 'de', 'Literarische Übersetzung: Vertiefte Lektüre (8)', 'literarische-uebersetzung-vertiefte-lektuere-8', 'Ein Artikel über Literarische Übersetzung, der die wichtigsten Ideen und Aspekte des Themas auf ansprechende Weise beleuchtet.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(33, 29, 'en', 'Children\'s Literature: In-Depth Read (9)', 'children-s-literature-in-depth-read-9', 'An article about children\'s literature, reviewing the key ideas and angles related to the topic in an engaging style.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(34, 29, 'de', 'Kinderliteratur: Vertiefte Lektüre (9)', 'kinderliteratur-vertiefte-lektuere-9', 'Ein Artikel über Kinderliteratur, der die wichtigsten Ideen und Aspekte des Themas auf ansprechende Weise beleuchtet.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(35, 30, 'en', 'Creative Writing: In-Depth Read (10)', 'creative-writing-in-depth-read-10', 'An article about creative writing, reviewing the key ideas and angles related to the topic in an engaging style.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(36, 30, 'de', 'Kreatives Schreiben: Vertiefte Lektüre (10)', 'kreatives-schreiben-vertiefte-lektuere-10', 'Ein Artikel über Kreatives Schreiben, der die wichtigsten Ideen und Aspekte des Themas auf ansprechende Weise beleuchtet.', NULL, NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05');

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int UNSIGNED NOT NULL,
  `category_id` int UNSIGNED DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(280) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(190) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) DEFAULT NULL,
  `pricing_tier_id` int UNSIGNED DEFAULT NULL,
  `currency` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `rating` decimal(2,1) DEFAULT NULL,
  `reviews_count` int UNSIGNED NOT NULL DEFAULT '0',
  `cover_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pdf_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('draft','published') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `published_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `category_id`, `title`, `slug`, `author`, `description`, `price`, `pricing_tier_id`, `currency`, `rating`, `reviews_count`, `cover_image`, `pdf_file`, `status`, `published_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, NULL, '???? ???????', 'book', '???? ????', '???? ???? ?? ???? ??????? ????????? ??????.', 49.99, NULL, 'USD', 4.5, 27, NULL, NULL, 'published', '2026-08-08 20:29:12', '2026-08-08 20:29:12', '2026-08-21 18:24:08', '2026-08-08 20:42:03'),
(2, NULL, 'رحلة الكلمات', 'رحلة-الكلمات', 'سارة أحمد', 'كتاب ملهم عن رحلة الكتابة الإبداعية والنشر من الفكرة الأولى حتى الصفحة الأخيرة.', 49.99, NULL, 'USD', 4.5, 27, NULL, NULL, 'published', '2026-08-08 20:42:22', '2026-08-08 20:42:21', '2026-08-21 18:24:08', '2026-08-08 21:16:46'),
(4, NULL, 'ظلال الحروف', 'ظلال-الحروف', 'خالد المطيري', 'مجموعة قصصية تستكشف تفاصيل الحياة اليومية بأسلوب سردي عميق ومؤثر.', 39.50, NULL, 'USD', 4.2, 14, NULL, NULL, 'published', '2026-08-08 21:20:12', '2026-08-08 21:20:12', '2026-08-29 17:23:59', NULL),
(5, NULL, 'همسات من الماضي', 'همسات-من-الماضي', 'منى الزهراني', 'رواية تاريخية تنقل القارئ إلى حقبة زمنية غنية بالأحداث والشخصيات المؤثرة.', 59.00, NULL, 'USD', 4.8, 42, NULL, NULL, 'published', '2026-08-08 21:20:12', '2026-08-08 21:20:12', '2026-08-21 18:24:08', NULL),
(6, NULL, 'دروب المعرفة', 'دروب-المعرفة', 'عبدالله الشمري', 'دليل عملي لبناء عادات القراءة والتعلم المستمر في حياتنا اليومية.', 34.75, NULL, 'USD', 4.0, 9, NULL, NULL, 'published', '2026-08-08 21:20:12', '2026-08-08 21:20:12', '2026-08-21 18:24:08', NULL),
(7, NULL, 'أفق جديد', 'أفق-جديد', 'ليلى حسن', 'مجموعة مقالات فكرية تناقش قضايا الهوية والانتماء في العالم العربي المعاصر.', 44.00, NULL, 'USD', 4.6, 21, NULL, NULL, 'published', '2026-08-08 21:20:12', '2026-08-08 21:20:12', '2026-08-21 18:24:08', NULL),
(9, 1, 'رحلة الكلمات', 'رحلة-الكلمات-2', 'سارة أحمد', 'كتاب ملهم عن رحلة الكتابة الإبداعية والنشر من الفكرة الأولى حتى الصفحة الأخيرة.', NULL, 1, 'USD', 4.5, 27, NULL, NULL, 'published', '2026-08-08 21:59:11', '2026-08-08 21:59:11', '2026-08-29 22:23:06', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `books_categories`
--

CREATE TABLE `books_categories` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `books_categories`
--

INSERT INTO `books_categories` (`id`, `name`, `slug`, `description`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'الادب العربي', 'كيميا', NULL, '2026-08-29 22:21:41', '2026-08-29 22:22:07', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `books_categories_translations`
--

CREATE TABLE `books_categories_translations` (
  `id` int UNSIGNED NOT NULL,
  `category_id` int UNSIGNED NOT NULL,
  `locale` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `books_categories_translations`
--

INSERT INTO `books_categories_translations` (`id`, `category_id`, `locale`, `name`, `description`, `created_at`, `updated_at`) VALUES
(2, 1, 'en', 'Arabic Literature', NULL, '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(3, 1, 'de', 'Arabische Literatur', NULL, '2026-09-19 19:47:04', '2026-09-19 19:47:04');

-- --------------------------------------------------------

--
-- Table structure for table `book_external_links`
--

CREATE TABLE `book_external_links` (
  `id` int UNSIGNED NOT NULL,
  `book_id` int UNSIGNED NOT NULL,
  `label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` smallint UNSIGNED NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `book_external_links`
--

INSERT INTO `book_external_links` (`id`, `book_id`, `label`, `url`, `sort_order`, `created_at`) VALUES
(1, 1, '??????', 'https://amazon.sa/example', 0, '2026-08-08 20:29:12'),
(2, 1, '???', 'https://noon.com/example', 1, '2026-08-08 20:29:12'),
(3, 2, 'أمازون', 'https://amazon.sa/example', 0, '2026-08-08 20:42:21'),
(4, 2, 'نون', 'https://noon.com/example', 1, '2026-08-08 20:42:21');

-- --------------------------------------------------------

--
-- Table structure for table `book_pricing_tiers`
--

CREATE TABLE `book_pricing_tiers` (
  `id` int UNSIGNED NOT NULL,
  `tier_key` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `currency` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `sort_order` tinyint UNSIGNED NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `book_pricing_tiers`
--

INSERT INTO `book_pricing_tiers` (`id`, `tier_key`, `name`, `price`, `currency`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'econ', 'اقتصادي', 8.00, 'USD', 1, '2026-08-29 17:19:50', '2026-08-29 22:23:25'),
(2, 'pro', 'احترافي', 15.00, 'USD', 2, '2026-08-29 17:19:50', '2026-08-29 17:27:21'),
(3, 'extra', 'مميز', 20.00, 'USD', 3, '2026-08-29 17:19:50', '2026-08-29 17:27:21');

-- --------------------------------------------------------

--
-- Table structure for table `book_translations`
--

CREATE TABLE `book_translations` (
  `id` int UNSIGNED NOT NULL,
  `book_id` int UNSIGNED NOT NULL,
  `locale` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `author` varchar(190) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `book_translations`
--

INSERT INTO `book_translations` (`id`, `book_id`, `locale`, `title`, `author`, `description`, `created_at`, `updated_at`) VALUES
(2, 4, 'en', 'Shadows of Letters', 'Khaled Al-Mutairi', 'A short story collection exploring the details of everyday life with a deep, evocative narrative style.', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(3, 4, 'de', 'Schatten der Buchstaben', 'Khaled Al-Mutairi', 'Eine Kurzgeschichtensammlung, die die Details des Alltags in einem tiefgründigen, bewegenden erzählerischen Stil erkundet.', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(4, 5, 'en', 'Whispers from the Past', 'Mona Al-Zahrani', 'A historical novel that transports the reader to an era rich with events and compelling characters.', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(5, 5, 'de', 'Flüstern aus der Vergangenheit', 'Mona Al-Zahrani', 'Ein historischer Roman, der den Leser in eine Epoche voller Ereignisse und einprägsamer Charaktere entführt.', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(6, 6, 'en', 'Paths of Knowledge', 'Abdullah Al-Shammari', 'A practical guide to building reading habits and lifelong learning into our daily lives.', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(7, 6, 'de', 'Wege des Wissens', 'Abdullah Al-Shammari', 'Ein praktischer Leitfaden, um Lesegewohnheiten und lebenslanges Lernen in unseren Alltag zu integrieren.', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(8, 7, 'en', 'A New Horizon', 'Layla Hassan', 'A collection of thought-provoking essays discussing identity and belonging in the contemporary Arab world.', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(9, 7, 'de', 'Ein neuer Horizont', 'Layla Hassan', 'Eine Sammlung nachdenklicher Essays über Identität und Zugehörigkeit in der zeitgenössischen arabischen Welt.', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(10, 9, 'en', 'The Journey of Words', 'Sarah Ahmed', 'An inspiring book about the journey of creative writing and publishing, from the first idea to the final page.', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(11, 9, 'de', 'Die Reise der Worte', 'Sarah Ahmed', 'Ein inspirierendes Buch über die Reise des kreativen Schreibens und Veröffentlichens – von der ersten Idee bis zur letzten Seite.', '2026-09-19 19:47:04', '2026-09-19 19:47:04');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` enum('books','studies','blogs','issues') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'issues',
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `phone`, `subject`, `message`, `is_read`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Test User', 'test@example.com', '+970500000000', 'issues', 'مرحبا، أريد الاستفسار عن كتاب.', 0, '2026-07-27 17:34:31', '2026-07-27 17:34:32', '2026-07-27 17:34:32'),
(2, 'test', 'sub74741@gmail.com', NULL, 'issues', 'ffafawfawfawf', 1, '2026-07-27 17:43:16', '2026-07-27 17:43:24', NULL),
(3, 'A', 'a@example.com', NULL, 'books', 'about a book', 0, '2026-07-27 17:47:59', '2026-07-27 17:48:04', '2026-07-27 17:48:04'),
(4, 'B', 'b@example.com', NULL, 'blogs', 'about a blog', 0, '2026-07-27 17:47:59', '2026-07-27 17:48:04', '2026-07-27 17:48:04'),
(5, 'زائر', 'visitor@example.com', NULL, 'studies', 'أريد الاستفسار عن دراسة معينة.', 0, '2026-07-27 17:51:30', '2026-07-27 17:51:42', '2026-07-27 17:51:42');

-- --------------------------------------------------------

--
-- Table structure for table `content_access_subscriptions`
--

CREATE TABLE `content_access_subscriptions` (
  `id` int UNSIGNED NOT NULL,
  `subscriber_id` int UNSIGNED NOT NULL,
  `plan_id` int UNSIGNED NOT NULL,
  `status` enum('pending','active','expired','cancelled','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `tap_charge_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `starts_at` datetime DEFAULT NULL,
  `ends_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `content_access_subscriptions`
--

INSERT INTO `content_access_subscriptions` (`id`, `subscriber_id`, `plan_id`, `status`, `tap_charge_id`, `starts_at`, `ends_at`, `created_at`, `updated_at`) VALUES
(2, 14, 1, 'pending', NULL, NULL, NULL, '2026-08-21 18:17:47', '2026-08-21 18:17:47'),
(5, 14, 1, 'pending', 'chg_TS03A5620261544l9LY2108418', NULL, NULL, '2026-08-21 18:44:53', '2026-08-21 18:44:54'),
(6, 14, 1, 'pending', NULL, NULL, NULL, '2026-08-22 23:22:29', '2026-08-22 23:22:29'),
(7, 14, 1, 'pending', 'chg_TS04A5720262022Oq9r2208909', NULL, NULL, '2026-08-22 23:22:57', '2026-08-22 23:22:59'),
(8, 18, 1, 'pending', 'chg_TS02A1520261830c4MD0509104', NULL, NULL, '2026-09-05 21:30:14', '2026-09-05 21:30:16');

-- --------------------------------------------------------

--
-- Table structure for table `content_subscription_plans`
--

CREATE TABLE `content_subscription_plans` (
  `id` int UNSIGNED NOT NULL,
  `category` enum('blogs','studies') COLLATE utf8mb4_unicode_ci NOT NULL,
  `billing_cycle` enum('monthly','annual') COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `currency` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `content_subscription_plans`
--

INSERT INTO `content_subscription_plans` (`id`, `category`, `billing_cycle`, `price`, `currency`, `created_at`, `updated_at`) VALUES
(1, 'blogs', 'monthly', 5.00, 'USD', '2026-08-13 15:24:34', '2026-08-21 18:24:08'),
(2, 'blogs', 'annual', 50.00, 'USD', '2026-08-13 15:24:34', '2026-08-21 18:24:08'),
(3, 'studies', 'annual', 80.00, 'USD', '2026-08-13 15:24:34', '2026-08-21 18:24:08');

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` int UNSIGNED NOT NULL,
  `subscriber_id` int UNSIGNED NOT NULL,
  `item_type` enum('blog','study') COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_id` int UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`id`, `subscriber_id`, `item_type`, `item_id`, `created_at`) VALUES
(2, 14, 'blog', 17, '2026-08-22 21:27:02'),
(3, 21, 'blog', 21, '2026-09-05 22:38:24');

-- --------------------------------------------------------

--
-- Table structure for table `join_requests`
--

CREATE TABLE `join_requests` (
  `id` int UNSIGNED NOT NULL,
  `request_type` enum('volunteer','complaint','suggestion') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'volunteer',
  `participation_type` enum('individual','institution') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `institution_name` varchar(190) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `institution_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `institution_website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `full_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `interest_areas` text COLLATE utf8mb4_unicode_ci,
  `message` text COLLATE utf8mb4_unicode_ci,
  `newsletter_opt_in` tinyint(1) NOT NULL DEFAULT '0',
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `join_requests`
--

INSERT INTO `join_requests` (`id`, `request_type`, `participation_type`, `institution_name`, `institution_type`, `institution_website`, `full_name`, `email`, `phone`, `location`, `interest_areas`, `message`, `newsletter_opt_in`, `is_read`, `created_at`, `updated_at`, `deleted_at`) VALUES
(3, 'volunteer', 'individual', NULL, NULL, NULL, 'te4st', 'teset@gmail.com', '1116958815', 'Egypt', '[\"childrens_literature\",\"web_development\",\"partnerships\"]', 'اخبرنا عن نفسك', 1, 1, '2026-09-05 22:26:42', '2026-09-05 22:28:12', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `newsletter_signups`
--

CREATE TABLE `newsletter_signups` (
  `id` int UNSIGNED NOT NULL,
  `email` varchar(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_slug` varchar(280) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_name` varchar(190) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `blog_slug` varchar(280) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news_ticker_items`
--

CREATE TABLE `news_ticker_items` (
  `id` int UNSIGNED NOT NULL,
  `message` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target` enum('all','reader','writer') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'all',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int UNSIGNED NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `news_ticker_items`
--

INSERT INTO `news_ticker_items` (`id`, `message`, `target`, `is_active`, `sort_order`, `created_at`, `updated_at`, `deleted_at`) VALUES
(4, 'شريط اخباري جديد', 'all', 1, 0, '2026-08-29 18:29:24', '2026-08-29 21:54:16', '2026-08-29 21:54:16'),
(5, 'شريط اخباري جديد', 'all', 1, 0, '2026-08-29 18:29:31', '2026-08-29 18:29:31', NULL),
(6, 'شريط اخباري جديد1', 'all', 1, 2, '2026-08-29 18:30:29', '2026-08-29 18:30:29', NULL),
(7, 'شريط اخباري جديد111', 'all', 1, 3, '2026-08-29 21:54:13', '2026-08-29 21:54:13', NULL),
(8, 'مرحبًا بكم في دار نشرنا الجديدة على الويب', 'all', 1, 0, '2026-08-29 21:57:31', '2026-08-29 21:57:31', NULL),
(9, 'إصدار جديد من سلسلة الدراسات الأدبية متاح الآن', 'all', 1, 0, '2026-08-29 21:57:31', '2026-08-29 21:57:31', NULL),
(10, 'خصم خاص على الاشتراك السنوي في المدونة المميزة هذا الأسبوع', 'reader', 1, 0, '2026-08-29 21:57:31', '2026-08-29 21:57:31', NULL),
(11, 'انضم إلينا في ورشة الكتابة الإبداعية الشهر القادم', 'all', 1, 0, '2026-08-29 21:57:31', '2026-08-29 21:57:31', NULL),
(12, 'تم إطلاق نظام الباقات الثلاث الجديد لتسعير الكتب', 'all', 1, 0, '2026-08-29 21:57:31', '2026-08-29 21:57:31', NULL),
(13, 'كُتّابنا الجدد: تحقق من كوبونات التجربة المجانية في حسابك', 'writer', 1, 0, '2026-08-29 21:57:31', '2026-08-29 21:57:31', NULL),
(14, 'أضفنا دعم الفيديو في قسم كتابة المقالات', 'writer', 1, 0, '2026-08-29 21:57:31', '2026-08-29 21:57:31', NULL),
(15, 'أكثر من 100 دراسة منشورة على منصتنا حتى الآن', 'all', 1, 0, '2026-08-29 21:57:31', '2026-08-29 21:57:31', NULL),
(16, 'تابعونا على وسائل التواصل الاجتماعي لمعرفة آخر الأخبار', 'all', 1, 0, '2026-08-29 21:57:31', '2026-08-29 21:57:31', NULL),
(17, 'نرحب بملاحظاتكم واقتراحاتكم عبر صفحة تواصل معنا', 'all', 1, 0, '2026-08-29 21:57:31', '2026-08-29 21:57:31', NULL),
(18, 'اهلا بكم', 'all', 1, 13, '2026-08-29 21:59:04', '2026-08-29 21:59:04', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `news_ticker_item_translations`
--

CREATE TABLE `news_ticker_item_translations` (
  `id` int UNSIGNED NOT NULL,
  `item_id` int UNSIGNED NOT NULL,
  `locale` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `news_ticker_item_translations`
--

INSERT INTO `news_ticker_item_translations` (`id`, `item_id`, `locale`, `message`, `created_at`, `updated_at`) VALUES
(1, 5, 'en', 'New ticker announcement', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(2, 5, 'de', 'Neue Ticker-Ankündigung', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(3, 6, 'en', 'New ticker announcement 1', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(4, 6, 'de', 'Neue Ticker-Ankündigung 1', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(5, 7, 'en', 'New ticker announcement 111', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(6, 7, 'de', 'Neue Ticker-Ankündigung 111', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(7, 8, 'en', 'Welcome to our new publishing house website', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(8, 8, 'de', 'Willkommen auf der neuen Website unseres Verlags', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(9, 9, 'en', 'A new title in our literary studies series is now available', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(10, 9, 'de', 'Ein neuer Titel unserer literaturwissenschaftlichen Reihe ist jetzt verfügbar', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(11, 10, 'en', 'Special discount on the annual premium blog subscription this week', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(12, 10, 'de', 'Sonderrabatt auf das jährliche Premium-Blog-Abonnement diese Woche', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(13, 11, 'en', 'Join our creative writing workshop next month', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(14, 11, 'de', 'Nehmen Sie nächsten Monat an unserem Kreativ-Schreibworkshop teil', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(15, 12, 'en', 'We\'ve launched a new three-tier pricing system for books', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(16, 12, 'de', 'Wir haben ein neues dreistufiges Preissystem für Bücher eingeführt', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(17, 13, 'en', 'New writers: check your account for free-trial coupons', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(18, 13, 'de', 'Neue Autoren: Prüfen Sie Ihr Konto auf Gutscheine für die kostenlose Testphase', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(19, 14, 'en', 'We\'ve added video support to the article editor', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(20, 14, 'de', 'Wir haben Video-Unterstützung im Artikel-Editor hinzugefügt', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(21, 15, 'en', 'Over 100 studies published on our platform so far', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(22, 15, 'de', 'Bisher über 100 Studien auf unserer Plattform veröffentlicht', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(23, 16, 'en', 'Follow us on social media for the latest news', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(24, 16, 'de', 'Folgen Sie uns in den sozialen Medien für die neuesten Nachrichten', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(25, 17, 'en', 'We welcome your feedback and suggestions via our contact page', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(26, 17, 'de', 'Wir freuen uns über Ihr Feedback und Ihre Vorschläge über unsere Kontaktseite', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(27, 18, 'en', 'Welcome', '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(28, 18, 'de', 'Willkommen', '2026-09-19 19:47:04', '2026-09-19 19:47:04');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int UNSIGNED NOT NULL,
  `site_name` varchar(190) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'دار النشر',
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `call_number` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `whatsapp_number` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `about_text` text COLLATE utf8mb4_unicode_ci,
  `seo_default_title` varchar(190) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seo_default_description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `site_name`, `logo`, `call_number`, `whatsapp_number`, `about_text`, `seo_default_title`, `seo_default_description`, `created_at`, `updated_at`) VALUES
(1, 'دار النشر', '/uploads/logos/e3410c5c-3f13-49b7-b8ce-b2cb6e217eb9.png', '01116958815', '01116958815', 'من نحن دار نشر ض', NULL, NULL, '2026-07-21 07:01:33', '2026-08-01 18:42:58');

-- --------------------------------------------------------

--
-- Table structure for table `site_ads`
--

CREATE TABLE `site_ads` (
  `id` int UNSIGNED NOT NULL,
  `title` varchar(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_label` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target` enum('all','guest','reader','writer') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'all',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int UNSIGNED NOT NULL DEFAULT '0',
  `starts_at` datetime DEFAULT NULL,
  `ends_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `site_ads`
--

INSERT INTO `site_ads` (`id`, `title`, `message`, `image`, `link_url`, `link_label`, `target`, `is_active`, `sort_order`, `starts_at`, `ends_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(7, 'انضم إلينا واكتشف عالم القراءة', 'سجّل الآن كقارئ واستمتع بمحتوى حصري من الكتب والدراسات والمقالات.', '/uploads/ads/ad1.jpg', NULL, NULL, 'guest', 1, 0, NULL, NULL, '2026-09-05 19:38:25', '2026-09-05 19:38:25', NULL),
(8, 'اشترك اليوم واحصل على خصم خاص', 'باقات اشتراك مرنة تناسب جميع القراء، ابدأ رحلتك الآن.', '/uploads/ads/ad2.jpg', NULL, NULL, 'guest', 1, 1, NULL, NULL, '2026-09-05 19:38:25', '2026-09-05 19:38:25', NULL),
(9, 'هل تحب الكتابة؟ انضم ككاتب', 'أنشئ حساب كاتب وابدأ بنشر مقالاتك مع تجربة مجانية لمدة شهر.', '/uploads/ads/ad3.jpg', NULL, NULL, 'guest', 1, 2, NULL, NULL, '2026-09-05 19:38:26', '2026-09-05 19:38:26', NULL),
(10, 'دراسات جديدة كل أسبوع', 'تصفح أحدث الدراسات المتخصصة المتاحة الآن لأعضائنا المشتركين.', '/uploads/ads/ad4.jpg', NULL, NULL, 'reader', 1, 3, NULL, NULL, '2026-09-05 19:38:26', '2026-09-05 19:38:26', NULL),
(11, 'أضف كتبك المفضلة إلى مكتبتك', 'استخدم ميزة المفضلة لحفظ الكتب والدراسات والعودة إليها لاحقًا.', '/uploads/ads/ad5.jpg', NULL, NULL, 'reader', 1, 4, NULL, NULL, '2026-09-05 19:38:26', '2026-09-05 19:38:26', NULL),
(12, 'ترقّ إلى العضوية المميزة', 'افتح كل المحتوى الحصري بالترقية إلى الاشتراك المميز اليوم.', '/uploads/ads/ad6.jpg', NULL, NULL, 'reader', 1, 5, NULL, NULL, '2026-09-05 19:38:26', '2026-09-05 19:38:26', NULL),
(13, 'شارك أفكارك مع آلاف القراء', 'انشر مقالتك التالية الآن من لوحة تحكم الكاتب الخاصة بك.', '/uploads/ads/ad7.jpg', NULL, NULL, 'writer', 1, 6, NULL, NULL, '2026-09-05 19:38:26', '2026-09-05 19:38:26', NULL),
(14, 'ترقَّ إلى كاتب موثّق', 'احصل على شارة التوثيق ومزايا إضافية عند ترقية باقتك.', '/uploads/ads/ad8.jpg', NULL, NULL, 'writer', 1, 7, NULL, NULL, '2026-09-05 19:38:26', '2026-09-05 19:38:26', NULL),
(15, 'نصائح لكتابة مقالة ناجحة', 'اطّلع على دليل الكتابة لتحسين فرص قبول مقالاتك من فريق المراجعة.', '/uploads/ads/ad9.jpg', NULL, NULL, 'writer', 1, 8, NULL, NULL, '2026-09-05 19:38:26', '2026-09-05 19:38:26', NULL),
(16, '?????? ?????', '??????', '/uploads/ads/b055f0c4-912b-4c7e-b9f4-2e46e8e32c19.jpg', NULL, NULL, 'guest', 1, 0, NULL, NULL, '2026-09-05 21:40:31', '2026-09-05 21:40:36', '2026-09-05 21:40:36'),
(17, 'test2', 'test2', '/uploads/ads/afac8adb-a5b8-4146-bdf7-d65060f2cebb.jpg', NULL, NULL, 'guest', 1, 0, NULL, NULL, '2026-09-05 21:58:02', '2026-09-05 21:58:37', '2026-09-05 21:58:37'),
(18, 'اعلان جديد', 'نص الاعلان الجديد', '/uploads/ads/4df05d63-7e50-434d-88ca-f729572a1ed2.png', 'http://localhost:3000/join', 'ادخل الان', 'guest', 1, 9, NULL, NULL, '2026-09-05 22:39:44', '2026-09-05 22:39:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `site_ad_translations`
--

CREATE TABLE `site_ad_translations` (
  `id` int UNSIGNED NOT NULL,
  `ad_id` int UNSIGNED NOT NULL,
  `locale` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_label` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `site_ad_translations`
--

INSERT INTO `site_ad_translations` (`id`, `ad_id`, `locale`, `title`, `message`, `link_label`, `created_at`, `updated_at`) VALUES
(2, 7, 'en', 'Join Us and Discover the World of Reading', 'Sign up now as a reader and enjoy exclusive content from books, studies, and articles.', NULL, '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(3, 7, 'de', 'Werden Sie Teil unserer Lesewelt', 'Registrieren Sie sich jetzt als Leser und genießen Sie exklusive Inhalte aus Büchern, Studien und Artikeln.', NULL, '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(4, 8, 'en', 'Subscribe Today and Get a Special Discount', 'Flexible subscription plans for every reader — start your journey now.', NULL, '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(5, 8, 'de', 'Abonnieren Sie heute und sichern Sie sich einen Sonderrabatt', 'Flexible Abo-Pläne für jeden Leser – starten Sie jetzt Ihre Reise.', NULL, '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(6, 9, 'en', 'Love Writing? Join as a Writer', 'Create a writer account and start publishing your articles with a one-month free trial.', NULL, '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(7, 9, 'de', 'Lieben Sie das Schreiben? Werden Sie Autor', 'Erstellen Sie ein Autorenkonto und veröffentlichen Sie Ihre Artikel mit einem einmonatigen kostenlosen Test.', NULL, '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(8, 10, 'en', 'New Studies Every Week', 'Browse the latest specialized studies now available to our subscribed members.', NULL, '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(9, 10, 'de', 'Jede Woche neue Studien', 'Entdecken Sie die neuesten Fachstudien, die jetzt für unsere Abonnenten verfügbar sind.', NULL, '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(10, 11, 'en', 'Add Your Favorite Books to Your Library', 'Use the favorites feature to save books and studies and come back to them later.', NULL, '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(11, 11, 'de', 'Fügen Sie Ihre Lieblingsbücher zu Ihrer Bibliothek hinzu', 'Nutzen Sie die Favoritenfunktion, um Bücher und Studien zu speichern und später wiederzufinden.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(12, 12, 'en', 'Upgrade to Premium Membership', 'Unlock all exclusive content by upgrading to a premium subscription today.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(13, 12, 'de', 'Upgraden Sie auf die Premium-Mitgliedschaft', 'Schalten Sie alle exklusiven Inhalte frei, indem Sie noch heute auf ein Premium-Abo upgraden.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(14, 13, 'en', 'Share Your Ideas with Thousands of Readers', 'Publish your next article now from your writer dashboard.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(15, 13, 'de', 'Teilen Sie Ihre Ideen mit Tausenden von Lesern', 'Veröffentlichen Sie jetzt Ihren nächsten Artikel über Ihr Autoren-Dashboard.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(16, 14, 'en', 'Become a Verified Writer', 'Get a verified badge and extra benefits when you upgrade your plan.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(17, 14, 'de', 'Werden Sie ein verifizierter Autor', 'Erhalten Sie ein Verifizierungsabzeichen und zusätzliche Vorteile, wenn Sie Ihr Paket upgraden.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(18, 15, 'en', 'Tips for Writing a Successful Article', 'Check out our writing guide to improve your article\'s chances of approval by our review team.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(19, 15, 'de', 'Tipps für einen erfolgreichen Artikel', 'Lesen Sie unseren Schreibratgeber, um die Chancen auf eine Freigabe durch unser Redaktionsteam zu verbessern.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(20, 18, 'en', 'New Announcement', 'This is the new announcement text.', 'Enter Now', '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(21, 18, 'de', 'Neue Ankündigung', 'Dies ist der Text der neuen Ankündigung.', 'Jetzt eintreten', '2026-09-19 19:47:05', '2026-09-19 19:47:05');

-- --------------------------------------------------------

--
-- Table structure for table `social_links`
--

CREATE TABLE `social_links` (
  `id` int UNSIGNED NOT NULL,
  `settings_id` int UNSIGNED NOT NULL DEFAULT '1',
  `platform` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` smallint UNSIGNED NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `social_links`
--

INSERT INTO `social_links` (`id`, `settings_id`, `platform`, `url`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
(4, 1, 'facebook', 'https://facebook.com', 1, 0, '2026-07-28 16:46:42', '2026-07-28 16:46:42'),
(5, 1, 'snapchat', 'https://facebook.com', 1, 0, '2026-07-28 16:46:47', '2026-07-28 16:46:47'),
(6, 1, 'tiktok', 'https://facebook.com', 1, 0, '2026-07-28 16:46:48', '2026-07-28 16:46:48'),
(7, 1, 'instagram', 'https://facebook.com', 1, 0, '2026-07-28 16:46:48', '2026-07-28 16:46:48'),
(8, 1, 'linkedin', 'https://facebook.com', 1, 0, '2026-07-28 16:46:50', '2026-07-28 16:46:50');

-- --------------------------------------------------------

--
-- Table structure for table `studies`
--

CREATE TABLE `studies` (
  `id` int UNSIGNED NOT NULL,
  `category_id` int UNSIGNED DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(280) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(190) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `content_blocks` longtext COLLATE utf8mb4_unicode_ci,
  `content_intro` longtext COLLATE utf8mb4_unicode_ci,
  `content_body` longtext COLLATE utf8mb4_unicode_ci,
  `cover_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `main_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pdf_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('draft','published') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `is_premium` tinyint(1) NOT NULL DEFAULT '0',
  `is_highlighted` tinyint(1) NOT NULL DEFAULT '0',
  `highlighted_until` datetime DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `currency` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `published_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `studies`
--

INSERT INTO `studies` (`id`, `category_id`, `title`, `slug`, `author`, `description`, `content_blocks`, `content_intro`, `content_body`, `cover_image`, `main_image`, `pdf_file`, `status`, `is_premium`, `is_highlighted`, `highlighted_until`, `price`, `currency`, `published_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'دراسة رقم 1', 'study-one', 'دار النشر', 'دراسة رقم 1 مقتطف قصير دراسة رقم 1 مقتطف قصير دراسة رقم 1 مقتطف قصير دراسة رقم 1 مقتطف قصير دراسة رقم 1 مقتطف قصير دراسة رقم 1 مقتطف قصير دراسة رقم 1 مقتطف قصير دراسة رقم 1 مقتطف قصير دراسة رقم 1 مقتطف قصير', NULL, 'دراسة رقم 1 فقرة اولي دراسة رقم 1 فقرة اولي دراسة رقم 1 فقرة اولي دراسة رقم 1 فقرة اولي دراسة رقم 1 فقرة اولي دراسة رقم 1 فقرة اولي دراسة رقم 1 فقرة اولي دراسة رقم 1 فقرة اولي دراسة رقم 1 فقرة اولي ', 'دراسة رقم 1 فقرة ثانية دراسة رقم 1 فقرة ثانية دراسة رقم 1 فقرة ثانية دراسة رقم 1 فقرة ثانية دراسة رقم 1 فقرة ثانية دراسة رقم 1 فقرة ثانية دراسة رقم 1 فقرة ثانية دراسة رقم 1 فقرة ثانية دراسة رقم 1 فقرة ثانية دراسة رقم 1 فقرة ثانية دراسة رقم 1 فقرة ثانية دراسة رقم 1 فقرة ثانية دراسة رقم 1 فقرة ثانية ', '/uploads/studies/de29602c-6151-441a-9943-3f73bbff65f7.png', '/uploads/studies/c9080fea-7df3-4656-8af8-e75f359b99c1.jpg', NULL, 'published', 0, 0, NULL, NULL, 'USD', '2026-08-08 10:14:51', '2026-08-08 10:14:50', '2026-08-21 18:24:08', NULL),
(2, NULL, '??? ??????? ??????? ??? ??????? ???????', 'study', NULL, '????? ??????? ??? ??????? ??? ??????? ?? ??????? ??????? ???????? ????????? ??????.', NULL, '<p>?????? ??? ??????? ??? ?????? ?????? ??????? ??? ?????? ????? ??????? ?????????.</p>', '<p>????? ??????? ???? ????? ??????? ???? ??? ??????? ??????? ???????? ??????? ?? ??????? ???????.</p>', NULL, NULL, NULL, 'published', 0, 0, NULL, NULL, 'USD', '2026-08-08 12:58:51', '2026-08-08 12:58:50', '2026-08-21 18:24:08', '2026-08-08 20:42:03'),
(3, NULL, '???? ????? ?????? ??????', 'study-2', NULL, '????? ??????? ??? ?????? ????? ????? ?????? ?? ?? ?????? ??????.', NULL, '<p>??????? ??????? ???? ???????? ???? ???? ??? ????? ????? ?????? ???? ????? ??????.</p>', '<p>???? ??????? ??? ?? ??? ????? ???? ???? ????? ????? ???? ????? ???? ?? ????? ??????.</p>', NULL, NULL, NULL, 'published', 0, 0, NULL, NULL, 'USD', '2026-08-08 12:58:51', '2026-08-08 12:58:50', '2026-08-21 18:24:08', '2026-08-08 20:42:03'),
(4, NULL, '????? ??????? ??????? ??? ?????? ??????', 'study-3', NULL, '??????? ?????? ?????? ??????? ??????????? ??? ??? ?????? ?? ?????? ??????.', NULL, '<p>?????? ??????? ??? ??????? ????? ??? ???? ?? ?????? ?? ??? ??? ?????.</p>', '<p>????? ?? ???????? ?????? ???????? ???? ??????? ?? ???????? ?????? ??????.</p>', NULL, NULL, NULL, 'published', 0, 0, NULL, NULL, 'USD', '2026-08-08 12:58:51', '2026-08-08 12:58:50', '2026-08-21 18:24:08', '2026-08-08 20:42:03'),
(5, NULL, '??? ??? ????? ???????? ?? ??? ??????? ?????', 'study-4', NULL, '????? ??? ?????? ??? ????? ???????? ?? ?????? ???? ??????? ??????? ???????.', NULL, '<p>???? ??????? ??? ????? ?? ??? ????? ???????? ???? ????? ??????? ?????.</p>', '<p>????? ??????? ?? ????? ?????? ??????? ????? ????? ??????? ??? ???? ?????? ??????.</p>', NULL, NULL, NULL, 'published', 0, 0, NULL, NULL, 'USD', '2026-08-08 12:58:51', '2026-08-08 12:58:50', '2026-08-21 18:24:08', '2026-08-08 20:42:03'),
(6, NULL, '????? ??????? ??? ?????? ????? ?????? ???????', 'study-5', NULL, '????? ??? ??? ???? ??????? ?? ????? ????? ?????? ??? ?????? ??? ?????? ????????.', NULL, '<p>????? ??????? ???? ??????? ??????? ???? ?????? ???? ??????? ??????? ?????????.</p>', '<p>???? ??????? ??? ?? ????????? ?? ??????? ?????????? ???? ?? ??? ???? ????? ?????? ???????.</p>', NULL, NULL, NULL, 'published', 0, 0, NULL, NULL, 'USD', '2026-08-08 12:58:51', '2026-08-08 12:58:50', '2026-08-21 18:24:08', '2026-08-08 20:42:03'),
(7, NULL, 'أثر القراءة المبكرة على التحصيل الدراسي', 'أثر-القراءة-المبكرة-على-التحصيل-الدراسي', NULL, 'دراسة تحليلية حول العلاقة بين القراءة في الطفولة المبكرة والتحصيل الأكاديمي لاحقًا.', NULL, '<p>تناولت هذه الدراسة أثر التعرض المبكر للقراءة على مهارات الطفل اللغوية والمعرفية.</p>', '<p>أظهرت النتائج وجود علاقة إيجابية قوية بين القراءة المبكرة والتحصيل الدراسي في المراحل اللاحقة.</p>', NULL, NULL, NULL, 'published', 0, 0, NULL, NULL, 'USD', '2026-08-08 21:20:12', '2026-08-08 21:20:12', '2026-08-21 18:24:08', NULL),
(8, NULL, 'واقع النشر العربي الرقمي', 'واقع-النشر-العربي-الرقمي', NULL, 'دراسة ميدانية حول تحولات صناعة النشر العربي في ظل التحول الرقمي.', NULL, '<p>استعرضت الدراسة أبرز التغيرات التي طرأت على صناعة النشر العربي خلال العقد الأخير.</p>', '<p>خلصت الدراسة إلى أن دور النشر التي تبنت أدوات رقمية حققت نموًا أعلى في قاعدة قرائها.</p>', NULL, NULL, NULL, 'published', 0, 0, NULL, NULL, 'USD', '2026-08-08 21:20:12', '2026-08-08 21:20:12', '2026-08-21 18:24:08', NULL),
(9, NULL, 'تحليل اتجاهات القراءة لدى الشباب العربي', 'تحليل-اتجاهات-القراءة-لدى-الشباب-العربي', NULL, 'استطلاع وتحليل لعادات القراءة واهتماماتها لدى فئة الشباب في العالم العربي.', NULL, '<p>اعتمدت الدراسة على استبيان وُزّع على عينة من الشباب في عدة دول عربية.</p>', '<p>تبيّن أن الروايات والكتب التنموية تحتل الصدارة في اهتمامات القراء الشباب.</p>', NULL, NULL, NULL, 'published', 0, 0, NULL, NULL, 'USD', '2026-08-08 21:20:12', '2026-08-08 21:20:12', '2026-08-21 18:24:08', NULL),
(10, NULL, 'دور دور النشر المستقلة في دعم الكتّاب الجدد', 'دور-دور-النشر-المستقلة-في-دعم-الكت-اب-الجدد', NULL, 'دراسة حول مساهمة دور النشر المستقلة في اكتشاف ودعم المواهب الأدبية الناشئة.', NULL, '<p>ركزت الدراسة على نماذج من دور النشر المستقلة التي تبنّت كتّابًا جددًا.</p>', '<p>أظهرت الدراسة أن الدعم المبكر للكتّاب الجدد ينعكس إيجابًا على تنوع المشهد الأدبي.</p>', NULL, NULL, NULL, 'published', 0, 0, NULL, NULL, 'USD', '2026-08-08 21:20:12', '2026-08-08 21:20:12', '2026-08-21 18:24:08', NULL),
(11, NULL, 'تأثير الترجمة على انتشار الأدب العربي عالميًا', 'تأثير-الترجمة-على-انتشار-الأدب-العربي-عالمي-ا', NULL, 'دراسة حول دور حركة الترجمة في إيصال الأدب العربي إلى القارئ غير الناطق بالعربية.', NULL, '<p>تتبعت الدراسة أبرز الأعمال العربية التي تُرجمت خلال السنوات الأخيرة وانتشارها.</p>', '<p>خلصت الدراسة إلى أن الاستثمار في الترجمة الاحترافية يرفع من فرص وصول الأدب العربي عالميًا.</p>', NULL, NULL, NULL, 'published', 0, 0, NULL, NULL, 'USD', '2026-08-08 21:20:12', '2026-08-08 21:20:12', '2026-08-21 18:24:08', NULL),
(12, NULL, 'دراسة مميزة للتجربة', 'دراسة-مميزة-للتجربة', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'published', 1, 0, NULL, 15.00, 'USD', '2026-08-13 15:36:05', '2026-08-13 15:36:05', '2026-08-21 18:24:08', '2026-08-13 15:36:06'),
(13, NULL, '????? ??????? ????????', 'study-6', '???? ??????', '??? ????', '[{\"id\":\"b1\",\"type\":\"text\",\"html\":\"<p>????? ???????</p>\"},{\"id\":\"b2\",\"type\":\"pdf\",\"url\":\"/uploads/studies-blocks/pdfs/test.pdf\",\"label\":\"??? ?????\",\"access\":\"free\"},{\"id\":\"b3\",\"type\":\"pdf\",\"url\":\"/uploads/studies-blocks/pdfs/test2.pdf\",\"label\":\"??? ????\",\"access\":\"premium\"}]', NULL, NULL, NULL, NULL, NULL, 'published', 0, 0, NULL, NULL, 'USD', '2026-09-05 19:23:10', '2026-09-05 19:23:10', '2026-09-05 19:23:31', '2026-09-05 19:23:31'),
(14, 1, 'دراسة في الهوية الثقافية (دراسة رقم 1)', 'دراسة-في-الهوية-الثقافية-دراسة-رقم-1', 'د. باحث تجريبي', 'دراسة تحليلية حول دراسة في الهوية الثقافية، تعتمد منهجية بحثية لاستعراض المعطيات والنتائج.', '[{\"id\":\"b1-1\",\"type\":\"text\",\"html\":\"<p>مقدمة حول دراسة في الهوية الثقافية: هذا نص تمهيدي يوضح أهمية الموضوع وسياقه العام، ويأخذ القارئ في جولة سريعة قبل الدخول في التفاصيل.</p>\"},{\"id\":\"b1-2\",\"type\":\"image\",\"url\":\"/uploads/studies-blocks/images/demo1.jpg\",\"alt\":\"صورة توضيحية عن دراسة في الهوية الثقافية\",\"caption\":\"لقطة تعبيرية عن دراسة في الهوية الثقافية\"},{\"id\":\"b1-3\",\"type\":\"image_text\",\"url\":\"/uploads/studies-blocks/images/demo1.jpg\",\"alt\":\"صورة جانبية\",\"html\":\"<p>فقرة مرافقة للصورة تشرح جانبًا من دراسة في الهوية الثقافية بأسلوب سردي مع تفاصيل إضافية تثري الموضوع.</p>\",\"layout\":\"image-right\"},{\"id\":\"b1-4\",\"type\":\"quote\",\"text\":\"دراسة في الهوية الثقافية يفتح آفاقًا جديدة للفهم والتأمل.\",\"author\":\"مقولة مختارة\"},{\"id\":\"b1-5\",\"type\":\"tags\",\"tags\":[\"دراسة في الهوية الثقافية\",\"ثقافة\",\"قراءة\",\"معرفة\"]},{\"id\":\"b1-6\",\"type\":\"pdf\",\"url\":\"/uploads/studies-blocks/pdfs/demo1.pdf\",\"label\":\"ملف PDF مرفق عن دراسة في الهوية الثقافية\",\"access\":\"free\"},{\"id\":\"b1-7\",\"type\":\"voice\",\"url\":\"/uploads/studies-blocks/audio/demo1.mp3\",\"label\":\"تسجيل صوتي حول دراسة في الهوية الثقافية\",\"access\":\"free\"},{\"id\":\"b1-8\",\"type\":\"video\",\"url\":\"/uploads/studies-blocks/videos/demo1.mp4\",\"label\":\"فيديو تعريفي عن دراسة في الهوية الثقافية\",\"access\":\"free\"}]', NULL, NULL, '/uploads/studies/cover1.jpg', '/uploads/studies/main1.jpg', NULL, 'published', 0, 0, NULL, NULL, 'USD', '2026-09-05 19:38:01', '2026-09-05 19:38:01', '2026-09-05 19:38:01', NULL),
(15, 1, 'تحليل الخطاب الإعلامي (دراسة رقم 2)', 'تحليل-الخطاب-الإعلامي-دراسة-رقم-2', 'د. باحثة تجريبية', 'دراسة تحليلية حول تحليل الخطاب الإعلامي، تعتمد منهجية بحثية لاستعراض المعطيات والنتائج.', '[{\"id\":\"b2-1\",\"type\":\"text\",\"html\":\"<p>مقدمة حول تحليل الخطاب الإعلامي: هذا نص تمهيدي يوضح أهمية الموضوع وسياقه العام، ويأخذ القارئ في جولة سريعة قبل الدخول في التفاصيل.</p>\"},{\"id\":\"b2-2\",\"type\":\"image\",\"url\":\"/uploads/studies-blocks/images/demo2.jpg\",\"alt\":\"صورة توضيحية عن تحليل الخطاب الإعلامي\",\"caption\":\"لقطة تعبيرية عن تحليل الخطاب الإعلامي\"},{\"id\":\"b2-3\",\"type\":\"image_text\",\"url\":\"/uploads/studies-blocks/images/demo2.jpg\",\"alt\":\"صورة جانبية\",\"html\":\"<p>فقرة مرافقة للصورة تشرح جانبًا من تحليل الخطاب الإعلامي بأسلوب سردي مع تفاصيل إضافية تثري الموضوع.</p>\",\"layout\":\"image-left\"},{\"id\":\"b2-4\",\"type\":\"quote\",\"text\":\"تحليل الخطاب الإعلامي يفتح آفاقًا جديدة للفهم والتأمل.\",\"author\":\"مقولة مختارة\"},{\"id\":\"b2-5\",\"type\":\"tags\",\"tags\":[\"تحليل الخطاب الإعلامي\",\"ثقافة\",\"قراءة\",\"معرفة\"]},{\"id\":\"b2-6\",\"type\":\"pdf\",\"url\":\"/uploads/studies-blocks/pdfs/demo1.pdf\",\"label\":\"ملف PDF مرفق عن تحليل الخطاب الإعلامي\",\"access\":\"free\"},{\"id\":\"b2-7\",\"type\":\"voice\",\"url\":\"/uploads/studies-blocks/audio/demo1.mp3\",\"label\":\"تسجيل صوتي حول تحليل الخطاب الإعلامي\",\"access\":\"free\"},{\"id\":\"b2-8\",\"type\":\"video\",\"url\":\"/uploads/studies-blocks/videos/demo1.mp4\",\"label\":\"فيديو تعريفي عن تحليل الخطاب الإعلامي\",\"access\":\"free\"}]', NULL, NULL, '/uploads/studies/cover2.jpg', '/uploads/studies/main2.jpg', NULL, 'published', 1, 0, NULL, 21.00, 'USD', '2026-09-05 19:38:01', '2026-09-05 19:38:01', '2026-09-05 19:38:01', NULL),
(16, 1, 'علم الاجتماع الرقمي (دراسة رقم 3)', 'علم-الاجتماع-الرقمي-دراسة-رقم-3', 'د. باحث تجريبي', 'دراسة تحليلية حول علم الاجتماع الرقمي، تعتمد منهجية بحثية لاستعراض المعطيات والنتائج.', '[{\"id\":\"b3-1\",\"type\":\"text\",\"html\":\"<p>مقدمة حول علم الاجتماع الرقمي: هذا نص تمهيدي يوضح أهمية الموضوع وسياقه العام، ويأخذ القارئ في جولة سريعة قبل الدخول في التفاصيل.</p>\"},{\"id\":\"b3-2\",\"type\":\"image\",\"url\":\"/uploads/studies-blocks/images/demo1.jpg\",\"alt\":\"صورة توضيحية عن علم الاجتماع الرقمي\",\"caption\":\"لقطة تعبيرية عن علم الاجتماع الرقمي\"},{\"id\":\"b3-3\",\"type\":\"image_text\",\"url\":\"/uploads/studies-blocks/images/demo1.jpg\",\"alt\":\"صورة جانبية\",\"html\":\"<p>فقرة مرافقة للصورة تشرح جانبًا من علم الاجتماع الرقمي بأسلوب سردي مع تفاصيل إضافية تثري الموضوع.</p>\",\"layout\":\"image-right\"},{\"id\":\"b3-4\",\"type\":\"quote\",\"text\":\"علم الاجتماع الرقمي يفتح آفاقًا جديدة للفهم والتأمل.\",\"author\":\"مقولة مختارة\"},{\"id\":\"b3-5\",\"type\":\"tags\",\"tags\":[\"علم الاجتماع الرقمي\",\"ثقافة\",\"قراءة\",\"معرفة\"]},{\"id\":\"b3-6\",\"type\":\"pdf\",\"url\":\"/uploads/studies-blocks/pdfs/demo1.pdf\",\"label\":\"ملف PDF مرفق عن علم الاجتماع الرقمي\",\"access\":\"premium\"},{\"id\":\"b3-7\",\"type\":\"voice\",\"url\":\"/uploads/studies-blocks/audio/demo1.mp3\",\"label\":\"تسجيل صوتي حول علم الاجتماع الرقمي\",\"access\":\"free\"},{\"id\":\"b3-8\",\"type\":\"video\",\"url\":\"/uploads/studies-blocks/videos/demo1.mp4\",\"label\":\"فيديو تعريفي عن علم الاجتماع الرقمي\",\"access\":\"free\"}]', NULL, NULL, '/uploads/studies/cover3.jpg', '/uploads/studies/main3.jpg', NULL, 'published', 0, 0, NULL, NULL, 'USD', '2026-09-05 19:38:01', '2026-09-05 19:38:01', '2026-09-05 19:38:01', NULL),
(17, 1, 'دراسات ما بعد الاستعمار (دراسة رقم 4)', 'دراسات-ما-بعد-الاستعمار-دراسة-رقم-4', 'د. باحثة تجريبية', 'دراسة تحليلية حول دراسات ما بعد الاستعمار، تعتمد منهجية بحثية لاستعراض المعطيات والنتائج.', '[{\"id\":\"b4-1\",\"type\":\"text\",\"html\":\"<p>مقدمة حول دراسات ما بعد الاستعمار: هذا نص تمهيدي يوضح أهمية الموضوع وسياقه العام، ويأخذ القارئ في جولة سريعة قبل الدخول في التفاصيل.</p>\"},{\"id\":\"b4-2\",\"type\":\"image\",\"url\":\"/uploads/studies-blocks/images/demo2.jpg\",\"alt\":\"صورة توضيحية عن دراسات ما بعد الاستعمار\",\"caption\":\"لقطة تعبيرية عن دراسات ما بعد الاستعمار\"},{\"id\":\"b4-3\",\"type\":\"image_text\",\"url\":\"/uploads/studies-blocks/images/demo2.jpg\",\"alt\":\"صورة جانبية\",\"html\":\"<p>فقرة مرافقة للصورة تشرح جانبًا من دراسات ما بعد الاستعمار بأسلوب سردي مع تفاصيل إضافية تثري الموضوع.</p>\",\"layout\":\"image-left\"},{\"id\":\"b4-4\",\"type\":\"quote\",\"text\":\"دراسات ما بعد الاستعمار يفتح آفاقًا جديدة للفهم والتأمل.\",\"author\":\"مقولة مختارة\"},{\"id\":\"b4-5\",\"type\":\"tags\",\"tags\":[\"دراسات ما بعد الاستعمار\",\"ثقافة\",\"قراءة\",\"معرفة\"]},{\"id\":\"b4-6\",\"type\":\"pdf\",\"url\":\"/uploads/studies-blocks/pdfs/demo1.pdf\",\"label\":\"ملف PDF مرفق عن دراسات ما بعد الاستعمار\",\"access\":\"free\"},{\"id\":\"b4-7\",\"type\":\"voice\",\"url\":\"/uploads/studies-blocks/audio/demo1.mp3\",\"label\":\"تسجيل صوتي حول دراسات ما بعد الاستعمار\",\"access\":\"premium\"},{\"id\":\"b4-8\",\"type\":\"video\",\"url\":\"/uploads/studies-blocks/videos/demo1.mp4\",\"label\":\"فيديو تعريفي عن دراسات ما بعد الاستعمار\",\"access\":\"free\"}]', NULL, NULL, '/uploads/studies/cover4.jpg', '/uploads/studies/main4.jpg', NULL, 'published', 0, 0, NULL, NULL, 'USD', '2026-09-05 19:38:01', '2026-09-05 19:38:01', '2026-09-05 19:38:01', NULL),
(18, 1, 'الاقتصاد السياسي للنشر (دراسة رقم 5)', 'الاقتصاد-السياسي-للنشر-دراسة-رقم-5', 'د. باحث تجريبي', 'دراسة تحليلية حول الاقتصاد السياسي للنشر، تعتمد منهجية بحثية لاستعراض المعطيات والنتائج.', '[{\"id\":\"b5-1\",\"type\":\"text\",\"html\":\"<p>مقدمة حول الاقتصاد السياسي للنشر: هذا نص تمهيدي يوضح أهمية الموضوع وسياقه العام، ويأخذ القارئ في جولة سريعة قبل الدخول في التفاصيل.</p>\"},{\"id\":\"b5-2\",\"type\":\"image\",\"url\":\"/uploads/studies-blocks/images/demo1.jpg\",\"alt\":\"صورة توضيحية عن الاقتصاد السياسي للنشر\",\"caption\":\"لقطة تعبيرية عن الاقتصاد السياسي للنشر\"},{\"id\":\"b5-3\",\"type\":\"image_text\",\"url\":\"/uploads/studies-blocks/images/demo1.jpg\",\"alt\":\"صورة جانبية\",\"html\":\"<p>فقرة مرافقة للصورة تشرح جانبًا من الاقتصاد السياسي للنشر بأسلوب سردي مع تفاصيل إضافية تثري الموضوع.</p>\",\"layout\":\"image-right\"},{\"id\":\"b5-4\",\"type\":\"quote\",\"text\":\"الاقتصاد السياسي للنشر يفتح آفاقًا جديدة للفهم والتأمل.\",\"author\":\"مقولة مختارة\"},{\"id\":\"b5-5\",\"type\":\"tags\",\"tags\":[\"الاقتصاد السياسي للنشر\",\"ثقافة\",\"قراءة\",\"معرفة\"]},{\"id\":\"b5-6\",\"type\":\"pdf\",\"url\":\"/uploads/studies-blocks/pdfs/demo1.pdf\",\"label\":\"ملف PDF مرفق عن الاقتصاد السياسي للنشر\",\"access\":\"free\"},{\"id\":\"b5-7\",\"type\":\"voice\",\"url\":\"/uploads/studies-blocks/audio/demo1.mp3\",\"label\":\"تسجيل صوتي حول الاقتصاد السياسي للنشر\",\"access\":\"free\"},{\"id\":\"b5-8\",\"type\":\"video\",\"url\":\"/uploads/studies-blocks/videos/demo1.mp4\",\"label\":\"فيديو تعريفي عن الاقتصاد السياسي للنشر\",\"access\":\"premium\"}]', NULL, NULL, '/uploads/studies/cover5.jpg', '/uploads/studies/main5.jpg', NULL, 'published', 1, 0, NULL, 24.00, 'USD', '2026-09-05 19:38:01', '2026-09-05 19:38:01', '2026-09-05 19:38:01', NULL),
(19, 1, 'تحولات اللغة العربية (دراسة رقم 6)', 'تحولات-اللغة-العربية-دراسة-رقم-6', 'د. باحثة تجريبية', 'دراسة تحليلية حول تحولات اللغة العربية، تعتمد منهجية بحثية لاستعراض المعطيات والنتائج.', '[{\"id\":\"b6-1\",\"type\":\"text\",\"html\":\"<p>مقدمة حول تحولات اللغة العربية: هذا نص تمهيدي يوضح أهمية الموضوع وسياقه العام، ويأخذ القارئ في جولة سريعة قبل الدخول في التفاصيل.</p>\"},{\"id\":\"b6-2\",\"type\":\"image\",\"url\":\"/uploads/studies-blocks/images/demo2.jpg\",\"alt\":\"صورة توضيحية عن تحولات اللغة العربية\",\"caption\":\"لقطة تعبيرية عن تحولات اللغة العربية\"},{\"id\":\"b6-3\",\"type\":\"image_text\",\"url\":\"/uploads/studies-blocks/images/demo2.jpg\",\"alt\":\"صورة جانبية\",\"html\":\"<p>فقرة مرافقة للصورة تشرح جانبًا من تحولات اللغة العربية بأسلوب سردي مع تفاصيل إضافية تثري الموضوع.</p>\",\"layout\":\"image-left\"},{\"id\":\"b6-4\",\"type\":\"quote\",\"text\":\"تحولات اللغة العربية يفتح آفاقًا جديدة للفهم والتأمل.\",\"author\":\"مقولة مختارة\"},{\"id\":\"b6-5\",\"type\":\"tags\",\"tags\":[\"تحولات اللغة العربية\",\"ثقافة\",\"قراءة\",\"معرفة\"]},{\"id\":\"b6-6\",\"type\":\"pdf\",\"url\":\"/uploads/studies-blocks/pdfs/demo1.pdf\",\"label\":\"ملف PDF مرفق عن تحولات اللغة العربية\",\"access\":\"premium\"},{\"id\":\"b6-7\",\"type\":\"voice\",\"url\":\"/uploads/studies-blocks/audio/demo1.mp3\",\"label\":\"تسجيل صوتي حول تحولات اللغة العربية\",\"access\":\"free\"},{\"id\":\"b6-8\",\"type\":\"video\",\"url\":\"/uploads/studies-blocks/videos/demo1.mp4\",\"label\":\"فيديو تعريفي عن تحولات اللغة العربية\",\"access\":\"free\"}]', NULL, NULL, '/uploads/studies/cover6.jpg', '/uploads/studies/main6.jpg', NULL, 'published', 0, 0, NULL, NULL, 'USD', '2026-09-05 19:38:01', '2026-09-05 19:38:01', '2026-09-05 19:38:01', NULL),
(20, 1, 'دراسات النوع الاجتماعي (دراسة رقم 7)', 'دراسات-النوع-الاجتماعي-دراسة-رقم-7', 'د. باحث تجريبي', 'دراسة تحليلية حول دراسات النوع الاجتماعي، تعتمد منهجية بحثية لاستعراض المعطيات والنتائج.', '[{\"id\":\"b7-1\",\"type\":\"text\",\"html\":\"<p>مقدمة حول دراسات النوع الاجتماعي: هذا نص تمهيدي يوضح أهمية الموضوع وسياقه العام، ويأخذ القارئ في جولة سريعة قبل الدخول في التفاصيل.</p>\"},{\"id\":\"b7-2\",\"type\":\"image\",\"url\":\"/uploads/studies-blocks/images/demo1.jpg\",\"alt\":\"صورة توضيحية عن دراسات النوع الاجتماعي\",\"caption\":\"لقطة تعبيرية عن دراسات النوع الاجتماعي\"},{\"id\":\"b7-3\",\"type\":\"image_text\",\"url\":\"/uploads/studies-blocks/images/demo1.jpg\",\"alt\":\"صورة جانبية\",\"html\":\"<p>فقرة مرافقة للصورة تشرح جانبًا من دراسات النوع الاجتماعي بأسلوب سردي مع تفاصيل إضافية تثري الموضوع.</p>\",\"layout\":\"image-right\"},{\"id\":\"b7-4\",\"type\":\"quote\",\"text\":\"دراسات النوع الاجتماعي يفتح آفاقًا جديدة للفهم والتأمل.\",\"author\":\"مقولة مختارة\"},{\"id\":\"b7-5\",\"type\":\"tags\",\"tags\":[\"دراسات النوع الاجتماعي\",\"ثقافة\",\"قراءة\",\"معرفة\"]},{\"id\":\"b7-6\",\"type\":\"pdf\",\"url\":\"/uploads/studies-blocks/pdfs/demo1.pdf\",\"label\":\"ملف PDF مرفق عن دراسات النوع الاجتماعي\",\"access\":\"free\"},{\"id\":\"b7-7\",\"type\":\"voice\",\"url\":\"/uploads/studies-blocks/audio/demo1.mp3\",\"label\":\"تسجيل صوتي حول دراسات النوع الاجتماعي\",\"access\":\"free\"},{\"id\":\"b7-8\",\"type\":\"video\",\"url\":\"/uploads/studies-blocks/videos/demo1.mp4\",\"label\":\"فيديو تعريفي عن دراسات النوع الاجتماعي\",\"access\":\"free\"}]', NULL, NULL, '/uploads/studies/cover7.jpg', '/uploads/studies/main7.jpg', NULL, 'published', 1, 0, NULL, 26.00, 'USD', '2026-09-05 19:38:01', '2026-09-05 19:38:01', '2026-09-05 19:38:01', NULL),
(21, 1, 'التعليم عن بعد وأثره (دراسة رقم 8)', 'التعليم-عن-بعد-وأثره-دراسة-رقم-8', 'د. باحثة تجريبية', 'دراسة تحليلية حول التعليم عن بعد وأثره، تعتمد منهجية بحثية لاستعراض المعطيات والنتائج.', '[{\"id\":\"b8-1\",\"type\":\"text\",\"html\":\"<p>مقدمة حول التعليم عن بعد وأثره: هذا نص تمهيدي يوضح أهمية الموضوع وسياقه العام، ويأخذ القارئ في جولة سريعة قبل الدخول في التفاصيل.</p>\"},{\"id\":\"b8-2\",\"type\":\"image\",\"url\":\"/uploads/studies-blocks/images/demo2.jpg\",\"alt\":\"صورة توضيحية عن التعليم عن بعد وأثره\",\"caption\":\"لقطة تعبيرية عن التعليم عن بعد وأثره\"},{\"id\":\"b8-3\",\"type\":\"image_text\",\"url\":\"/uploads/studies-blocks/images/demo2.jpg\",\"alt\":\"صورة جانبية\",\"html\":\"<p>فقرة مرافقة للصورة تشرح جانبًا من التعليم عن بعد وأثره بأسلوب سردي مع تفاصيل إضافية تثري الموضوع.</p>\",\"layout\":\"image-left\"},{\"id\":\"b8-4\",\"type\":\"quote\",\"text\":\"التعليم عن بعد وأثره يفتح آفاقًا جديدة للفهم والتأمل.\",\"author\":\"مقولة مختارة\"},{\"id\":\"b8-5\",\"type\":\"tags\",\"tags\":[\"التعليم عن بعد وأثره\",\"ثقافة\",\"قراءة\",\"معرفة\"]},{\"id\":\"b8-6\",\"type\":\"pdf\",\"url\":\"/uploads/studies-blocks/pdfs/demo1.pdf\",\"label\":\"ملف PDF مرفق عن التعليم عن بعد وأثره\",\"access\":\"free\"},{\"id\":\"b8-7\",\"type\":\"voice\",\"url\":\"/uploads/studies-blocks/audio/demo1.mp3\",\"label\":\"تسجيل صوتي حول التعليم عن بعد وأثره\",\"access\":\"premium\"},{\"id\":\"b8-8\",\"type\":\"video\",\"url\":\"/uploads/studies-blocks/videos/demo1.mp4\",\"label\":\"فيديو تعريفي عن التعليم عن بعد وأثره\",\"access\":\"free\"}]', NULL, NULL, '/uploads/studies/cover8.jpg', '/uploads/studies/main8.jpg', NULL, 'published', 0, 0, NULL, NULL, 'USD', '2026-09-05 19:38:01', '2026-09-05 19:38:01', '2026-09-05 19:38:01', NULL),
(22, 1, 'الذكاء الاصطناعي والمجتمع (دراسة رقم 9)', 'الذكاء-الاصطناعي-والمجتمع-دراسة-رقم-9', 'د. باحث تجريبي', 'دراسة تحليلية حول الذكاء الاصطناعي والمجتمع، تعتمد منهجية بحثية لاستعراض المعطيات والنتائج.', '[{\"id\":\"b9-1\",\"type\":\"text\",\"html\":\"<p>مقدمة حول الذكاء الاصطناعي والمجتمع: هذا نص تمهيدي يوضح أهمية الموضوع وسياقه العام، ويأخذ القارئ في جولة سريعة قبل الدخول في التفاصيل.</p>\"},{\"id\":\"b9-2\",\"type\":\"image\",\"url\":\"/uploads/studies-blocks/images/demo1.jpg\",\"alt\":\"صورة توضيحية عن الذكاء الاصطناعي والمجتمع\",\"caption\":\"لقطة تعبيرية عن الذكاء الاصطناعي والمجتمع\"},{\"id\":\"b9-3\",\"type\":\"image_text\",\"url\":\"/uploads/studies-blocks/images/demo1.jpg\",\"alt\":\"صورة جانبية\",\"html\":\"<p>فقرة مرافقة للصورة تشرح جانبًا من الذكاء الاصطناعي والمجتمع بأسلوب سردي مع تفاصيل إضافية تثري الموضوع.</p>\",\"layout\":\"image-right\"},{\"id\":\"b9-4\",\"type\":\"quote\",\"text\":\"الذكاء الاصطناعي والمجتمع يفتح آفاقًا جديدة للفهم والتأمل.\",\"author\":\"مقولة مختارة\"},{\"id\":\"b9-5\",\"type\":\"tags\",\"tags\":[\"الذكاء الاصطناعي والمجتمع\",\"ثقافة\",\"قراءة\",\"معرفة\"]},{\"id\":\"b9-6\",\"type\":\"pdf\",\"url\":\"/uploads/studies-blocks/pdfs/demo1.pdf\",\"label\":\"ملف PDF مرفق عن الذكاء الاصطناعي والمجتمع\",\"access\":\"premium\"},{\"id\":\"b9-7\",\"type\":\"voice\",\"url\":\"/uploads/studies-blocks/audio/demo1.mp3\",\"label\":\"تسجيل صوتي حول الذكاء الاصطناعي والمجتمع\",\"access\":\"free\"},{\"id\":\"b9-8\",\"type\":\"video\",\"url\":\"/uploads/studies-blocks/videos/demo1.mp4\",\"label\":\"فيديو تعريفي عن الذكاء الاصطناعي والمجتمع\",\"access\":\"free\"}]', NULL, NULL, '/uploads/studies/cover9.jpg', '/uploads/studies/main9.jpg', NULL, 'published', 0, 0, NULL, NULL, 'USD', '2026-09-05 19:38:01', '2026-09-05 19:38:01', '2026-09-05 19:38:01', NULL),
(23, 1, 'دراسة في تاريخ الأفكار (دراسة رقم 10)', 'دراسة-في-تاريخ-الأفكار-دراسة-رقم-10', 'د. باحثة تجريبية', 'دراسة تحليلية حول دراسة في تاريخ الأفكار، تعتمد منهجية بحثية لاستعراض المعطيات والنتائج.', '[{\"id\":\"b10-1\",\"type\":\"text\",\"html\":\"<p>مقدمة حول دراسة في تاريخ الأفكار: هذا نص تمهيدي يوضح أهمية الموضوع وسياقه العام، ويأخذ القارئ في جولة سريعة قبل الدخول في التفاصيل.</p>\"},{\"id\":\"b10-2\",\"type\":\"image\",\"url\":\"/uploads/studies-blocks/images/demo2.jpg\",\"alt\":\"صورة توضيحية عن دراسة في تاريخ الأفكار\",\"caption\":\"لقطة تعبيرية عن دراسة في تاريخ الأفكار\"},{\"id\":\"b10-3\",\"type\":\"image_text\",\"url\":\"/uploads/studies-blocks/images/demo2.jpg\",\"alt\":\"صورة جانبية\",\"html\":\"<p>فقرة مرافقة للصورة تشرح جانبًا من دراسة في تاريخ الأفكار بأسلوب سردي مع تفاصيل إضافية تثري الموضوع.</p>\",\"layout\":\"image-left\"},{\"id\":\"b10-4\",\"type\":\"quote\",\"text\":\"دراسة في تاريخ الأفكار يفتح آفاقًا جديدة للفهم والتأمل.\",\"author\":\"مقولة مختارة\"},{\"id\":\"b10-5\",\"type\":\"tags\",\"tags\":[\"دراسة في تاريخ الأفكار\",\"ثقافة\",\"قراءة\",\"معرفة\"]},{\"id\":\"b10-6\",\"type\":\"pdf\",\"url\":\"/uploads/studies-blocks/pdfs/demo1.pdf\",\"label\":\"ملف PDF مرفق عن دراسة في تاريخ الأفكار\",\"access\":\"free\"},{\"id\":\"b10-7\",\"type\":\"voice\",\"url\":\"/uploads/studies-blocks/audio/demo1.mp3\",\"label\":\"تسجيل صوتي حول دراسة في تاريخ الأفكار\",\"access\":\"free\"},{\"id\":\"b10-8\",\"type\":\"video\",\"url\":\"/uploads/studies-blocks/videos/demo1.mp4\",\"label\":\"فيديو تعريفي عن دراسة في تاريخ الأفكار\",\"access\":\"premium\"}]', NULL, NULL, '/uploads/studies/cover10.jpg', '/uploads/studies/main10.jpg', NULL, 'published', 1, 0, NULL, 29.00, 'USD', '2026-09-05 19:38:01', '2026-09-05 19:38:01', '2026-09-05 19:38:01', NULL),
(24, NULL, '?????? ??? ???????', 'study-7', NULL, NULL, NULL, NULL, NULL, '/uploads/studies/6b509726-673f-41bc-9b9d-250cb9ec3c4a.jpg', NULL, NULL, 'draft', 0, 0, NULL, NULL, 'USD', NULL, '2026-09-05 21:40:42', '2026-09-05 21:40:46', '2026-09-05 21:40:46'),
(25, NULL, '????? ????? ??????', 'study-8', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'published', 0, 1, '2020-01-01 00:00:00', NULL, 'USD', '2026-09-12 09:30:08', '2026-09-12 09:30:07', '2026-09-12 09:30:23', '2026-09-12 09:30:23'),
(26, NULL, '????? ????? ??? ??? ???????', 'study-9', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'published', 0, 1, '2030-01-01 00:00:00', NULL, 'USD', '2026-09-12 09:30:08', '2026-09-12 09:30:08', '2026-09-12 09:30:23', '2026-09-12 09:30:23');

-- --------------------------------------------------------

--
-- Table structure for table `studies_categories`
--

CREATE TABLE `studies_categories` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `studies_categories`
--

INSERT INTO `studies_categories` (`id`, `name`, `slug`, `description`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'تصنيف رقم 1', 'تصنيف-رقم-1', NULL, '2026-08-08 10:31:15', '2026-08-08 10:31:15', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `studies_categories_translations`
--

CREATE TABLE `studies_categories_translations` (
  `id` int UNSIGNED NOT NULL,
  `category_id` int UNSIGNED NOT NULL,
  `locale` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `studies_categories_translations`
--

INSERT INTO `studies_categories_translations` (`id`, `category_id`, `locale`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 1, 'en', 'Category 1', NULL, '2026-09-19 19:47:04', '2026-09-19 19:47:04'),
(2, 1, 'de', 'Kategorie 1', NULL, '2026-09-19 19:47:04', '2026-09-19 19:47:04');

-- --------------------------------------------------------

--
-- Table structure for table `study_purchases`
--

CREATE TABLE `study_purchases` (
  `id` int UNSIGNED NOT NULL,
  `subscriber_id` int UNSIGNED NOT NULL,
  `study_id` int UNSIGNED NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `currency` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `status` enum('pending','completed','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `tap_charge_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `study_translations`
--

CREATE TABLE `study_translations` (
  `id` int UNSIGNED NOT NULL,
  `study_id` int UNSIGNED NOT NULL,
  `locale` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(280) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content_blocks` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `study_translations`
--

INSERT INTO `study_translations` (`id`, `study_id`, `locale`, `title`, `slug`, `description`, `content_blocks`, `created_at`, `updated_at`) VALUES
(2, 1, 'en', 'Study Number 1', 'study-number-one', 'Study Number 1 — a short preview excerpt used to test how descriptions display across the site.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(3, 1, 'de', 'Studie Nummer 1', 'studie-nummer-eins', 'Studie Nummer 1 – ein kurzer Vorschautext, der zeigt, wie Beschreibungen auf der Seite dargestellt werden.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(4, 7, 'en', 'The Impact of Early Reading on Academic Achievement', 'impact-of-early-reading-on-academic-achievement', 'An analytical study on the relationship between early childhood reading and later academic achievement.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(5, 7, 'de', 'Der Einfluss frühen Lesens auf den schulischen Erfolg', 'einfluss-fruehen-lesens-auf-schulischen-erfolg', 'Eine analytische Studie über den Zusammenhang zwischen frühkindlichem Lesen und späterem schulischem Erfolg.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(6, 8, 'en', 'The State of Arabic Digital Publishing', 'state-of-arabic-digital-publishing', 'A field study on the shifts in the Arabic publishing industry amid digital transformation.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(7, 8, 'de', 'Der Stand des arabischen digitalen Verlagswesens', 'stand-des-arabischen-digitalen-verlagswesens', 'Eine Feldstudie über den Wandel der arabischen Verlagsbranche im Zuge der digitalen Transformation.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(8, 9, 'en', 'Analyzing Reading Trends Among Arab Youth', 'analyzing-reading-trends-among-arab-youth', 'A survey and analysis of reading habits and interests among young people in the Arab world.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(9, 9, 'de', 'Analyse der Lesetrends unter arabischen Jugendlichen', 'analyse-der-lesetrends-unter-arabischen-jugendlichen', 'Eine Umfrage und Analyse der Lesegewohnheiten und Interessen junger Menschen in der arabischen Welt.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(10, 10, 'en', 'The Role of Independent Publishers in Supporting New Writers', 'role-of-independent-publishers-supporting-new-writers', 'A study on how independent publishers discover and support emerging literary talent.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(11, 10, 'de', 'Die Rolle unabhängiger Verlage bei der Förderung neuer Autoren', 'rolle-unabhaengiger-verlage-foerderung-neuer-autoren', 'Eine Studie darüber, wie unabhängige Verlage aufstrebende literarische Talente entdecken und fördern.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(12, 11, 'en', 'The Impact of Translation on the Global Reach of Arabic Literature', 'impact-of-translation-on-global-reach-of-arabic-literature', 'A study on the role of translation in bringing Arabic literature to non-Arabic-speaking readers.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(13, 11, 'de', 'Der Einfluss der Übersetzung auf die weltweite Verbreitung arabischer Literatur', 'einfluss-der-uebersetzung-auf-verbreitung-arabischer-literatur', 'Eine Studie über die Rolle der Übersetzung bei der Vermittlung arabischer Literatur an nicht arabischsprachige Leser.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(14, 14, 'en', 'A Study on Cultural Identity (Study No. 1)', 'study-on-cultural-identity-study-no-1', 'An analytical study on cultural identity, using a research methodology to present data and findings.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(15, 14, 'de', 'Eine Studie zur kulturellen Identität (Studie Nr. 1)', 'studie-zur-kulturellen-identitaet-studie-nr-1', 'Eine analytische Studie zur kulturellen Identität, die eine Forschungsmethodik zur Darstellung von Daten und Ergebnissen anwendet.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(16, 15, 'en', 'Media Discourse Analysis (Study No. 2)', 'media-discourse-analysis-study-no-2', 'An analytical study on media discourse analysis, using a research methodology to present data and findings.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(17, 15, 'de', 'Analyse des Mediendiskurses (Studie Nr. 2)', 'analyse-des-mediendiskurses-studie-nr-2', 'Eine analytische Studie zur Medienanalyse, die eine Forschungsmethodik zur Darstellung von Daten und Ergebnissen anwendet.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(18, 16, 'en', 'Digital Sociology (Study No. 3)', 'digital-sociology-study-no-3', 'An analytical study on digital sociology, using a research methodology to present data and findings.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(19, 16, 'de', 'Digitale Soziologie (Studie Nr. 3)', 'digitale-soziologie-studie-nr-3', 'Eine analytische Studie zur digitalen Soziologie, die eine Forschungsmethodik zur Darstellung von Daten und Ergebnissen anwendet.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(20, 17, 'en', 'Postcolonial Studies (Study No. 4)', 'postcolonial-studies-study-no-4', 'An analytical study on postcolonial studies, using a research methodology to present data and findings.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(21, 17, 'de', 'Postkoloniale Studien (Studie Nr. 4)', 'postkoloniale-studien-studie-nr-4', 'Eine analytische Studie zu postkolonialen Studien, die eine Forschungsmethodik zur Darstellung von Daten und Ergebnissen anwendet.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(22, 18, 'en', 'The Political Economy of Publishing (Study No. 5)', 'political-economy-of-publishing-study-no-5', 'An analytical study on the political economy of publishing, using a research methodology to present data and findings.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(23, 18, 'de', 'Die politische Ökonomie des Verlagswesens (Studie Nr. 5)', 'politische-oekonomie-des-verlagswesens-studie-nr-5', 'Eine analytische Studie zur politischen Ökonomie des Verlagswesens, die eine Forschungsmethodik zur Darstellung von Daten und Ergebnissen anwendet.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(24, 19, 'en', 'Transformations of the Arabic Language (Study No. 6)', 'transformations-of-arabic-language-study-no-6', 'An analytical study on the transformations of the Arabic language, using a research methodology to present data and findings.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(25, 19, 'de', 'Wandel der arabischen Sprache (Studie Nr. 6)', 'wandel-der-arabischen-sprache-studie-nr-6', 'Eine analytische Studie zum Wandel der arabischen Sprache, die eine Forschungsmethodik zur Darstellung von Daten und Ergebnissen anwendet.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(26, 20, 'en', 'Gender Studies (Study No. 7)', 'gender-studies-study-no-7', 'An analytical study on gender studies, using a research methodology to present data and findings.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(27, 20, 'de', 'Geschlechterstudien (Studie Nr. 7)', 'geschlechterstudien-studie-nr-7', 'Eine analytische Studie zu Geschlechterstudien, die eine Forschungsmethodik zur Darstellung von Daten und Ergebnissen anwendet.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(28, 21, 'en', 'Distance Learning and Its Impact (Study No. 8)', 'distance-learning-and-its-impact-study-no-8', 'An analytical study on distance learning and its impact, using a research methodology to present data and findings.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(29, 21, 'de', 'Fernunterricht und seine Auswirkungen (Studie Nr. 8)', 'fernunterricht-und-seine-auswirkungen-studie-nr-8', 'Eine analytische Studie zum Fernunterricht und seinen Auswirkungen, die eine Forschungsmethodik zur Darstellung von Daten und Ergebnissen anwendet.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(30, 22, 'en', 'Artificial Intelligence and Society (Study No. 9)', 'artificial-intelligence-and-society-study-no-9', 'An analytical study on artificial intelligence and society, using a research methodology to present data and findings.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(31, 22, 'de', 'Künstliche Intelligenz und Gesellschaft (Studie Nr. 9)', 'kuenstliche-intelligenz-und-gesellschaft-studie-nr-9', 'Eine analytische Studie zu künstlicher Intelligenz und Gesellschaft, die eine Forschungsmethodik zur Darstellung von Daten und Ergebnissen anwendet.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(32, 23, 'en', 'A Study in the History of Ideas (Study No. 10)', 'study-in-history-of-ideas-study-no-10', 'An analytical study on the history of ideas, using a research methodology to present data and findings.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05'),
(33, 23, 'de', 'Eine Studie zur Ideengeschichte (Studie Nr. 10)', 'studie-zur-ideengeschichte-studie-nr-10', 'Eine analytische Studie zur Ideengeschichte, die eine Forschungsmethodik zur Darstellung von Daten und Ergebnissen anwendet.', NULL, '2026-09-19 19:47:05', '2026-09-19 19:47:05');

-- --------------------------------------------------------

--
-- Table structure for table `subscribers`
--

CREATE TABLE `subscribers` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `profile_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_type` enum('reader','writer') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'reader',
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `current_tier` enum('none','beginner','verified') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'none',
  `tier_expires_at` datetime DEFAULT NULL,
  `blog_access_expires_at` datetime DEFAULT NULL,
  `studies_access_expires_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subscribers`
--

INSERT INTO `subscribers` (`id`, `name`, `bio`, `profile_image`, `email`, `account_type`, `password_hash`, `current_tier`, `tier_expires_at`, `blog_access_expires_at`, `studies_access_expires_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(9, 'مشترك تجريبي', NULL, NULL, 'blog-subscriber@example.com', 'reader', '$2b$12$aoS65DgHd2N1Kdrwvlqko.j1bzu/WCrL5mZ7dp3kf/123blVon4rG', 'none', NULL, '2027-08-18 17:02:12', NULL, '2026-08-18 17:02:05', '2026-08-18 17:02:12', NULL),
(13, 'تيست 1', NULL, NULL, 'test@substq.com', 'reader', '$2b$12$mxGiFgG9tdu4S/xPThVekOlehA2SAHfMKV4qxY84jcFmrhy.TghiK', 'none', NULL, NULL, NULL, '2026-08-21 18:14:19', '2026-08-21 18:14:19', NULL),
(14, 'تيست الاشتراك', NULL, NULL, 't1est@substq.com', 'reader', '$2b$12$VLghbvGU22PZR0Lxo9JjaO7hW.Je2OdukyZSd5L77EyDyDD8GGAVi', 'none', NULL, NULL, NULL, '2026-08-21 18:15:51', '2026-08-21 18:15:51', NULL),
(18, 'قارئ تجريبي', NULL, NULL, 'reader.test@example.com', 'reader', '$2b$12$JZdfoc1axNdnkzXXy4ukSObbZQZlkWkR5.etMdHs93PKxg3kPdvWy', 'none', NULL, NULL, NULL, '2026-08-29 17:32:13', '2026-08-29 17:32:13', NULL),
(19, 'كاتب بدون باقة', NULL, NULL, 'writer.none.test@example.com', 'writer', '$2b$12$uoMDivJHbzS8xqHv5fto4uSQth3E4uHq/YOOfselj8rqsQUK7.Buy', 'none', NULL, NULL, NULL, '2026-08-29 17:32:14', '2026-08-29 17:48:38', NULL),
(20, 'كاتب مبتدئ', NULL, NULL, 'writer.beginner.test@example.com', 'writer', '$2b$12$9BaUrMDwGd3c5I94s.2nq.AqDMiqqrsugpg8FZsucpAm38ehsQpk2', 'beginner', '2027-08-29 17:32:19', NULL, NULL, '2026-08-29 17:32:14', '2026-08-29 17:32:19', NULL),
(21, 'كاتب موثق', NULL, NULL, 'writer.verified.test@example.com', 'writer', '$2b$12$JrHKWeWJJkMp36umLrQjruZVnxNHiKrOY70gzTXLWgNDmBSmc9F5y', 'verified', '2027-08-29 17:32:19', NULL, NULL, '2026-08-29 17:32:14', '2026-08-29 17:32:19', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` int UNSIGNED NOT NULL,
  `subscriber_id` int UNSIGNED NOT NULL,
  `plan_id` int UNSIGNED NOT NULL,
  `status` enum('pending','active','expired','cancelled','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `tap_charge_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_provider` enum('tap','paypal') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'tap',
  `paypal_order_id` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `starts_at` datetime DEFAULT NULL,
  `ends_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscription_plans`
--

CREATE TABLE `subscription_plans` (
  `id` int UNSIGNED NOT NULL,
  `tier` enum('beginner','verified') COLLATE utf8mb4_unicode_ci NOT NULL,
  `billing_cycle` enum('monthly','annual') COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `currency` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subscription_plans`
--

INSERT INTO `subscription_plans` (`id`, `tier`, `billing_cycle`, `price`, `currency`, `created_at`, `updated_at`) VALUES
(1, 'beginner', 'monthly', 10.00, 'USD', '2026-08-12 17:53:46', '2026-08-21 18:24:08'),
(2, 'beginner', 'annual', 100.00, 'USD', '2026-08-12 17:53:46', '2026-08-21 18:24:08'),
(3, 'verified', 'monthly', 20.00, 'USD', '2026-08-12 17:53:46', '2026-08-21 18:24:08'),
(4, 'verified', 'annual', 200.00, 'USD', '2026-08-12 17:53:46', '2026-08-21 18:24:08');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','moderator') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `last_login_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `is_active`, `last_login_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Admin', 'subs@dadd-initiative.org', '$2b$12$Xe/EqAeQDLOXh.P1Ii/Q9uI1aemL0zjm24.2oyYzYtirPgqHK.Lzm', 'admin', 1, '2026-09-19 16:16:28', '2026-07-27 06:10:21', '2026-09-19 16:16:28', NULL),
(2, 'مشرف تجريبي', 'moderator.qa@example.com', '$2b$12$9xNPrZYfaZgjFFjFNGLarO7QK0j/lJrdryh3pyAtLFrb0PlDiYCjK', 'moderator', 1, '2026-08-10 21:27:35', '2026-08-10 21:27:35', '2026-08-10 21:27:35', '2026-08-10 21:27:35'),
(3, 'مشرف تجريبي 2', 'moderator.qa2@example.com', '$2b$12$AB1FGroRyk8YU.HCBeIHF.oWdKUTpOiwZdJBEOj8fug5Tlzx.6EGG', 'moderator', 1, '2026-08-10 21:28:28', '2026-08-10 21:28:28', '2026-08-10 21:31:57', '2026-08-10 21:31:57'),
(5, 'مشرف تجريبي', 'moderator.qa.final@example.com', '$2b$12$7G8JMbslNi5Y5oSyYYIkruoI6.mM9cwp7D1Bn0SoKvdUOLTrng2Je', 'moderator', 1, '2026-08-10 21:32:26', '2026-08-10 21:32:26', '2026-08-10 21:32:26', '2026-08-10 21:32:26');

-- --------------------------------------------------------

--
-- Table structure for table `writer_upgrade_requests`
--

CREATE TABLE `writer_upgrade_requests` (
  `id` int UNSIGNED NOT NULL,
  `subscriber_id` int UNSIGNED NOT NULL,
  `status` enum('pending','invited','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `reason` text COLLATE utf8mb4_unicode_ci,
  `decided_by` int UNSIGNED DEFAULT NULL,
  `decided_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about_features`
--
ALTER TABLE `about_features`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_about_features_sort` (`sort_order`);

--
-- Indexes for table `about_feature_translations`
--
ALTER TABLE `about_feature_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_about_feature_translations` (`feature_id`,`locale`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_banners_active_sort` (`is_active`,`sort_order`);

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_blogs_slug` (`slug`),
  ADD KEY `idx_blogs_status` (`status`),
  ADD KEY `fk_blogs_category` (`category_id`),
  ADD KEY `fk_blogs_author` (`author_id`),
  ADD KEY `fk_blogs_submitted_by` (`submitted_by_subscriber_id`),
  ADD KEY `fk_blogs_reviewed_by` (`reviewed_by`),
  ADD KEY `idx_blogs_review_status` (`review_status`);

--
-- Indexes for table `blogs_categories`
--
ALTER TABLE `blogs_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_blogs_categories_slug` (`slug`);

--
-- Indexes for table `blogs_categories_translations`
--
ALTER TABLE `blogs_categories_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_blogs_categories_translations` (`category_id`,`locale`);

--
-- Indexes for table `blog_translations`
--
ALTER TABLE `blog_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_blog_translations_blog_locale` (`blog_id`,`locale`),
  ADD UNIQUE KEY `uq_blog_translations_locale_slug` (`locale`,`slug`);

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_books_slug` (`slug`),
  ADD KEY `idx_books_status` (`status`),
  ADD KEY `fk_books_category` (`category_id`),
  ADD KEY `fk_books_pricing_tier` (`pricing_tier_id`);

--
-- Indexes for table `books_categories`
--
ALTER TABLE `books_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_books_categories_slug` (`slug`);

--
-- Indexes for table `books_categories_translations`
--
ALTER TABLE `books_categories_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_books_categories_translations` (`category_id`,`locale`);

--
-- Indexes for table `book_external_links`
--
ALTER TABLE `book_external_links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_book_external_links_book` (`book_id`);

--
-- Indexes for table `book_pricing_tiers`
--
ALTER TABLE `book_pricing_tiers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_book_pricing_tier_key` (`tier_key`);

--
-- Indexes for table `book_translations`
--
ALTER TABLE `book_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_book_translations` (`book_id`,`locale`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_contact_messages_is_read` (`is_read`),
  ADD KEY `idx_contact_messages_subject` (`subject`);

--
-- Indexes for table `content_access_subscriptions`
--
ALTER TABLE `content_access_subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_content_access_subscriber` (`subscriber_id`),
  ADD KEY `fk_content_access_plan` (`plan_id`);

--
-- Indexes for table `content_subscription_plans`
--
ALTER TABLE `content_subscription_plans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_content_plan` (`category`,`billing_cycle`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_favorite` (`subscriber_id`,`item_type`,`item_id`);

--
-- Indexes for table `join_requests`
--
ALTER TABLE `join_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_join_requests_is_read` (`is_read`),
  ADD KEY `idx_join_requests_type` (`request_type`);

--
-- Indexes for table `newsletter_signups`
--
ALTER TABLE `newsletter_signups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_newsletter_signup` (`email`,`category_slug`);

--
-- Indexes for table `news_ticker_items`
--
ALTER TABLE `news_ticker_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `news_ticker_item_translations`
--
ALTER TABLE `news_ticker_item_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_news_ticker_item_translations` (`item_id`,`locale`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `site_ads`
--
ALTER TABLE `site_ads`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `site_ad_translations`
--
ALTER TABLE `site_ad_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_site_ad_translations_ad_locale` (`ad_id`,`locale`);

--
-- Indexes for table `social_links`
--
ALTER TABLE `social_links`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_social_links_platform` (`settings_id`,`platform`);

--
-- Indexes for table `studies`
--
ALTER TABLE `studies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_studies_slug` (`slug`),
  ADD KEY `idx_studies_status` (`status`),
  ADD KEY `fk_studies_category` (`category_id`);

--
-- Indexes for table `studies_categories`
--
ALTER TABLE `studies_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_studies_categories_slug` (`slug`);

--
-- Indexes for table `studies_categories_translations`
--
ALTER TABLE `studies_categories_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_studies_categories_translations` (`category_id`,`locale`);

--
-- Indexes for table `study_purchases`
--
ALTER TABLE `study_purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_study_purchases_subscriber` (`subscriber_id`),
  ADD KEY `fk_study_purchases_study` (`study_id`);

--
-- Indexes for table `study_translations`
--
ALTER TABLE `study_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_study_translations_study_locale` (`study_id`,`locale`),
  ADD UNIQUE KEY `uq_study_translations_locale_slug` (`locale`,`slug`);

--
-- Indexes for table `subscribers`
--
ALTER TABLE `subscribers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_subscribers_email` (`email`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_subscriptions_subscriber` (`subscriber_id`),
  ADD KEY `fk_subscriptions_plan` (`plan_id`);

--
-- Indexes for table `subscription_plans`
--
ALTER TABLE `subscription_plans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_plan_tier_cycle` (`tier`,`billing_cycle`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_users_email` (`email`);

--
-- Indexes for table `writer_upgrade_requests`
--
ALTER TABLE `writer_upgrade_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_writer_upgrade_decided_by` (`decided_by`),
  ADD KEY `idx_writer_upgrade_subscriber` (`subscriber_id`,`created_at`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `about_features`
--
ALTER TABLE `about_features`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `about_feature_translations`
--
ALTER TABLE `about_feature_translations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `blogs_categories`
--
ALTER TABLE `blogs_categories`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `blogs_categories_translations`
--
ALTER TABLE `blogs_categories_translations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `blog_translations`
--
ALTER TABLE `blog_translations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `books_categories`
--
ALTER TABLE `books_categories`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `books_categories_translations`
--
ALTER TABLE `books_categories_translations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `book_external_links`
--
ALTER TABLE `book_external_links`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `book_pricing_tiers`
--
ALTER TABLE `book_pricing_tiers`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `book_translations`
--
ALTER TABLE `book_translations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `content_access_subscriptions`
--
ALTER TABLE `content_access_subscriptions`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `content_subscription_plans`
--
ALTER TABLE `content_subscription_plans`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `join_requests`
--
ALTER TABLE `join_requests`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `newsletter_signups`
--
ALTER TABLE `newsletter_signups`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `news_ticker_items`
--
ALTER TABLE `news_ticker_items`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `news_ticker_item_translations`
--
ALTER TABLE `news_ticker_item_translations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `site_ads`
--
ALTER TABLE `site_ads`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `site_ad_translations`
--
ALTER TABLE `site_ad_translations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `social_links`
--
ALTER TABLE `social_links`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `studies`
--
ALTER TABLE `studies`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `studies_categories`
--
ALTER TABLE `studies_categories`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `studies_categories_translations`
--
ALTER TABLE `studies_categories_translations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `study_purchases`
--
ALTER TABLE `study_purchases`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `study_translations`
--
ALTER TABLE `study_translations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `subscribers`
--
ALTER TABLE `subscribers`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `subscription_plans`
--
ALTER TABLE `subscription_plans`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `writer_upgrade_requests`
--
ALTER TABLE `writer_upgrade_requests`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `about_feature_translations`
--
ALTER TABLE `about_feature_translations`
  ADD CONSTRAINT `fk_about_feature_translations_feature` FOREIGN KEY (`feature_id`) REFERENCES `about_features` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `fk_blogs_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_blogs_category` FOREIGN KEY (`category_id`) REFERENCES `blogs_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_blogs_reviewed_by` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_blogs_submitted_by` FOREIGN KEY (`submitted_by_subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `blogs_categories_translations`
--
ALTER TABLE `blogs_categories_translations`
  ADD CONSTRAINT `fk_blogs_categories_translations_category` FOREIGN KEY (`category_id`) REFERENCES `blogs_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `blog_translations`
--
ALTER TABLE `blog_translations`
  ADD CONSTRAINT `fk_blog_translations_blog` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `fk_books_category` FOREIGN KEY (`category_id`) REFERENCES `books_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_books_pricing_tier` FOREIGN KEY (`pricing_tier_id`) REFERENCES `book_pricing_tiers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `books_categories_translations`
--
ALTER TABLE `books_categories_translations`
  ADD CONSTRAINT `fk_books_categories_translations_category` FOREIGN KEY (`category_id`) REFERENCES `books_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `book_external_links`
--
ALTER TABLE `book_external_links`
  ADD CONSTRAINT `fk_book_external_links_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `book_translations`
--
ALTER TABLE `book_translations`
  ADD CONSTRAINT `fk_book_translations_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `content_access_subscriptions`
--
ALTER TABLE `content_access_subscriptions`
  ADD CONSTRAINT `fk_content_access_plan` FOREIGN KEY (`plan_id`) REFERENCES `content_subscription_plans` (`id`),
  ADD CONSTRAINT `fk_content_access_subscriber` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `fk_favorites_subscriber` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `news_ticker_item_translations`
--
ALTER TABLE `news_ticker_item_translations`
  ADD CONSTRAINT `fk_news_ticker_item_translations_item` FOREIGN KEY (`item_id`) REFERENCES `news_ticker_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `site_ad_translations`
--
ALTER TABLE `site_ad_translations`
  ADD CONSTRAINT `fk_site_ad_translations_ad` FOREIGN KEY (`ad_id`) REFERENCES `site_ads` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `social_links`
--
ALTER TABLE `social_links`
  ADD CONSTRAINT `fk_social_links_settings` FOREIGN KEY (`settings_id`) REFERENCES `settings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `studies`
--
ALTER TABLE `studies`
  ADD CONSTRAINT `fk_studies_category` FOREIGN KEY (`category_id`) REFERENCES `studies_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `studies_categories_translations`
--
ALTER TABLE `studies_categories_translations`
  ADD CONSTRAINT `fk_studies_categories_translations_category` FOREIGN KEY (`category_id`) REFERENCES `studies_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `study_purchases`
--
ALTER TABLE `study_purchases`
  ADD CONSTRAINT `fk_study_purchases_study` FOREIGN KEY (`study_id`) REFERENCES `studies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_study_purchases_subscriber` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `study_translations`
--
ALTER TABLE `study_translations`
  ADD CONSTRAINT `fk_study_translations_study` FOREIGN KEY (`study_id`) REFERENCES `studies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `fk_subscriptions_plan` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans` (`id`),
  ADD CONSTRAINT `fk_subscriptions_subscriber` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `writer_upgrade_requests`
--
ALTER TABLE `writer_upgrade_requests`
  ADD CONSTRAINT `fk_writer_upgrade_decided_by` FOREIGN KEY (`decided_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_writer_upgrade_subscriber` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
