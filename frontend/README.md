# Publishing House — Frontend

Next.js (App Router) frontend for the publishing house platform. Arabic is the
default and primary language, built with internationalization in mind from
the start.

## Stack

- Next.js (App Router) + React + TypeScript
- Custom CSS (CSS Modules + global design tokens), no CSS framework
- Locale-prefixed routing (`/ar`, `/en`, `/de`)

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` — you'll be redirected to `/ar` by default
(or your browser's preferred supported language).

## Internationalization

- Supported locales, default locale, and text direction live in
  [`src/i18n/config.ts`](src/i18n/config.ts).
- Translated strings live in `src/i18n/dictionaries/{locale}.json`. Never
  hardcode user-facing text in components — add a key to every locale's
  dictionary and read it via `getDictionary(locale)`.
- To add a new language: add its code to `locales` in `src/i18n/config.ts`,
  add a direction and label, then create a matching dictionary JSON file.
- `src/middleware.ts` redirects locale-less paths to the best-matching
  locale based on the `Accept-Language` header.

## Structure

```
src/
  app/
    [locale]/          # all public routes, one per supported locale
      layout.tsx        # <html lang dir>, header/footer, SEO metadata
      page.tsx           # home page
      books/, studies/, blog/, contact/
    robots.ts, sitemap.ts
  components/           # shared, reusable UI (Header, Footer, LanguageSwitcher)
  features/             # feature-specific UI/logic (books, studies, blog, contact)
  i18n/                 # locale config, dictionaries, getDictionary helper
```

## Notes

- The admin dashboard and Express/MySQL backend are separate concerns and
  will live in a sibling `backend/` folder per the project's monorepo layout.
- Follow the engineering rules in the repository root `CLAUDE.md` (security,
  performance, SEO, accessibility, architecture) for all future work here.
