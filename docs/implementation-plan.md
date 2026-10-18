# Implementation Plan: Monayem Azam Space Portfolio

**Version:** 2.0 (final) · **Date:** 2026-10-19 · **Stack:** Laravel (latest stable), PHP 8.3+, React + TypeScript, Inertia.js, Tailwind CSS, MySQL

This plan has 14 prompts for a coding agent, run strictly in order. It replaces the earlier draft and is built on three reference documents. Every prompt names the exact sections it must follow.

---

## 0. Reference documents

Put these three files in the repository under `docs/` before starting. They are the specification; the prompts only say what to build and when.

| File | Document | Use it for |
| --- | --- | --- |
| `docs/PRD.md` | PRD: Monayem Azam Space Portfolio | What to build: goals, ten sections, project showcase, admin modules, stack, acceptance criteria |
| `docs/DESIGN.md` | Design Guideline | How it looks and moves: colours for both themes, type, layout, components, section sketches, planet specs, motion, admin UI |
| `docs/DATABASE.md` | Database Schema (`database-schema.md`) | Every table, column, index, delete rule, seed data and verification query |

**Precedence when documents disagree:** `DATABASE.md` wins for anything about tables and columns; `DESIGN.md` wins for anything visual; `PRD.md` wins for scope and behaviour.

**Put this in the repository root as `AGENTS.md`** so the agent reads it on every prompt:

```markdown
# Agent rules for space-portfolio

1. Read the sections named in the current prompt in docs/PRD.md, docs/DESIGN.md and docs/DATABASE.md before writing code.
2. Never hard-code site content. Text, images, links and numbers come from the database.
3. Colours come from design tokens only (DESIGN.md section 2). No raw hex in components.
4. Both themes (dark and light) must work in every component you build.
5. Every animation follows DESIGN.md section 8 and respects prefers-reduced-motion and the Reduce effects toggle.
6. Icons: Lineicons, outline style only.
7. A CRUD action is done only when verified by a database query or a hard reload. A success toast or your own report is not proof.
8. Use Form Requests for validation, policies for authorisation, and clear the cache key portfolio.page.v1 on every admin save.
9. Commit once per prompt: "prompt-NN: short title". Do not start the next prompt until the Definition of Done passes.
10. Do not add features that are not in the PRD. Ask instead.
```

---

## 1. Rules every prompt follows

1. **Database proof.** Verify with the queries in `DATABASE.md` section 10 or your own SQL.
2. **Stack.** Start from Laravel's official React starter kit. TypeScript strict mode.
3. **Themes.** Deep Space (dark) and Solar (light) both ship; check every component in both.
4. **Content comes from the database.** Seeders load the starting content.
5. **Reduced motion.** Always supported.
6. **One commit per prompt**, pushed to GitHub, merged after the Definition of Done passes.

**Prompt format:** Context, References, Build, Out of scope, Definition of Done.

## 2. Order and estimate

| Phase | Prompts | Estimate |
| --- | --- | --- |
| Foundation | 1 to 3 | 1 week |
| Admin CRUD | 4 to 6 | 2 weeks |
| Public page and animation | 7 to 11 | 3 weeks |
| Contact, quality and launch | 12 to 14 | 2 weeks |

Estimates assume focused full-time work and will stretch with part-time hours.

## 3. Progress tracker

- [ ] 1 Bootstrap
- [ ] 2 Database
- [ ] 3 Admin shell and media
- [ ] 4 Admin: settings, sections, hero, about, skills
- [ ] 5 Admin: projects
- [ ] 6 Admin: services, experience, process, testimonials, SEO, messages
- [ ] 7 Public shell, themes, navigation
- [ ] 8 Starfield, loader, scroll animation
- [ ] 9 Hero, about, skills
- [ ] 10 Solar system projects
- [ ] 11 Services, experience, process, testimonials
- [ ] 12 Contact
- [ ] 13 SEO, SSR, performance, accessibility
- [ ] 14 Tests, deployment, handover

---

## Prompt 1: Project bootstrap

**Context.** Empty folder.

**References.** PRD section 8 (stack). DESIGN section 3 (fonts), section 9 (icons).

**Build**

- Create a Laravel project with the official React starter kit (Inertia, TypeScript, Tailwind, Vite), named `space-portfolio`.
- Configure `.env` and `.env.example`: MySQL database `space_portfolio`, mail driver `log`, `APP_URL`, queue `database`, plus `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
- Install front-end packages: `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `framer-motion`, `lenis`, a Lineicons React package, and `@dnd-kit/core` with `@dnd-kit/sortable`.
- Create folders: `resources/js/Pages/Portfolio`, `resources/js/Pages/Admin`, `resources/js/Experience`, `resources/js/Components`, `resources/js/Components/Admin`, `resources/js/lib`.
- Create `docs/` and add `PRD.md`, `DESIGN.md`, `DATABASE.md` and root `AGENTS.md` exactly as supplied.
- Self-host the three fonts from DESIGN section 3 under `public/fonts` and declare them with `font-display: swap`.
- Enable TypeScript strict mode, ESLint, Prettier, Laravel Pint; add `composer lint` and `npm run lint`.
- Add Pest (or PHPUnit) with one passing sample test.
- Initialise Git, push to GitHub repo `space-portfolio`, add a GitHub Actions workflow running lint, tests and `npm run build`.
- Write `README.md` with setup steps: clone, install, `.env`, migrate, seed, run.

**Out of scope.** Tables, pages and styling beyond the starter kit.

**Definition of Done**

- [ ] `composer install`, `npm install`, `php artisan migrate`, `npm run build` succeed on a clean clone.
- [ ] Home and login pages load with no console errors.
- [ ] Lint and sample test pass locally and in GitHub Actions.
- [ ] The starter-kit tables exist in MySQL (checked with `SHOW TABLES`).
- [ ] `docs/` contains the three reference files and `AGENTS.md` exists in the root.

---

## Prompt 2: Database, models and seeders

**Context.** Prompt 1 complete.

**References.** DATABASE sections 1 to 9 (everything), section 10 (verification queries). PRD section 5 for project feature text.

**Build**

- Write migrations in this order so foreign keys resolve: `media`, `settings`, `sections`, `seo_meta`, `hero_content`, `hero_roles`, `about_content`, `about_facts`, `skills`, `services`, `experiences`, `process_steps`, `projects`, `project_features`, `project_media`, `tags`, `project_tag`, `testimonials`, `messages`. Extend `users` with the two-factor columns if the starter kit has not.
- Follow DATABASE exactly: column types, defaults, nullability, indexes, unique keys, foreign keys with the stated delete rules (CASCADE, RESTRICT, SET NULL), `deleted_at` on `projects` only, check constraints where listed (MySQL 8.0.16 or newer).
- Create Eloquent models, relationships, casts and factories for every table. Add `scopePublished()` and `scopeOrdered()` where DATABASE defines public queries.
- Write the ten seeders in the order given in DATABASE section 9, loading the six projects with slugs, URLs, planet styles, accent colours, tags and the draft feature lists from PRD section 5 under the group labels listed there.
- Create the owner user from `.env` only.
- Write model tests for relationships, soft delete, delete rules (a media file in use cannot be deleted) and the public project query.

**Out of scope.** Controllers, routes, pages.

**Definition of Done**

- [ ] `php artisan migrate:fresh --seed` runs without errors.
- [ ] The first query in DATABASE section 10 returns 6 projects, 10 sections, 10 skills, 5 services, 6 steps, 1 user.
- [ ] Every project has at least one row in `project_features` and a `planet_style` (the features query).
- [ ] `SHOW CREATE TABLE` for `projects`, `project_features`, `project_media` and `testimonials` shows the foreign keys and delete rules from DATABASE.
- [ ] Deleting an in-use `media` row fails at the database level.
- [ ] Model tests pass.

---

## Prompt 3: Admin shell, authentication and media library

**Context.** Prompts 1 and 2 complete.

**References.** DESIGN section 5 (components), section 10 (admin UI), section 2 to 4 (tokens, type, layout). DATABASE 3.1 (users), 4.1 (media). PRD section 7.

**Build**

- Use the starter kit's login, logout and password reset. Remove public registration (the route must return 404). Allow only the seeded owner.
- Protect all `/admin/*` routes with auth middleware and an owner check.
- Build the admin layout exactly as in DESIGN section 10: left sidebar, top bar (theme toggle, user menu), breadcrumb, toasts, dashboard with count cards (published projects, unread messages, skills) and quick links. No starfield animation in the admin; use a quiet static background.
- Build the shared admin components listed in DESIGN section 10: data table with search and pagination, form field set, drag-to-reorder list (dnd-kit), publish toggle, delete confirmation dialog, empty state, sticky save bar with unsaved-changes warning, icon picker for Lineicons, image picker that opens the media library.
- Build the media library: drag-and-drop upload with progress; validate type and size (images 5 MB, video 10 MB, PDF 10 MB); create `webp_path` and `thumb_path` for images; store `width`, `height`, `size_bytes`, `mime`, `type`; edit `alt_text`; rename; replace; delete (blocked with a clear message when the file is in use); "in use" badge from the reference counts in DATABASE section 10.
- Standard pattern for later prompts: Form Request, policy, resource controller, Inertia page, feature test.

**Out of scope.** CRUD for portfolio content; the public page.

**Definition of Done**

- [ ] `/admin` logged out redirects to login; wrong password is rejected; the seeded owner signs in.
- [ ] The registration URL returns 404.
- [ ] Uploading a JPG creates one `media` row with correct `size_bytes`, `width`, `height`, `mime`, and both a WebP and a thumbnail exist on disk (check the row and the files).
- [ ] Deleting a media file that is referenced is refused with a message; deleting an unused one removes the row and all files.
- [ ] Admin screens match DESIGN section 10 in dark and light at 360 px and 1440 px.

---

## Prompt 4: Admin CRUD for settings, sections, hero, about and skills

**Context.** Prompt 3 complete; shared admin components exist.

**References.** DATABASE 3.2 (settings), 3.3 (sections), 5.1 to 5.5. DESIGN section 10 (forms, lists). PRD section 7 rows for these modules.

**Build**

- **Settings** (one screen with tabs from the `group` column): General, Theme, Effects, Contact, Social, Files, Analytics. Build the form fields from each row's `type` and `label`. Colour pickers for both themes, default theme select, animation level select (full, light, off), media pickers for logo, favicon, photo, resume. Validate `whatsapp_number` as digits only, URLs as valid https, email as valid.
- **Sections:** list of the ten sections with drag reorder, visibility toggle (not allowed to hide `hero` and `footer`), and editing of `nav_label`, `eyebrow`, `title`, `subtitle`.
- **Hero:** edit the single `hero_content` row and full CRUD plus reorder for `hero_roles`.
- **About:** edit the single `about_content` row; full CRUD plus reorder for `about_facts` with `kind` fact or counter and optional suffix.
- **Skills:** full CRUD for name, category (select with create-new), level 0 to 100, Lineicons icon, publish; reorder inside each category.
- Every save clears the cache key `portfolio.page.v1`.
- One feature test per module: create, update, delete, reorder, validation failure, guest blocked.

**Out of scope.** Projects, services, experience, process, testimonials, SEO.

**Definition of Done**

- [ ] For each module, create, edit, reorder and delete are confirmed by SQL after the action and again after a hard reload.
- [ ] Hiding a section sets `sections.is_visible = 0`; reordering rewrites `sort_order`; `hero` and `footer` cannot be hidden.
- [ ] Changing `animation_level`, `default_theme` and a colour changes the matching `settings.value` row.
- [ ] Invalid input (empty name, level 150, bad URL, WhatsApp with letters) is rejected with a visible message and no row changes.
- [ ] Feature tests pass.

---

## Prompt 5: Admin CRUD for projects

**Context.** Prompts 3 and 4 complete. This is the most important admin module.

**References.** DATABASE 6.1 to 6.4. DESIGN section 7 (planet styles), section 10 (project form tabs). PRD section 5.

**Build**

- **List:** search, status filter (published, draft, trash), drag reorder, featured toggle, publish toggle.
- **Form with four tabs** (DESIGN section 10): Details, Features, Media, SEO-ready fields.
  - Details: title, auto-generated editable unique slug, summary (300 max), description, business type, role, year, live URL (https only), planet style select (the seven values in DATABASE with a small preview of each), accent colour, cover image, featured, published, live-preview toggle.
  - Tags: type-ahead picking existing tags or creating new ones; saved in `project_tag` with order.
  - Features: unlimited items with `group_label` and `text`; add, edit, delete, drag reorder; a bulk paste box where each line becomes an item and a line ending with a colon sets the group for the lines after it.
  - Media: attach images and videos from the media library as `project_media` with kind (desktop, mobile, video, other), caption and order.
- **Trash:** soft delete sets `deleted_at`; Trash view with restore and permanent delete (permitted only for rows already in Trash).
- A "Preview panel" button that will open the detail panel once prompt 10 exists; for now it opens a placeholder.
- Feature tests: create, update, reorder, soft delete, restore, force delete, slug uniqueness, validation.

**Out of scope.** Public rendering.

**Definition of Done**

- [ ] Creating a seventh project adds exactly one `projects` row and the right rows in `project_features`, `project_media`, `project_tag` (count with SQL before and after).
- [ ] Reordering projects and features changes `sort_order` and survives a hard reload.
- [ ] Soft delete sets `deleted_at`, restore clears it, permanent delete removes the row and its child rows (cascade check).
- [ ] The public-projects query in DATABASE section 10 never returns a draft or a trashed project.
- [ ] The six seeded projects open, edit and save without data loss; features keep their group labels.
- [ ] A duplicate slug is rejected.

---

## Prompt 6: Admin CRUD for services, experience, process, testimonials, SEO and messages

**Context.** Prompts 3 to 5 complete.

**References.** DATABASE 3.4, 5.6 to 5.9, 7.1. DESIGN section 10. PRD section 7.

**Build**

- **Services:** title, description, icon, reorder, publish.
- **Experience:** role, company, start date, end date, "Present" checkbox (`is_current`, clears and disables `end_date`), description, reorder, publish. Validate `end_date >= start_date`.
- **Process steps:** title, description, reorder, publish.
- **Testimonials:** quote, author name, role, company, photo from the media library, optional linked project, publish toggle (default off), reorder.
- **SEO:** the single `home` row: meta title (70 max), meta description (170 max) with live character counters, share image, canonical URL, job title and sameAs links for JSON-LD, robots.
- **Messages inbox:** two-pane list and detail; unread dot; mark read or unread (`read_at`); delete with confirmation; reply button opens a `mailto:` link; unread count in the sidebar and dashboard.
- One feature test per module.

**Out of scope.** Public rendering; the contact form itself (prompt 12).

**Definition of Done**

- [ ] Each module's create, edit, reorder, publish toggle and delete are confirmed by SQL and a hard reload.
- [ ] A testimonial with `is_published = 0` is excluded from the public query.
- [ ] An end date before the start date is rejected; `is_current` stores `end_date` as NULL.
- [ ] SEO values saved in the admin appear in `seo_meta`.
- [ ] Inserting a test `messages` row by SQL shows it in the inbox as unread; marking it read sets `read_at`; the sidebar count matches `SELECT COUNT(*) FROM messages WHERE read_at IS NULL`.
- [ ] Feature tests pass.

---

## Prompt 7: Public page shell, themes and navigation

**Context.** Admin prompts 3 to 6 complete; content exists in the database.

**References.** DESIGN section 1 to 6 (principles, colour, type, layout, components, section layouts). PRD sections 3 and 4. DATABASE 3.3.

**Build**

- A single route `/` served by `PortfolioController` that loads all published content with eager loading, caches the result under `portfolio.page.v1`, and passes it to one Inertia page.
- Render the ten sections in `sections.sort_order`, only when `is_visible = 1`, each as its own component using the layout sketches in DESIGN section 6, with static content for now. Hide the testimonials section automatically when no testimonial is published.
- Implement every colour token from DESIGN section 2 as CSS variables for both themes. Settings colours override the defaults. Build the sun and moon toggle: default from `settings.default_theme` (`system` follows the visitor), saved choice in local storage inside try/catch, set before first paint so there is no flash.
- Build the shared components from DESIGN section 5: glass panel, primary, secondary and call-to-action buttons, inputs, tag chips, tooltip, section heading with eyebrow, toggle.
- Build the orbit-dot navigation with active-section highlight and smooth anchor scrolling, the mobile menu overlay, footer and back-to-top button.
- Use the type scale and spacing from DESIGN sections 3 and 4 with `clamp()`.

**Out of scope.** Starfield, 3D, scroll animations, planets.

**Definition of Done**

- [ ] Change one value per section in the admin, reload, and the page shows it (list the values changed and the SQL rows).
- [ ] Hiding a section removes it and its nav dot; reordering changes page order.
- [ ] Theme toggle works with no flash on reload; both themes meet the contrast rules in DESIGN section 2.
- [ ] No horizontal scroll at 360, 768 and 1440 px; layouts match DESIGN section 6 mobile notes.
- [ ] No raw hex colours in components (search the codebase).

---

## Prompt 8: Starfield, loader, smooth scroll and scroll animation

**Context.** Prompt 7 complete.

**References.** DESIGN section 8 (motion specification), section 4 (z-order). PRD section 6.

**Build**

- **Starfield:** fixed Three.js scene with layered stars, soft nebula, slow drift, mouse parallax, occasional shooting stars. Load lazily after first paint. In the Solar theme use the violet star colour and pale sky from DESIGN section 2.
- **Effects levels:** read `settings.animation_level` plus the visitor's Reduce effects toggle (saved in local storage inside try/catch). Full: everything. Light: 2D canvas starfield, no custom cursor, simple fades. Off, or `prefers-reduced-motion`: static starfield image, no parallax, no scroll animation. Auto-drop to light on weak devices (low core count, low memory, or measured low frame rate).
- **Loader:** rocket and percent loader per DESIGN section 8; never longer than 2 seconds.
- **Smooth scroll:** Lenis with lerp 0.1, off for reduced motion.
- **Scroll story:** GSAP ScrollTrigger hook for reveals using the timings and easings in DESIGN section 8, the top progress line with the mono "distance" number, and a shared section-enter event.
- **Cursor:** custom glowing comet-trail cursor on fine-pointer desktops only, plus a magnetic-hover helper.
- Corner "Reduce effects" toggle.

**Out of scope.** Section-specific animations, planets.

**Definition of Done**

- [ ] Starfield runs at 60 fps on a desktop and at least 30 fps on a mid-range phone (record the measured numbers).
- [ ] Setting `animation_level` to `light` and `off` in the admin changes behaviour after reload (check the `settings` row and the page).
- [ ] With `prefers-reduced-motion` on there is no parallax, cursor trail, smooth scroll or flying; all content is readable.
- [ ] Initial JavaScript is under 250 KB gzipped and the 3D bundle loads after first paint (attach the build report).
- [ ] Z-order follows DESIGN section 4.

---

## Prompt 9: Hero, about and skills constellation

**Context.** Prompts 7 and 8 complete.

**References.** DESIGN section 6 (sections 1 to 3), section 8 (hero entrance), section 9 (photo rules). DATABASE 5.1 to 5.5. PRD section 4 rows 1 to 3.

**Build**

- **Hero:** name assembling from particles (fallback: a simple fade), typed rotating role lines from `hero_roles`, eyebrow, two buttons from `hero_content`, camera push into the starfield on load (2.2 s total), scroll cue.
- **About:** photo from `settings.photo_media_id` inside a round porthole frame, bio from `about_content`, facts and animated counters from `about_facts` (counters count up when scrolled into view, once), resume download button linking to `settings.resume_media_id` (hidden if empty).
- **Skills:** stars grouped into constellations by `skills.category`, lines connecting stars in each group, hover or focus lights the group and shows name, level and icon in a tooltip. Use SVG or canvas. On mobile, switch to grouped glowing chips, tap shows the level.
- Every item comes from the database and respects `is_published` and `sort_order`.

**Out of scope.** Projects and later sections.

**Definition of Done**

- [ ] Add a skill in the admin and a new star appears in the right constellation after reload (SQL row shown).
- [ ] Change a hero role line, a counter value and the resume file in the admin; the page shows each change after reload.
- [ ] The resume button downloads the current PDF; with no resume set, the button is absent.
- [ ] Reduced-motion and light modes simplify every animation; all three sections work by keyboard with a visible focus ring.
- [ ] Both themes correct at 360 px and 1440 px and match DESIGN section 6.

---

## Prompt 10: Solar system projects section and detail panel

**Context.** Prompts 5, 7 and 8 complete. This is the signature section.

**References.** DESIGN section 7 (planet visual specs, all rows), section 6 (projects layout), section 5 (modal and project panel), section 8 (planet open). DATABASE 6.1 to 6.4. PRD section 5 (planet table and click behaviour).

**Build**

- A horizontal fly-through solar system in Three.js. Each published, non-trashed project is one planet in `sort_order`; featured projects are larger (200 px against 140 px).
- Implement the seven styles from `projects.planet_style` using the colours, surfaces, idle motion and hover motion in the DESIGN section 7 table: `rocky`, `station`, `amber`, `ringed`, `ocean`, `desert`, `generic`. `accent_color` tints the glow and orbit light.
- Name label (display font) and mono sub-label with year and first tags under each planet; thin orbit line between planets with a small moving light.
- Move between planets by drag, wheel, arrow keys and tap.
- Click or Enter opens the glass detail panel: camera fly-in (1.1 s), cover or screenshot gallery or looping video, summary, description, business type, role, year, tags, the complete feature list grouped by `group_label`, a **Visit live site** button (new tab, `rel="noopener noreferrer"`), and **Next planet**. Esc, close button and swipe down close it; focus is trapped and returns to the planet.
- The live preview iframe appears only when `show_live_preview = 1`; otherwise show media.
- Mobile and low-power fallback: vertical list of animated planet cards using static planet images and the same panel; also used when WebGL is unavailable.
- Deep links: `/#project-slug` opens that project's panel on load.
- Wire up the admin "Preview panel" button from prompt 5.

**Out of scope.** Other sections.

**Definition of Done**

- [ ] Six planets render for the six seeded projects. Unpublish one in the admin and its planet disappears after reload; publish a new project with style `generic` and a planet appears.
- [ ] Each detail panel's feature list matches `project_features` grouped by `group_label` (compare against a SQL result for two projects).
- [ ] **Visit live site** opens the correct `live_url` for all six.
- [ ] Keyboard-only use works: tab to a planet, Enter to open, Esc to close, focus returns.
- [ ] The fallback list works at 360 px and with WebGL disabled.
- [ ] Each of the six planets matches its row in DESIGN section 7.
- [ ] Opening `/#asn-group` opens the ASN Group panel.

---

## Prompt 11: Services, experience, process and testimonials

**Context.** Prompts 6 to 8 complete.

**References.** DESIGN section 6 (sections 5 to 8), section 8 (timings). DATABASE 5.6 to 5.9. PRD section 4 rows 5 to 8.

**Build**

- **Services:** cards that dock in from the sides with a magnetic hover and the Lineicons icon from the row.
- **Experience:** vertical flight-log timeline, alternating sides on desktop, a comet moving down the line with scroll, showing "Present" when `is_current = 1`. Hide the section when there are no published experiences.
- **Process:** six steps with a countdown number and a connecting line; vertical on mobile.
- **Testimonials:** signal-wave carousel with auto-rotation that pauses on hover and focus and stops under reduced motion, swipe on touch, arrows and dots. Hide the section when none are published.
- Handle empty lists in every component without breaking.

**Out of scope.** Contact section.

**Definition of Done**

- [ ] Add, edit and reorder one item per module in the admin; the page reflects each after reload (SQL row shown for each).
- [ ] With zero published testimonials or experiences, the section and its nav dot disappear.
- [ ] The carousel works with keyboard and a screen reader; auto-rotation stops under reduced motion.
- [ ] Both themes correct at 360 px and 1440 px.

---

## Prompt 12: Contact, messages, email, WhatsApp and booking

**Context.** Prompts 6 and 7 complete.

**References.** DESIGN section 6 (contact), section 5 (inputs), section 8 (contact sent). DATABASE 3.2 (contact settings), 7.1 (messages). PRD section 4 row 9 and section 10 (security).

**Build**

- Contact section per DESIGN: form (name, email, subject, message) and contact links for email, phone, WhatsApp (`https://wa.me/<digits>` from `settings.whatsapp_number`), booking link and social profiles. Hide any link whose setting is empty.
- Handling: Inertia form post to a Form Request, server validation (body max 5000), honeypot field, rate limit of 5 submissions per hour per IP, CSRF, sanitised input. Store `ip_address` and `user_agent`.
- On success: create the `messages` row, queue an email notification to `settings.contact_email` with Laravel Mail, show the satellite "message transmitted" animation with a clear text message (still visible under reduced motion).
- On failure: field-level errors; the form keeps what the visitor typed.
- Show a short privacy notice only when analytics are enabled in settings.
- The admin inbox from prompt 6 now shows real messages.

**Out of scope.** SEO and performance work.

**Definition of Done**

- [ ] A valid submission creates one `messages` row with the right values and `read_at` NULL; an email appears in the log.
- [ ] A filled honeypot creates no row; the sixth submission in one hour from the same IP is refused and creates no row (use the rate-limit query in DATABASE section 10).
- [ ] An invalid email or empty message shows errors and creates no row.
- [ ] Changing the WhatsApp number and booking link in the admin changes the page links; clearing a value removes its link.
- [ ] The unread count updates after a new message and after marking one read.

---

## Prompt 13: SEO, server rendering, performance and accessibility

**Context.** All sections exist (prompts 7 to 12).

**References.** PRD section 10 (non-functional) and section 6 (performance budget). DESIGN section 11 (responsive and accessibility), section 9 (media rules). DATABASE 3.4 (`seo_meta`).

**Build**

- **SEO:** enable Inertia server-side rendering for the public page. Output title, description, canonical, Open Graph and Twitter tags from `seo_meta`; JSON-LD `Person` (from `seo_meta` and settings) and one `CreativeWork` per published project; `sitemap.xml`; `robots.txt` that blocks `/admin`.
- **Performance:** route-level code splitting, lazy 3D and GSAP, responsive images with `srcset` using `webp_path`, lazy-loaded media, long-cache headers for built assets, page cache with automatic clearing, indexes verified with `EXPLAIN` on the main queries.
- **Accessibility:** WCAG 2.2 AA in both themes, skip link, 3 px focus rings, heading order (one `h2` per section), alt text from `media.alt_text`, landmarks, carousel ARIA, dialog focus trapping.
- **Resilience:** space-themed 404 and 500 pages; verified WebGL fallback.
- Go through the final design checklist at the end of DESIGN section 11.

**Out of scope.** New features.

**Definition of Done**

- [ ] "View source" on `/` shows real page content and the JSON-LD.
- [ ] Lighthouse mobile: Performance 85+, Accessibility 95+, SEO 95+ (attach reports).
- [ ] Changing the SEO title in the admin changes the page `<title>` after reload (`seo_meta` row shown).
- [ ] Largest Contentful Paint under 2.5 s on throttled 4G; initial JavaScript under 250 KB gzipped.
- [ ] A full keyboard-only walkthrough passes in both themes.
- [ ] Every item in the DESIGN section 11 checklist is ticked with evidence.

---

## Prompt 14: Tests, QA, deployment and handover

**Context.** Prompt 13 complete. Hosting is not bought yet; PRD section 11 recommends a small VPS with Node.js so server-side rendering works.

**References.** PRD section 11 (acceptance criteria). DATABASE section 10 (verification queries). DESIGN section 11 (checklist).

**Build**

- **Tests:** every admin module has feature tests for create, update, delete, reorder, validation and guest blocking; public page tests (unpublished, trashed and hidden items never appear); contact form rules; authorisation. Add a browser smoke test of the public page if time allows.
- **QA pass:** run every PRD acceptance criterion and the DESIGN checklist; fix what fails.
- **Deployment:** write `DEPLOY.md` for Ubuntu: PHP 8.3, Composer, Node, MySQL, Nginx, SSL with Let's Encrypt, queue worker and scheduler under Supervisor, Inertia SSR process, production `.env`, storage link, file permissions, a GitHub Actions deploy job, and daily database and uploads backups with a documented restore.
- **Handover:** write `ADMIN-GUIDE.md` with steps and screenshots for the owner: add a project and its features, change the hero text, switch the default theme, upload the photo and resume, read messages, back up.

**Out of scope.** New features.

**Definition of Done**

- [ ] The full test suite passes locally and in GitHub Actions.
- [ ] Every PRD acceptance criterion is ticked with evidence (SQL result, screenshot or report).
- [ ] A fresh Ubuntu server can be set up from `DEPLOY.md` alone, and `php artisan migrate --seed` loads the six projects.
- [ ] After a production deploy: the page loads over HTTPS, admin login works, a new project added in the admin appears on the live page, and a test contact message arrives in the inbox and by email.
- [ ] A backup file is created and a restore test is documented.

**The project is complete** when all 14 Definitions of Done are ticked and Monayem has added one new project from the admin on the live site himself.

---

## Appendix: Owner inputs needed before launch

- Photo and resume PDF.
- Contact email, phone, WhatsApp number, booking link, social URLs.
- Real values for the three About counters and the short bio.
- Feature lists for Mercury Bangladesh and ASN Group, and anything missing for Sinbad Shipping Lines.
- Experience entries and any real testimonials (these sections hide until filled).
- Domain and hosting (recommended: a small VPS with Node.js).
