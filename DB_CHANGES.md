# Database & Dummy Data Changelog

This file tracks every schema change and dummy-data update so that anyone
pulling the repo — human or AI agent — can see what changed and bring their
local database up to date without a live handoff.

## How to sync after pulling

From `backend/`:

```
node database/runMigration.js database/migrations/<any file not yet applied>
npm run db:seed
```

`npm run db:seed` (= `node database/seed.js`) loads `database/seedData.json`
into your local database and copies `database/seed-assets/` into
`backend/uploads/`. It only touches demo/dummy content — books, blogs,
studies, categories, translations, site settings, banners, ads, pricing
tiers, subscription plans, content trials. It never touches real accounts,
orders, billing, or messages (those tables aren't in the seed at all). It's
safe to re-run any time — it upserts by primary key, so it won't duplicate
rows, and it never overwrites files you already have in `uploads/`.

If you're not sure which migrations you're missing, just run every file in
`backend/database/migrations/` in numeric order — each one is idempotent
(`CREATE TABLE IF NOT EXISTS`, etc.), so re-running an already-applied one is
harmless.

## How to update this file after making changes (for whoever is developing)

1. Run/create your migration as usual (`database/migrations/NNN_*.sql`,
   mirrored into `schema.sql`).
2. If you added or edited any dummy/demo data (a new demo book, category,
   ticker message, translation, uploaded image, etc.), run
   `npm run db:export-seed` (= `node database/exportSeedData.js`) from
   `backend/` — it re-dumps the current content tables into
   `database/seedData.json` and re-copies `backend/uploads/` into
   `database/seed-assets/`.
3. Commit `seedData.json`, `seed-assets/` (if changed), and the new
   migration together.
4. Add a dated entry below.

---

## 2026-10-01 — Optional study type on studies

- Migration `038_add_study_type_to_studies.sql`: added nullable `studies.study_type`
  (`analytical_study` | `report` | `policy_brief` | `research_paper`), chosen from a
  dropdown in the study form. Labels live in the frontend dictionaries; the type
  shows as a chip on the study and as `articleSection` in its JSON-LD. No demo
  study has a type set.

## 2026-10-01 — Optional article type on blogs

- Migration `037_add_article_type_to_blogs.sql`: added nullable `blogs.article_type`
  (`news` | `analysis` | `opinion` | `interview` | `book_review`), chosen from a
  dropdown in the blog form. Labels live in the frontend dictionaries; the type
  shows as a chip on the post and as `articleSection` in its JSON-LD. No demo
  blog has a type set.

## 2026-10-01 — Optional ISBN on books

- Migration `036_add_isbn_to_books.sql`: added nullable `books.isbn` (VARCHAR(13),
  digits only, plus a trailing X for ISBN-10). Entered by the editor, validated
  with the ISBN check digit, shown on the book page and in its `Book` JSON-LD
  only when present. No demo book has an ISBN. The seed export also picked up
  unrelated local drift (a soft-deleted test ad, newer `updated_at` values).

## 2026-09-27 — Stats strip is now translatable per locale

- Migration `035_add_stats_to_translations.sql`: added `stats` to
  `blog_translations` and `study_translations` too. The stats strip now
  follows the same hide-model as every other translated field on these
  tables — a locale shows its own translated numbers/titles, with no
  fallback to Arabic. The translation editor pre-fills from the Arabic
  stats (like it already does for content sections) so the admin only has
  to translate the wording, not re-enter the numbers.

## 2026-09-27 — Bulk study import from Excel; blog/study "stats" strip

- Migration `034_add_stats_to_blogs_and_studies.sql`: added `stats` (TEXT,
  nullable JSON) to both `blogs` and `studies` — up to 6 admin-entered
  "number + title" pairs (e.g. "500" / "مشارك") shown as a stats strip right
  under the post header. Optional; hidden entirely when empty. Originally
  shipped without per-locale translation — see the entry above for that.
- Added bulk study import via Excel (`/admin/dashboard/studies/import`,
  template at `frontend/public/templates/study_import_template.xlsx`).
  Reuses the existing create/validation path exactly; downloads referenced
  image/PDF/audio/video URLs into the same `uploads/` layout the block
  editor uses. No schema change for this — it creates ordinary `studies`
  rows and `study` content blocks, nothing new to seed.
- Re-ran `db:export-seed` after this: `studies` count is unchanged (26) —
  the two studies created while testing the importer were deleted again
  before exporting.

## 2026-09-26 — Seed/changelog system introduced

- Added `backend/database/seed.js` (loads `seedData.json` into the local DB
  + copies `seed-assets/` into `uploads/`) and
  `backend/database/exportSeedData.js` (the reverse — regenerates those two
  files from the current DB). Added `npm run db:seed` /
  `npm run db:export-seed` in `backend/package.json`.
- This file (`DB_CHANGES.md`) created to replace ad-hoc "let me tell you
  what I changed" conversations.
- Snapshot taken at this point includes: all books/blogs/studies/categories
  and their EN/DE translations, about-page features, news ticker messages,
  site ads, homepage banners, book pricing tiers, subscription plans,
  content-access plans, and writer-trial settings. Content trials table is
  currently empty (none created yet — create one from
  `/admin/dashboard/content-trials/blogs` or `/studies` and it'll be
  captured next time someone runs `db:export-seed`).

## 2026-09-20 — Content trials split by content type

- Migration `033_split_content_trials_by_type.sql`: added
  `content_trials.content_type` (`blogs` | `studies`). A trial now belongs
  to exactly one content type — its category picker only shows that type's
  categories. Admin UI split into `/admin/dashboard/content-trials/blogs`
  and `/admin/dashboard/content-trials/studies`.

## 2026-09-20 — Writer trial, reader content trials, category-scoped subscriptions

- Migration `032_writer_trial_and_content_trials.sql`: added
  `writer_trial_settings` (singleton — admin-configurable duration for the
  one-time beginner-writer free trial, replacing a hardcoded 1 month),
  `content_trials` / `content_trial_categories` / `content_trial_redemptions`
  (admin-created free trials scoped to specific blog/study categories),
  `subscriber_category_access` (fine-grained access grants, used by both
  trials and category-restricted paid plans), `content_subscription_plan_categories`
  (lets a paid content-access plan be restricted to specific categories
  instead of "all blogs" / "all studies"), and `banners.placement` (`hero` |
  `subscription_offers`, for the new homepage subscription-offers slider).

## 2026-09-19 — Full EN/DE translations for all dummy content

- Migration `031_add_more_translations.sql`: added translation tables for
  about-page features, news ticker items, books, and all three category
  tables (books/blogs/studies). Every existing demo book, category, about
  feature, and ticker message got an English and German translation.
  Books use a *fallback* model (blank translated field shows the Arabic
  text); everything else *hides* if untranslated rather than falling back.
- Contact page rebuilt (previously an empty stub) to reuse the homepage's
  contact section.

## 2026-09-13 — EN/DE translations for blogs, studies, site ads

- Migration `030_add_site_ad_translations.sql` and the blog/study
  translation tables from `029_add_content_translations.sql`. Fixed a bug
  where an untranslated Arabic category name was leaking into English/German
  newsletter popup text.
