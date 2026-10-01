# UI/UX design brief for the Publishing House Platform

Paste this whole file as the first message of a Claude Code session whose job is to design or redesign pages of this platform. It is written for an AI coding agent that has the repository open.

---

## 1. Read these first (do not skip)

1. `CLAUDE.md` - engineering rules, security, SEO, accessibility, motion rules. They override anything below if there is a conflict.
2. `frontend/src/app/globals.css` - the design tokens (colors, gradients, spacing, motion timing). This is the only place to change the theme.
3. `خطة_تحسين_البيانات_الوصفية.txt` - the roadmap. Many pages show metadata (DOI, ISBN, type, author) that this plan adds, so new layouts must leave room for it.
4. Two reference implementations of the quality bar: `frontend/src/features/studies/StudyArticleHeader.tsx` (journal-style study header) and `frontend/src/features/home/` (home sections).
5. If present: `design/` (earlier homepage mockups, `*.dc.html`) and `page-mockups.html` at the repo root. Treat them as inspiration, not as a spec.

## 2. What the platform is

An Arabic-first publishing house and research center. It publishes **books** (sold, with external purchase links), **studies** (research papers, reports, policy briefs - some free, some for subscribers) and **blog articles**. Long term it is meant to grow into a large research and search platform, so pages must feel credible and scholarly as well as warm and literary.

Languages: Arabic is the first release and the default (right-to-left). English and German already exist through dictionaries (`frontend/src/i18n/dictionaries/{ar,en,de}.json`), so every layout must work in both RTL and LTR and with text of very different lengths.

Audience:
- Arabic readers: students, researchers, policy people, general readers, mostly on phones.
- Subscribers (paid content) and one-time buyers.
- The editorial team in the admin dashboard (Arabic-only, desktop).

## 3. The feeling we want

A premium, cinematic publishing house - **not** a generic bookstore and **not** a stock SaaS landing page.

- Typography-first: large, expressive Arabic type is the main design element (font: IBM Plex Sans Arabic, Latin: Poppins, already loaded in `app/layout.tsx`).
- Generous whitespace, strong hierarchy, calm warm paper-like background (`--color-bg`) with a deep navy primary (`--color-primary`) and a warm gold secondary (`--color-secondary`).
- Books and reading are the heroes: covers, quotes, pull-quotes, big numbers.
- Bold but elegant. Memorable, with one or two confident signature moments per page, not decoration everywhere.
- Scholarly pages (studies) borrow the clarity of journal sites such as ScienceDirect: clear article info, abstract, metadata panel, citation-ready.

Avoid: template-looking card grids with identical shadows, purple gradients, emoji as icons, centered-everything layouts, walls of equally weighted boxes.

## 4. Design system you must use

- **Tokens only.** Use the CSS variables from `globals.css` (`--color-*`, `--gradient-*`, `--space-*`, `--ease-out-expo`, `--duration-*`). Do not hardcode colors, durations or spacing. If something is missing, extend the token trio (primary/secondary/tertiary) instead of adding ad-hoc colors.
- **Styling:** CSS Modules next to the component (existing pattern). No Tailwind, no CSS-in-JS, no UI kit.
- **Layout:** `container` class and `--max-content-width`. Use logical properties (`margin-inline-start`, `inset-inline-end`, `text-align: start`) so RTL and LTR both work. Never use `left`/`right` for layout.
- **Components:** reuse what exists (`Reveal`, `StaggerText`, `Parallax`, `CountUp`, `ShareBar`, `PostStats`, `Sidebar`, cards in `features/*`). Search before creating anything new.
- **Text:** never hardcode user-facing text in components. Add keys to all three dictionaries (`ar.json`, `en.json`, `de.json`) and read them through `getDictionary`.
- **Server vs client:** keep pages as server components; use `"use client"` only for real interactivity.

## 5. Motion (purposeful, never decorative)

- Scroll-triggered reveals for sections and cards (fade/slide/stagger), subtle parallax on hero imagery, intentional page transitions, micro-interactions on hover/focus/click, animated counters or underlines on key moments (new release, featured study, CTA).
- Every animation needs a purpose: guide attention, show state, reinforce hierarchy.
- Transform and opacity only. No layout-triggering animation. No heavy animation libraries.
- Always provide a `prefers-reduced-motion` fallback.
- Must not hurt Core Web Vitals (CLS, INP, LCP). Reserve space for images, no layout shift on reveal.
- Designed loading and skeleton states, not browser defaults.

## 6. Accessibility, performance, SEO (non-negotiable)

- Semantic HTML, one `h1` per page, correct heading order, landmarks, visible keyboard focus, full keyboard navigation, color contrast AA or better.
- Every image needs real alt text (image sections in the editor already require it). Use `next/image` with proper `sizes`.
- Do not break the metadata work: canonical URLs, hreflang, OpenGraph, JSON-LD (`SiteJsonLd`, `articleJsonLd`, Book/Product on book pages). Redesigning a page must keep or improve its structured data, never remove it.
- Minimal JS. No new dependency unless there is no reasonable alternative; say why.

## 7. Pages and what each must do

**Home** (`app/[locale]/page.tsx`, `features/home/`) - hero with the main message and featured release, key numbers, featured books, studies and blog sections, about, subscription offers banner, ad/banner slots, contact. The first screen decides the whole impression: make it the strongest moment on the site.

**Books library** - filterable/sortable grid (category, price, newest), clear price and rating, favorite and add-to-cart actions. **Book detail** - cover as hero, author, description, price or pricing tier, ISBN (when present), rating and reviews count, external purchase links, related books. Structured data must stay.

**Studies list** - filters by category and type; each card shows type, title, author, short description, premium or free marker. **Study detail** - already redesigned: journal-style header (chips, title, author, download and share, abstract beside a study-information panel), paginated body with a grouped table of contents in the sidebar, pager, premium lock (page 1 is a free preview), related studies. Keep and polish; do not regress page-1-only fields (type, DOI, share, stats).

**Blog list and detail** - editorial feel: article type chip, author, date, stats strip, share bar, body blocks (text, image, image+text, quote, tags, PDF, audio, video), newsletter popup, related posts.

**Contact** - form plus contact details, reuses the home contact section.

**Subscription flow** - join, subscribe (plans and pricing), login, register, account, favourites, cart, purchase result. Trust and clarity matter most: plans compared simply, one obvious primary action, no dark patterns.

**Legal** - privacy and terms: readable long-form typography.

**404 and empty states** - designed, on-brand, with a way forward.

**Admin dashboard** (`app/admin/`) - Arabic-only, desktop-first, function over flash: overview, books, studies, blogs, categories, imports, settings. Clean forms, clear validation messages, dense but calm tables. Keep it consistent with the public tokens.

## 8. How to work

1. Pick **one page or section** per task. Read its current code and the data it receives (`frontend/src/lib/serverApi.ts` types) before designing.
2. State in 3-5 lines the design idea and what the reader should feel, then build it.
3. Check it in the browser at desktop width and at a real phone width, in Arabic (RTL) and in English (LTR). Take screenshots and look at them before saying it is done.
4. Run `npx tsc --noEmit` and `npx eslint src` in `frontend/`. Fix new warnings.
5. Test keyboard-only navigation and `prefers-reduced-motion`.
6. Commit and push each verified page separately, with a focused message (project rule in `CLAUDE.md`).

## 9. Definition of done for any page

- Looks premium and distinct, not template-like, in RTL and LTR, desktop and phone.
- Uses tokens and existing components, no hardcoded text, no hardcoded colors.
- Passes keyboard, contrast and reduced-motion checks.
- Metadata and structured data preserved or improved.
- No layout shift, no heavy new JS.
- Typecheck and lint clean, screenshots reviewed, committed and pushed.

If anything above conflicts with `CLAUDE.md`, or a requirement is unclear, ask before assuming.
