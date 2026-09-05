# Publishing House Platform - AI Development Guide

This document defines the engineering standards, architecture, and development rules for this project.

Every AI agent working on this repository must follow these instructions before writing or modifying any code.

The guide is from scratch and you're a full stack developer you should help me creating this platform like I don't know anything about programming setp by step and don't rush

---

# Project Overview

This project is a modern Arabic Publishing House Platform.

The system will provide a modern, fast, secure, and scalable website for publishing books, studies, and articles while providing an administration dashboard for content management.

The project must always prioritize:

- Clean Architecture
- Security
- Scalability
- Performance
- Maintainability
- SEO
- Accessibility

Every implementation decision should support these principles.

---

# Technology Stack

Frontend

- NextJS (App Router)
- React
- TypeScript
- Custom CSS

Backend

- NodeJS
- ExpressJS

Database

- MySQL

Local Database
- Laragon

Hosting

- Azure App Service

Storage

- Azure Storage (future)

Authentication

- JWT
- HTTP Only Cookies

Version Control

- Git

---

# Project Goals

The platform should look like a premium, cinematic publishing house rather than a traditional bookstore.

The UI should feel modern, bold, elegant, and typography-focused — catchy and memorable, not sterile or generic.

Avoid template-looking layouts. Avoid anything that looks like a stock SaaS landing page.

The design should emphasize:

- books
- reading
- typography
- whitespace
- premium branding
- motion as a storytelling tool, not decoration

Every page should feel alive: content reveals as the user scrolls, hovers respond, transitions between pages feel intentional. Motion should draw attention to what matters (a new release, a featured study, a call to action) and create a sense of craft and quality.

Animation must always be secondary to security and performance. A beautiful page that leaks data, ships bloated JS, or blocks interaction is a failure regardless of how it looks.

---

# Supported Languages

The first release is Arabic only.

However, every component must be built with internationalization in mind.

Never hardcode text directly inside components.

Prepare the architecture so new languages can be added later without rewriting pages.

Future support (don't add them while developing we will add them to the whole website after we finish completly with arabic):

- Germany
- English


---

# Website Structure

Public Pages

- Home
- Books Library
- Studies
- Blog
- Contact

Future Pages

- Search
- About
- Authors
- Categories
- Privacy Policy
- Terms
- 404

---

# Admin Dashboard

Dashboard

- Overview

Books

- Categories
- Add Category
- Edit Category

Books

- Add Book
- Edit Book
- Delete Book
- Publish / Draft

Studies

- Add Study
- Edit Study
- Delete Study

Blog

- Add Article
- Edit Article

Settings

- Website Logo
- Website Name
- Social Links
- Admin Password
- SEO Settings
- General Settings

Future

- Users
- Roles
- Analytics
- Activity Logs

---

# Backend Architecture

Follow feature-based architecture.

Example

src/

features/

books/

studies/

blog/

auth/

settings/

dashboard/

Each feature contains

- routes
- controller
- service
- validation
- repository
- model

Business logic must never exist inside routes.

---

# Frontend Architecture

Use App Router.

Organize by feature.

Avoid large components.

Shared UI belongs inside

components/

Business-specific components stay inside their feature.

Prefer reusable components.

---

# Database Rules

Use proper normalization.

Always use foreign keys.

Never duplicate data.

Every table should include

id

created_at

updated_at

Soft delete should be preferred whenever possible.

---

# Security Rules

Security is a top priority.

Always assume user input is malicious.

Requirements:

Validate every request.

Sanitize every input.

Escape every output.

Use parameterized SQL queries.

Never concatenate SQL strings.

Hash passwords using bcrypt.

Use JWT securely.

Store JWT in HTTP Only Cookies.

Enable Helmet.

Enable Rate Limiting.

Enable CORS correctly.

Enable CSRF protection if required.

Validate uploaded files.

Limit upload size.

Validate MIME types.

Never expose stack traces.

Hide internal server errors.

Never expose environment variables.

Store secrets only in .env

---

# Authentication

Admin authentication only.

No public user accounts in the first release.

Future-ready architecture should allow user accounts later.

---

# Performance

Optimize for speed.

Requirements

Lazy loading

Image optimization

Caching

Pagination

Database indexes

Compression

Minimal bundle size

Avoid unnecessary rerenders

---

# SEO

SEO is mandatory.

Every page should support

Title

Description

OpenGraph

Twitter Card

Canonical URL

Structured Data

Sitemap

Robots.txt

Clean URLs

Arabic SEO best practices.

---

# Accessibility

Use semantic HTML.

Support keyboard navigation.

Maintain proper color contrast.

Use alt text.

Proper heading hierarchy.

---

# Code Quality

Always write clean code.

Avoid duplication.

Follow

DRY

KISS

SOLID

Prefer readability over cleverness.

Avoid magic numbers.

Avoid deeply nested logic.

Write meaningful names.

---

# API Design

RESTful API.

Consistent responses.

Example

Success

{
    success: true,
    data: ...
}

Failure

{
    success: false,
    message: "...",
    errors: [...]
}

---

# File Uploads

Books

Cover

PDF

Studies

PDF

Images

Allowed formats only.

Validate everything.

Generate unique filenames.

---

# Logging

Log

Errors

Warnings

Authentication attempts

Server startup

Unexpected failures

Never log passwords or secrets.

---

# Error Handling

Every endpoint must return consistent responses.

Do not leak internal information.

Return meaningful messages.

---

# Environment Variables

Never hardcode

Database credentials

JWT Secret

Azure Keys

SMTP credentials

API Keys

Everything belongs inside .env

---

# Future Features

Wishlist

Authors

Book Reviews

Book Ratings

Wishlist

Favorites

Search Engine

Elastic Search

Notifications

Newsletter

Payments

Digital Downloads

Orders

Statistics

AI Recommendations

---

# UI Design Principles

Modern

Premium

Bold and catchy, not minimal-to-the-point-of-boring

Elegant

Readable

Typography-first — large, expressive type as a core design element, not just body copy

Responsive

Rich, purposeful motion throughout the experience:

- Scroll-triggered reveals for sections, cards, and text (e.g. fade/slide/stagger-in as content enters the viewport)
- Subtle parallax on hero imagery and featured content
- Smooth, animated page transitions between routes
- Micro-interactions on hover/focus/click for buttons, links, cards, and nav items
- Animated counters, underlines, or accents to draw attention to key moments (featured book, new release, CTA)
- Loading and skeleton states should feel designed, not default

Motion rules:

- Every animation must have a clear purpose: guide attention, communicate state, or reinforce hierarchy. Never animate just to animate.
- Respect `prefers-reduced-motion` — provide a reduced/no-motion fallback for every animation.
- Animations must not block interaction, delay perceived load time, or hurt Core Web Vitals (especially CLS and INP).
- Prefer CSS transitions/animations and transform/opacity-based motion over JS-heavy or layout-triggering animations.
- Keep animation libraries minimal and lightweight; do not add heavy dependencies purely for visual effects.
- Test all key animations with keyboard-only and screen-reader navigation to ensure they don't break accessibility.

---

# Development Rules

Before creating new code

Search for existing components.

Reuse existing utilities.

Avoid duplicate logic.

Always keep folders organized.

Never leave dead code.

Never leave unused imports.

Keep commits focused.

---

# AI Development Rules

Every AI agent should

Understand the existing architecture before coding.

Avoid introducing unnecessary dependencies.

Prefer existing utilities over creating new ones.

Keep files small and maintainable.

Document major architectural decisions.

If multiple solutions exist, choose the one that improves long-term maintainability.

Security always has higher priority than convenience.

Performance and accessibility always have higher priority than visual effects — animations must be optimized (transform/opacity, reduced-motion support) rather than removed as a first resort.

Scalability should be considered before implementing any feature.

Never break existing functionality without updating related components.

When uncertain, ask for clarification instead of making assumptions.

---

# Primary Objective

Build a secure, scalable, premium publishing platform that is easy to maintain, optimized for Arabic users today, and ready for international expansion tomorrow.


# commits

Every change that is complete, working, and saved must be committed and pushed to GitHub automatically — do not wait to be asked each time.

As soon as a feature or fix has been verified (tested/built successfully), stage the relevant files, write a focused commit message describing what changed and why, and push it to the remote right away. Never leave verified work sitting uncommitted at the end of a task.

Exceptions: never commit secrets/.env files, and never commit personal reference/content files or design mockups kept at the project root (e.g. draft docs, canvas/design working files) unless explicitly asked to.