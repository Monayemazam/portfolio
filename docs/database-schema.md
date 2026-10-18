# Database Schema: Monayem Azam Space Portfolio

**Version:** 1.0 · **Date:** 2026-10-19 · **Database:** MySQL 8 (utf8mb4, InnoDB) · **Framework:** Laravel (latest stable)

This document is the single source of truth for the database. It extends section 9 of the PRD and is used by implementation prompts 2 to 12. Where this file and the PRD differ, this file wins. Changes from the PRD data model are listed in section 11.

---

## 1. Conventions

| Rule | Detail |
| --- | --- |
| Primary key | `id` BIGINT UNSIGNED, auto-increment |
| Timestamps | `created_at`, `updated_at` TIMESTAMP NULL on every table unless stated |
| Ordering | `sort_order` INT UNSIGNED NOT NULL DEFAULT 0, lowest first; gaps allowed |
| Publishing | `is_published` BOOLEAN NOT NULL DEFAULT 1 (public queries filter on it) |
| Visibility | `is_visible` BOOLEAN NOT NULL DEFAULT 1 (sections only) |
| Soft delete | `deleted_at` TIMESTAMP NULL, only on `projects` |
| Booleans | TINYINT(1) |
| Money, ratings | Not used |
| Foreign keys | Named `<table>_<column>_foreign`; delete rule stated per key |
| Naming | snake_case, plural table names, singular model names |
| Text columns | `VARCHAR(255)` for short text, `TEXT` for paragraphs, `LONGTEXT` only where noted |
| Media references | Content tables point to `media.id` with `ON DELETE RESTRICT`, so a file that is in use cannot be deleted |
| Cache | Every admin save clears the public page cache key `portfolio.page.v1` |

---

## 2. Entity overview

```text
users (1 owner)

settings            sections           seo_meta
   |                                      
hero_content --< hero_roles               about_content --< about_facts
                                          
skills             services          experiences      process_steps

projects --< project_features
   |------< project_media >------ media
   |------< project_tag >-------- tags
   |------- cover_media_id -----> media

testimonials -- project_id (optional) --> projects
testimonials -- photo_media_id ----------> media

media <------ settings, hero_content, about_content, testimonials, project_media
messages (contact form inbox, no relations)
```

Relationship summary:

| Relationship | Type | Delete rule |
| --- | --- | --- |
| hero_content to hero_roles | one to many | CASCADE |
| about_content to about_facts | one to many | CASCADE |
| projects to project_features | one to many | CASCADE |
| projects to project_media | one to many | CASCADE |
| media to project_media | one to many | RESTRICT |
| projects to tags | many to many via `project_tag` | CASCADE on the pivot |
| projects to media (cover) | many to one, optional | RESTRICT |
| testimonials to projects | many to one, optional | SET NULL |
| testimonials to media (photo) | many to one, optional | RESTRICT |

---

## 3. Core tables

### 3.1 `users`

Single owner account. Starter-kit table, extended.

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | no | auto | PK |
| name | VARCHAR(255) | no | | |
| email | VARCHAR(255) | no | | UNIQUE |
| email_verified_at | TIMESTAMP | yes | NULL | |
| password | VARCHAR(255) | no | | Hashed |
| two_factor_secret | TEXT | yes | NULL | Optional two-factor, off by default |
| two_factor_recovery_codes | TEXT | yes | NULL | |
| two_factor_confirmed_at | TIMESTAMP | yes | NULL | |
| remember_token | VARCHAR(100) | yes | NULL | |
| created_at, updated_at | TIMESTAMP | yes | NULL | |

Indexes: `PRIMARY(id)`, `UNIQUE(email)`.
Seeding: one row created from `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` in `.env`. Registration is disabled.

### 3.2 `settings`

Key-value store for site-wide options. One row per key.

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | no | auto | PK |
| group | VARCHAR(50) | no | | `general`, `theme`, `contact`, `social`, `files`, `effects`, `analytics` |
| key | VARCHAR(100) | no | | UNIQUE |
| value | TEXT | yes | NULL | String, JSON text or media id as text |
| type | VARCHAR(20) | no | `string` | `string`, `text`, `color`, `url`, `email`, `bool`, `int`, `media`, `json` |
| label | VARCHAR(150) | no | | Label shown in the admin |
| created_at, updated_at | TIMESTAMP | yes | NULL | |

Indexes: `UNIQUE(key)`, `INDEX(group)`.

Seeded keys:

| Group | Key | Type | Seed value |
| --- | --- | --- | --- |
| general | `site_title` | string | Monayem Azam, Full-Stack Developer |
| general | `site_tagline` | string | Building fast, beautiful web apps |
| general | `logo_media_id` | media | NULL |
| general | `favicon_media_id` | media | NULL |
| general | `photo_media_id` | media | NULL (owner uploads) |
| theme | `default_theme` | string | `system` (values: `system`, `dark`, `light`) |
| theme | `dark_primary` | color | #7C3AED |
| theme | `dark_secondary` | color | #22D3EE |
| theme | `dark_accent` | color | #F59E0B |
| theme | `light_primary` | color | #6D28D9 |
| theme | `light_secondary` | color | #0E7490 |
| theme | `light_accent` | color | #B45309 |
| effects | `animation_level` | string | `full` (values: `full`, `light`, `off`) |
| contact | `contact_email` | email | NULL (owner sets) |
| contact | `contact_phone` | string | NULL |
| contact | `whatsapp_number` | string | NULL, digits with country code |
| contact | `booking_url` | url | NULL |
| social | `github_url`, `linkedin_url`, `facebook_url`, `x_url`, `youtube_url` | url | NULL |
| files | `resume_media_id` | media | NULL |
| analytics | `analytics_provider` | string | `none` (values: `none`, `plausible`, `ga4`) |
| analytics | `analytics_id` | string | NULL |

### 3.3 `sections`

The ten page sections. Controls order, visibility and headings.

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | no | auto | PK |
| key | VARCHAR(50) | no | | UNIQUE: `hero`, `about`, `skills`, `projects`, `services`, `experience`, `process`, `testimonials`, `contact`, `footer` |
| nav_label | VARCHAR(50) | no | | Label in the orbit navigation |
| eyebrow | VARCHAR(100) | yes | NULL | Mono label, for example "MISSION 02 / BRIEFING" |
| title | VARCHAR(255) | yes | NULL | Section heading |
| subtitle | TEXT | yes | NULL | Intro text |
| sort_order | INT UNSIGNED | no | 0 | |
| is_visible | TINYINT(1) | no | 1 | |
| created_at, updated_at | TIMESTAMP | yes | NULL | |

Indexes: `UNIQUE(key)`, `INDEX(sort_order)`.
Rule: `hero` and `footer` cannot be hidden by the admin UI. `testimonials` is hidden on the public page when it has no published items, whatever `is_visible` says.

### 3.4 `seo_meta`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | no | auto | PK |
| page | VARCHAR(50) | no | `home` | UNIQUE, only `home` in v1 |
| meta_title | VARCHAR(70) | no | | |
| meta_description | VARCHAR(170) | no | | |
| og_image_media_id | BIGINT UNSIGNED | yes | NULL | FK to `media.id`, RESTRICT |
| canonical_url | VARCHAR(255) | yes | NULL | |
| person_job_title | VARCHAR(100) | yes | NULL | For JSON-LD Person |
| person_same_as | JSON | yes | NULL | Array of profile URLs |
| robots | VARCHAR(50) | no | `index,follow` | |
| created_at, updated_at | TIMESTAMP | yes | NULL | |

Indexes: `UNIQUE(page)`, `INDEX(og_image_media_id)`.

---

## 4. Media

### 4.1 `media`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | no | auto | PK |
| disk | VARCHAR(30) | no | `public` | Laravel filesystem disk |
| path | VARCHAR(500) | no | | Original file path |
| webp_path | VARCHAR(500) | yes | NULL | Generated for images |
| thumb_path | VARCHAR(500) | yes | NULL | Generated for images and video posters |
| original_name | VARCHAR(255) | no | | |
| mime | VARCHAR(100) | no | | |
| type | ENUM('image','video','document') | no | | |
| size_bytes | BIGINT UNSIGNED | no | | |
| width | INT UNSIGNED | yes | NULL | |
| height | INT UNSIGNED | yes | NULL | |
| duration_seconds | DECIMAL(6,2) | yes | NULL | Videos |
| alt_text | VARCHAR(255) | yes | NULL | Required for images before publishing |
| created_at, updated_at | TIMESTAMP | yes | NULL | |

Indexes: `INDEX(type)`, `INDEX(created_at)`.
Rules: a media row cannot be deleted while any foreign key points to it, because every reference uses `ON DELETE RESTRICT`. The admin shows an "in use" badge computed from these references. `settings.*_media_id` values are stored as text, so the application checks them before deleting a file.

---

## 5. Home page content

### 5.1 `hero_content` (one row)

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | no | auto | PK |
| eyebrow | VARCHAR(100) | yes | NULL | For example "MISSION 01 / LAUNCH" |
| name | VARCHAR(150) | no | | Monayem Azam |
| primary_button_label | VARCHAR(60) | no | | View projects |
| primary_button_url | VARCHAR(255) | no | | `#projects` |
| secondary_button_label | VARCHAR(60) | no | | Hire me |
| secondary_button_url | VARCHAR(255) | no | | `#contact` |
| created_at, updated_at | TIMESTAMP | yes | NULL | |

### 5.2 `hero_roles`

Rotating, typed role lines.

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | no | auto | PK |
| hero_content_id | BIGINT UNSIGNED | no | | FK to `hero_content.id`, CASCADE |
| text | VARCHAR(120) | no | | Example: Full-stack web developer |
| sort_order | INT UNSIGNED | no | 0 | |
| created_at, updated_at | TIMESTAMP | yes | NULL | |

Indexes: `INDEX(hero_content_id, sort_order)`.
Seed: Full-stack web developer, Laravel and React engineer, UI/UX designer, Ecommerce builder.

### 5.3 `about_content` (one row)

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | no | auto | PK |
| heading | VARCHAR(150) | yes | NULL | |
| bio | TEXT | no | | Short biography |
| created_at, updated_at | TIMESTAMP | yes | NULL | |

The photo comes from `settings.photo_media_id`; the resume from `settings.resume_media_id`.

### 5.4 `about_facts`

Quick facts and animated counters.

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | no | auto | PK |
| about_content_id | BIGINT UNSIGNED | no | | FK to `about_content.id`, CASCADE |
| kind | ENUM('fact','counter') | no | `fact` | |
| label | VARCHAR(100) | no | | |
| value | VARCHAR(100) | no | | Text for facts; number as text for counters |
| suffix | VARCHAR(10) | yes | NULL | For example `+` |
| sort_order | INT UNSIGNED | no | 0 | |
| created_at, updated_at | TIMESTAMP | yes | NULL | |

Indexes: `INDEX(about_content_id, kind, sort_order)`.

### 5.5 `skills`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | no | auto | PK |
| name | VARCHAR(80) | no | | |
| category | VARCHAR(80) | no | | Constellation group: Backend, Frontend, Platforms, Design |
| level | TINYINT UNSIGNED | no | 80 | 0 to 100 |
| icon | VARCHAR(60) | yes | NULL | Lineicons name |
| sort_order | INT UNSIGNED | no | 0 | Order inside the category |
| is_published | TINYINT(1) | no | 1 | |
| created_at, updated_at | TIMESTAMP | yes | NULL | |

Indexes: `INDEX(category, sort_order)`.
Check: `level BETWEEN 0 AND 100`.
Seed (10): Laravel, Vue.js, React, TypeScript, PHP, MySQL, GitHub, WordPress, UI/UX design, Ecommerce.
Suggested categories: Backend (Laravel, PHP, MySQL), Frontend (Vue.js, React, TypeScript, UI/UX design), Platforms (WordPress, Ecommerce, GitHub).

### 5.6 `services`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | no | auto | PK |
| title | VARCHAR(120) | no | | |
| description | TEXT | no | | |
| icon | VARCHAR(60) | yes | NULL | Lineicons name |
| sort_order | INT UNSIGNED | no | 0 | |
| is_published | TINYINT(1) | no | 1 | |
| created_at, updated_at | TIMESTAMP | yes | NULL | |

Seed (5): Full-stack web applications, CMS development, Ecommerce platforms, WordPress websites, UI/UX design.

### 5.7 `experiences`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | no | auto | PK |
| role | VARCHAR(150) | no | | |
| company | VARCHAR(150) | no | | |
| start_date | DATE | no | | |
| end_date | DATE | yes | NULL | NULL when `is_current` is true |
| is_current | TINYINT(1) | no | 0 | Shows "Present" |
| description | TEXT | yes | NULL | |
| sort_order | INT UNSIGNED | no | 0 | |
| is_published | TINYINT(1) | no | 1 | |
| created_at, updated_at | TIMESTAMP | yes | NULL | |

Indexes: `INDEX(start_date)`.
Check: `end_date IS NULL OR end_date >= start_date`.
Seed: none. The owner adds experience in the admin.

### 5.8 `process_steps`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | no | auto | PK |
| title | VARCHAR(100) | no | | |
| description | TEXT | no | | |
| sort_order | INT UNSIGNED | no | 0 | |
| is_published | TINYINT(1) | no | 1 | |
| created_at, updated_at | TIMESTAMP | yes | NULL | |

Seed (6): Discover, Design, Build, Test, Launch, Support.

### 5.9 `testimonials`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | no | auto | PK |
| quote | TEXT | no | | |
| author_name | VARCHAR(120) | no | | |
| author_role | VARCHAR(120) | yes | NULL | |
| company | VARCHAR(150) | yes | NULL | |
| photo_media_id | BIGINT UNSIGNED | yes | NULL | FK to `media.id`, RESTRICT |
| project_id | BIGINT UNSIGNED | yes | NULL | FK to `projects.id`, SET NULL |
| sort_order | INT UNSIGNED | no | 0 | |
| is_published | TINYINT(1) | no | 0 | Default hidden until reviewed |
| created_at, updated_at | TIMESTAMP | yes | NULL | |

Indexes: `INDEX(is_published, sort_order)`, `INDEX(photo_media_id)`, `INDEX(project_id)`.
Seed: none. Only real testimonials are added by the owner.

---

## 6. Projects

### 6.1 `projects`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | no | auto | PK |
| title | VARCHAR(150) | no | | |
| slug | VARCHAR(160) | no | | UNIQUE, used for `/#slug` deep links |
| summary | VARCHAR(300) | no | | Short text on the planet label |
| description | TEXT | yes | NULL | Longer text in the detail panel |
| business_type | VARCHAR(150) | yes | NULL | One line on what the business does |
| role | VARCHAR(150) | yes | NULL | Monayem's role |
| year | SMALLINT UNSIGNED | yes | NULL | |
| live_url | VARCHAR(255) | no | | Full https URL |
| planet_style | ENUM('rocky','station','amber','ringed','ocean','desert','generic') | no | `generic` | See Design Guideline section 7 |
| accent_color | CHAR(7) | yes | NULL | Hex like `#22D3EE` |
| cover_media_id | BIGINT UNSIGNED | yes | NULL | FK to `media.id`, RESTRICT |
| show_live_preview | TINYINT(1) | no | 0 | Enables the optional iframe |
| is_featured | TINYINT(1) | no | 0 | Larger planet |
| is_published | TINYINT(1) | no | 0 | |
| sort_order | INT UNSIGNED | no | 0 | |
| created_at, updated_at | TIMESTAMP | yes | NULL | |
| deleted_at | TIMESTAMP | yes | NULL | Soft delete |

Indexes: `UNIQUE(slug)`, `INDEX(is_published, deleted_at, sort_order)`, `INDEX(is_featured)`, `INDEX(cover_media_id)`.
Public query: `WHERE is_published = 1 AND deleted_at IS NULL ORDER BY sort_order`.
Rule: permanent delete is allowed only when `deleted_at IS NOT NULL`.

### 6.2 `project_features`

Unlimited grouped feature items shown in the detail panel.

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | no | auto | PK |
| project_id | BIGINT UNSIGNED | no | | FK to `projects.id`, CASCADE |
| group_label | VARCHAR(80) | no | `General` | Example: Public site, Admin, Integrations |
| text | VARCHAR(500) | no | | One feature |
| sort_order | INT UNSIGNED | no | 0 | Order inside the project |
| created_at, updated_at | TIMESTAMP | yes | NULL | |

Indexes: `INDEX(project_id, group_label, sort_order)`.
Display: the panel groups items by `group_label`, groups ordered by the lowest `sort_order` in each group.

### 6.3 `project_media`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | no | auto | PK |
| project_id | BIGINT UNSIGNED | no | | FK to `projects.id`, CASCADE |
| media_id | BIGINT UNSIGNED | no | | FK to `media.id`, RESTRICT |
| kind | ENUM('desktop','mobile','video','other') | no | `desktop` | |
| caption | VARCHAR(200) | yes | NULL | |
| sort_order | INT UNSIGNED | no | 0 | |
| created_at, updated_at | TIMESTAMP | yes | NULL | |

Indexes: `INDEX(project_id, sort_order)`, `INDEX(media_id)`, `UNIQUE(project_id, media_id)`.

### 6.4 `tags` and `project_tag`

`tags`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | no | auto | PK |
| name | VARCHAR(60) | no | | Laravel, Vue.js, WooCommerce |
| slug | VARCHAR(70) | no | | UNIQUE |
| created_at, updated_at | TIMESTAMP | yes | NULL | |

`project_tag` (pivot, no timestamps required)

| Column | Type | Null | Notes |
| --- | --- | --- | --- |
| project_id | BIGINT UNSIGNED | no | FK to `projects.id`, CASCADE |
| tag_id | BIGINT UNSIGNED | no | FK to `tags.id`, CASCADE |
| sort_order | INT UNSIGNED | no | Default 0 |

Primary key: `(project_id, tag_id)`. Index: `INDEX(tag_id)`.

---

## 7. Contact

### 7.1 `messages`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | no | auto | PK |
| name | VARCHAR(120) | no | | |
| email | VARCHAR(255) | no | | |
| subject | VARCHAR(200) | yes | NULL | |
| body | TEXT | no | | Maximum 5000 characters, validated |
| ip_address | VARCHAR(45) | yes | NULL | Supports IPv6 |
| user_agent | VARCHAR(255) | yes | NULL | |
| read_at | TIMESTAMP | yes | NULL | NULL means unread |
| created_at, updated_at | TIMESTAMP | yes | NULL | |

Indexes: `INDEX(read_at)`, `INDEX(created_at)`, `INDEX(ip_address, created_at)` for rate-limit checks.
Rule: no foreign keys; messages are independent records.

---

## 8. Framework tables

Created by Laravel and the starter kit. No changes needed, listed so nothing is missed.

| Table | Purpose |
| --- | --- |
| `password_reset_tokens` | Password reset for the owner |
| `sessions` | Database sessions |
| `cache`, `cache_locks` | Database cache, if the cache driver is `database` |
| `jobs`, `job_batches`, `failed_jobs` | Queue for the contact email |
| `migrations` | Laravel migration log |

---

## 9. Seed data summary

Seeders run in this order so foreign keys always resolve:

1. `UserSeeder`: one owner from `.env`.
2. `SettingSeeder`: all keys in section 3.2.
3. `SectionSeeder`: the ten sections in order.
4. `SeoSeeder`: one `home` row.
5. `HeroSeeder`: `hero_content` and four `hero_roles`.
6. `AboutSeeder`: `about_content` with a short placeholder bio and three counter rows (set to real values by the owner).
7. `SkillSeeder`: ten skills.
8. `ServiceSeeder` and `ProcessSeeder`: five services, six steps.
9. `TagSeeder`: Laravel, Vue.js, React, TypeScript, PHP, MySQL, WordPress, WooCommerce, Tailwind CSS, Inertia.js, Elementor, Ecommerce, Logistics.
10. `ProjectSeeder`: the six projects below.

Seeded projects (all published, in this order):

| sort | title | slug | live_url | planet_style | accent | Tags |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Mercury Bangladesh | mercury-bangladesh | https://mercury-bd.com/ | rocky | #94A3B8 | Laravel, Vue.js, MySQL, Logistics |
| 2 | ASN Group | asn-group | https://www.asngroup-bd.com/ | station | #22D3EE | Laravel, Vue.js, Inertia.js, Tailwind CSS, MySQL, Logistics |
| 3 | Tasa | tasa | https://tasa.com.bd/ | amber | #B45309 | WordPress, WooCommerce, Ecommerce |
| 4 | Tazwar BD | tazwar-bd | https://tazwarbd.com/ | ringed | #A78BFA | WordPress, WooCommerce, Elementor, Ecommerce |
| 5 | Sinbad Shipping Lines | sinbad-shipping-lines | https://sinbadshippinglines.com/ | ocean | #84CC16 | Laravel, Vue.js, Tailwind CSS, MySQL, Logistics |
| 6 | Ayra España | ayra-espana | https://ayraespana.com/ | desert | #EF4444 | WordPress, WooCommerce, Elementor, Ecommerce |

Each seeded project also loads its `project_features` from the draft feature lists in PRD section 5, using these group labels: Store, Content, Account and checkout, Marketing, Admin, Technical. The Mercury and ASN feature lists are placeholders until the owner supplies them. Tag assignments above are drafts and the owner can change them in the admin.

---

## 10. Verification queries

Used by the Definition of Done in each prompt. Run them in a MySQL client, not through the UI.

```sql
-- Prompt 2: seed counts
SELECT
  (SELECT COUNT(*) FROM projects)  AS projects,        -- 6
  (SELECT COUNT(*) FROM sections)  AS sections,        -- 10
  (SELECT COUNT(*) FROM skills)    AS skills,          -- 10
  (SELECT COUNT(*) FROM services)  AS services,        -- 5
  (SELECT COUNT(*) FROM process_steps) AS steps,       -- 6
  (SELECT COUNT(*) FROM users)     AS users;           -- 1

-- Projects that are public right now
SELECT id, title, sort_order
FROM projects
WHERE is_published = 1 AND deleted_at IS NULL
ORDER BY sort_order;

-- Every project has features
SELECT p.title, COUNT(f.id) AS features
FROM projects p LEFT JOIN project_features f ON f.project_id = p.id
GROUP BY p.id, p.title;

-- Features grouped for one project
SELECT group_label, text, sort_order
FROM project_features WHERE project_id = ? ORDER BY sort_order;

-- Section order and visibility
SELECT key, nav_label, sort_order, is_visible FROM sections ORDER BY sort_order;

-- Media in use (should block delete)
SELECT m.id, m.original_name,
  (SELECT COUNT(*) FROM project_media pm WHERE pm.media_id = m.id)
  + (SELECT COUNT(*) FROM projects p WHERE p.cover_media_id = m.id)
  + (SELECT COUNT(*) FROM testimonials t WHERE t.photo_media_id = m.id)
  + (SELECT COUNT(*) FROM seo_meta s WHERE s.og_image_media_id = m.id) AS uses
FROM media m;

-- Contact inbox
SELECT COUNT(*) AS unread FROM messages WHERE read_at IS NULL;

-- Rate limit check (5 per hour per IP)
SELECT COUNT(*) FROM messages
WHERE ip_address = ? AND created_at > NOW() - INTERVAL 1 HOUR;
```

---

## 11. Changes from the PRD data model

| Change | Reason |
| --- | --- |
| Added `hero_content` and `hero_roles` | The PRD has a Hero admin module (name, rotating roles, two buttons) but no table for it |
| Added `about_content` and a `kind` column on `about_facts` | The PRD lists bio, facts and counters together; a single bio row plus typed facts keeps it simple |
| Added `business_type`, `show_live_preview`, `cover_media_id` and `planet_style` values to `projects` | Needed for the detail panel, the optional iframe and the planet designs |
| Added `group_label` to `project_features` | Decided in the PRD: features are grouped by area |
| Added `kind` to `project_media` and `sort_order` to `project_tag` | Desktop and mobile screenshots and ordered tags |
| `settings` now has `group`, `type` and `label` | Lets the admin build forms automatically |
| `testimonials.is_published` defaults to 0 | Nothing goes live until reviewed |
| `experiences.is_current` | Supports "Present" without a fake end date |
| `seo_meta` holds Person JSON-LD fields | Needed for structured data in prompt 13 |

## 12. Open items for the owner

- Real values for the three About counters, contact email, phone, WhatsApp number, booking link and social URLs (all seeded empty).
- Feature lists for Mercury Bangladesh and ASN Group, and any missing items for Sinbad Shipping Lines.
- Confirm or change the planet accent colours and tag assignments in section 9.
