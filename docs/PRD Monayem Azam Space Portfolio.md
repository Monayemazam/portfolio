# PRD: Monayem Azam Space Portfolio

Oct 19, 2026 · @Monayem

## 1. Overview

A single-page, space-themed portfolio for Monayem Azam, a full-stack web developer, built on Laravel and React, where every piece of content can be edited later from an admin panel with no code changes.

**Vision.** The visitor does not scroll a website; they fly through Monayem's universe. Each live project is a planet, each skill is a constellation, and the contact form is an open radio channel.

**Goals**

- Win freelance clients and job offers by proving real shipped work: six live production sites.
- Show range in one place: Laravel, Vue.js, React, TypeScript, PHP, MySQL, WordPress, ecommerce, UI/UX.
- Be memorable: heavy animation and a 3D space scene, without hurting speed or usability.
- Let Monayem change any text, image, link or project from an admin panel in minutes.

**Success metrics (first 90 days)**

| Metric | Target |
| --- | --- |
| Largest Contentful Paint (mobile, 4G) | under 2.5 s |
| Lighthouse Performance / Accessibility / SEO | 85+ / 95+ / 95+ |
| Contact form submissions | 10+ per month |
| Average time on page | over 90 seconds |
| Project card click-through to a live site | over 25% of visitors |

**In scope:** public single page, admin panel with full CRUD, contact form with inbox, SEO, analytics hook, deployment. **Out of scope for v1:** blog, Bangla or other languages (English only), online payments, client login area.

## 2. Audience

Three kinds of visitors decide whether the site works: people who hire, people who recruit, and people who refer.

| Persona | What they want in 30 seconds | What the site must show |
| --- | --- | --- |
| Business owner or logistics company needing a website | Proof that Monayem delivers real, working business sites | Live project planets, results, a clear "Start a project" button |
| Agency or studio looking for a freelancer | Stack depth and clean delivery | Skills constellation, tech tags per project, GitHub link |
| Recruiter or hiring manager | Experience, seniority, stack match | Timeline, downloadable resume, Laravel + React + TypeScript visible |

Visitors will mostly arrive through search, LinkedIn or a shared link, often on a phone. Mobile must be a first-class experience, not a fallback.

## 3. Design concept: Mission Control

The visitor boards a ship that Monayem pilots. Everything is dark, deep and lit from within, like an instrument panel at night with real planets outside the window.

**Colour palette**

| Token | Hex | Use |
| --- | --- | --- |
| Deep Space | #05060F | Page background |
| Nebula Violet | #7C3AED | Primary accent, glows, buttons |
| Aurora Cyan | #22D3EE | Links, highlights, data lines |
| Solar Flare | #F59E0B | Call to action, warnings, sun glow |
| Stardust | #E2E8F0 | Body text |
| Cosmic Dust | #94A3B8 | Secondary text |

**Typography.** Headings in Orbitron or Space Grotesk for a sci-fi feel; body in Inter; small code-like labels (coordinates, "MISSION 03") in JetBrains Mono.

**Visual language**

- Glassmorphism panels with a thin glowing border, like heads-up displays.
- Mission-control details: fake telemetry numbers, coordinates, a progress bar showing "distance travelled" while scrolling.
- Light and shadow from one sun, so planets look physically consistent.
- Rounded, soft glow shadows; no flat grey boxes anywhere.
- Both themes ship in v1: Deep Space (dark) and Solar (light), with a sun and moon toggle that follows the visitor's system setting and remembers their choice. Solar keeps the space feel with a pale sky background (#F6F7FB), dark navy text (#0F172A), and the same violet, cyan and amber accents darkened for contrast.

## 4. Single-page structure

One long page with ten sections, a fixed floating navigation (a small orbit-dot menu), and smooth scroll between them. Each section is a "zone" of the journey, and every block of text, image and link inside it is managed from the admin panel.

| # | Section | Space metaphor | Content | Signature animation |
| --- | --- | --- | --- | --- |
| 1 | Hero | Launch pad | Name, role line that types and rotates, two buttons (View projects, Hire me) | Rocket or camera launch through a 3D starfield; name assembles from particles |
| 2 | About | Mission briefing | Photo, short bio, quick facts, resume download | Photo inside a glowing porthole; counters count up (projects, years, clients) |
| 3 | Skills | Constellations | Laravel, Vue.js, React, TypeScript, PHP, MySQL, GitHub, WordPress, UI/UX, ecommerce | Skills are stars joined by lines; hover lights a constellation and shows level |
| 4 | Projects | Solar system | Six live sites as planets (see section 5) | Horizontal fly-through; planet zooms to a detail panel on click |
| 5 | Services | Space stations | Full-stack apps, CMS, ecommerce, WordPress, UI/UX | Cards dock in from the sides with a magnetic hover |
| 6 | Experience | Flight log | Career and milestone timeline | A comet travels down the line and lights each milestone as it passes |
| 7 | Process | Launch sequence | Discover, design, build, test, launch, support | Countdown-style step reveal |
| 8 | Testimonials | Transmissions | Client quotes with name, company, photo | Signal-wave animation, auto-rotating carousel |
| 9 | Contact | Open channel | Form, email, phone, WhatsApp, social links | Radar ping on submit; success shows a "message transmitted" satellite |
| 10 | Footer | Landing | Copyright, links, back-to-top | Rocket button flies back to the top |

The order and visibility of every section can be changed from the admin panel, so a section can be hidden (for example Testimonials until quotes exist) without touching code.

## 5. Project showcase: six planets

Each live site becomes its own planet with a different look, orbit speed and reveal animation, so no two projects feel like the same card repeated. The planet's colour and surface are chosen to echo the real site's brand.

| Project | Live site | Planet concept | Entry and hover behaviour |
| --- | --- | --- | --- |
| Mercury | [mercury-bd.com](https://mercury-bd.com/) | Mercury, small and fast, close to a bright sun | Fastest orbit; leaves a short comet trail; hover speeds the spin |
| ASN Group | [asngroup-bd.com](https://www.asngroup-bd.com/) | Cargo space station with docking ports | Station rotates slowly; a freight ship docks on hover and opens the detail panel |
| Tasa | [tasa.com.bd](https://tasa.com.bd/) | Warm amber planet with a leather-grain texture | Surface shifts like a slow dune; hover reveals product-style close-up |
| Tazwar BD | [tazwarbd.com](https://tazwarbd.com/) | Large ringed gas giant | Rings tilt toward the cursor; each ring is a feature tag (stack, role, year) |
| Sinbad Shipping Lines | [sinbadshippinglines.com](https://sinbadshippinglines.com/) | Ocean planet with a starship voyaging across it | Ship sails along the surface path; hover pauses it and shows route-style details |
| Ayra España | [ayraespana.com](https://ayraespana.com/) | Red desert world with a moon | Moon orbits the planet; hover splits the planet to reveal a screenshot core |

**What happens when a planet is clicked**

1. The camera flies in and the other planets blur and dim.
2. A glass detail panel opens with a large screenshot (or short looping video), the project summary, Monayem's role, tech tags, the complete list of every feature he built (grouped by area, such as public site, admin, integrations) and an optional result line.
3. Two buttons: **Visit live site** (new tab) and **Next planet**.
4. Esc, a close button, or a swipe down returns to the solar system.

**Rules for the showcase**

- Screenshots and short videos are stored in the media library, because many live sites refuse to load inside an iframe. A live preview iframe is an optional per-project toggle.
- Planets are drawn with Three.js on desktop; on low-power phones they fall back to pre-rendered animated images.
- Projects are not limited to six: adding a seventh in the admin creates another planet automatically, with the planet style chosen from a preset list.
- Each project can also be marked "featured" to appear larger and earlier in the orbit.

### Draft feature lists for the detail panels

These are seed content for each planet's feature list, loaded into the admin on install. Tasa, Tazwar BD and Ayra España were read from the live sites. Mercury, ASN and Sinbad load their pages with JavaScript, so their lists come from your earlier project notes and need your review.

**Tasa** ([tasa.com.bd](https://tasa.com.bd/)): premium handcrafted leather goods brand, Chattogram. WordPress and WooCommerce store.

- Shop: 6 top categories (Bags, Wallets, Corporate, Fashions, Travels, Accessories) with sub-categories such as Backpack, Briefcase, Laptop Bag, Long Wallet, Bifold, Trifold
- Product cards with sale badges, discount percentages, variant selection, quick view, add to compare, wishlist, star ratings, sold-out labels
- Combo offers and gift bundles; special-sale banners; hero slider
- Cart in Bangladeshi taka, checkout, customer login, registration, password reset, account area
- Live product search
- Content pages: Our Story, About, Contact, Leather Care, Materials, Shipping and Returns, Terms, Privacy; blog with articles on leather quality and design
- Trust blocks: 1-year warranty, honest pricing, sustainable materials, 20,000+ customers counter
- Links to the Daraz flagship store, Facebook and Instagram
- SEO metadata, Open Graph tags and mobile-responsive layout

**Tazwar BD** ([tazwarbd.com](https://tazwarbd.com/)): modern fashion and lifestyle brand, Chattogram. WordPress and WooCommerce store.

- Shop with categories for Polo, Dropshoulder, Coat and Bags, each showing its product count
- Featured products and bestsellers sections with hover image swap
- Variant products, quick view, compare, wishlist, add to cart, sale pricing
- Cart, customer login, registration and account area
- Announcement bar for free shipping, newsletter and FAQ links, social sharing buttons
- Facebook pixel tracking, SEO metadata, Open Graph and Twitter cards
- Mobile-first responsive layout

**Ayra España** ([ayraespana.com](https://ayraespana.com/)): smartphones, laptops and gadgets store in Madrid. WordPress and WooCommerce store.

- Spanish and English versions with a language switcher
- Mega-menu with deep categories (Accessories, Laptops, PCs, Smartphones by brand, Tablets, Games, Cameras, Appliances)
- Brand pages for 30+ brands
- Deal sections with countdown timers, promo banners and a promotional pop-up
- Best-seller tabs and popular-product carousels by category
- Product page extras: colour options, optional extended warranty (up to 4 years), return and exchange notes
- Warranty claim page, contact page, blog, newsletter signup
- Euro pricing, wishlist, quick view, cart, customer accounts
- Free-shipping threshold bar

**Sinbad Shipping Lines** ([sinbadshippinglines.com](https://sinbadshippinglines.com/)): corporate shipping company site. Laravel, Vue.js, Tailwind CSS and MySQL.

- Four pages: Home, Services, About Us, Contact Us, with all other content as sections
- Services: bulk vessel, bulk cargo, container shipping, sea freight, cargo handling, port and logistics support
- Shipping routes from China, India, Thailand, Taiwan, Nepal and Uzbekistan to Bangladesh; cargo types (bulk, container)
- About sections: who we are, vision, mission, network, customer commitment, licensing and compliance, leadership
- Resources area: shipping guides, industry insights, news
- Dashboard where every component is editable with full CRUD
- On-page SEO and a corporate design built from the brand's lime-green logo

**ASN Group** ([asngroup-bd.com](https://www.asngroup-bd.com/)): corporate site for a Bangladesh freight forwarding company. Laravel 13, Vue 3, Inertia.js, Tailwind CSS, DaisyUI and MySQL.

- Corporate website for international freight forwarding services
- Light-theme "Glass Horizon" design system
- Database-driven content with an admin dashboard
- Feature list to confirm: services, tracking or quote forms, and the admin modules you built

**Mercury Bangladesh** ([mercury-bd.com](https://mercury-bd.com/)): corporate website, the earlier project that led to the ASN build.

- Feature list to confirm: I could not read this site, so please send what it includes

## 6. Animation and interaction

The site is animated in five layers. Heavy layers load lazily so the first screen appears fast.

| Layer | What it does | Tool |
| --- | --- | --- |
| Background | 3D starfield, drifting nebula, shooting stars, parallax by mouse and scroll | Three.js with React Three Fiber |
| Scroll story | Section reveals, pinned scenes, camera flying between zones, scroll progress "distance" meter | GSAP ScrollTrigger plus Lenis smooth scroll |
| Component motion | Page-load sequence, hover states, modals, carousel, layout transitions | Framer Motion |
| Cursor | Custom glowing cursor with a comet trail; magnetic buttons (desktop only) | Custom React hook |
| Micro details | Typing role line, counters, glowing borders, button ripples, sound-free loader with rocket and percent | CSS and SVG |

**Performance budget**

- Initial JavaScript under 250 KB gzipped; the 3D scene and GSAP load after first paint.
- 60 fps on a mid-range laptop, at least 30 fps on a mid-range phone.
- Device check: weak devices get a lighter starfield (CSS or 2D canvas) automatically.
- Images in WebP or AVIF, videos under 2 MB each, lazy-loaded.

**Accessibility for motion**

- `prefers-reduced-motion` turns off flying, parallax and particles, and keeps simple fades.
- A visible "Reduce effects" toggle in the corner for everyone.
- Nothing essential (links, text, contact info) is ever only reachable through an animation.
- Optional ambient space sound, off by default, with a mute button.

## 7. Admin panel and CRUD

A private admin panel at /admin, built in the same Laravel and React app, controls everything on the public page. If a piece of content is visible on the site, it can be created, edited, reordered, hidden or deleted from here.

| Module | Editable content | Operations |
| --- | --- | --- |
| Site settings | Site title, logo, favicon, colours for both themes, default theme, animation intensity, social links, WhatsApp number, booking link, contact email, resume PDF | Read, update |
| Sections | Order, visibility, heading and intro text of each of the ten sections | Reorder, show or hide, update |
| Hero | Name, role lines, buttons, background options | Update |
| About | Bio, photo, quick facts, counters | Update; create, update, delete facts |
| Skills | Name, category, level, icon, constellation group | Create, read, update, delete, drag-reorder |
| Projects | Title, slug, live URL, summary, role, year, tech tags, features, planet style, screenshots, video, featured flag | Create, read, update, delete, reorder, publish or draft |
| Services | Title, description, icon | Create, read, update, delete, reorder |
| Experience | Role, company, dates, description | Create, read, update, delete, reorder |
| Process steps | Title, description | Create, read, update, delete, reorder |
| Testimonials | Quote, name, company, photo, project link | Create, read, update, delete, publish or hide |
| Media library | Images, videos, files | Upload, rename, replace, delete |
| Messages | Contact form submissions | Read, mark read, reply by email, delete |
| SEO | Title, description, share image, structured data | Update |

**Admin features that apply everywhere**

- Secure login with password reset; one owner account in v1.
- Draft and publish states, plus a live preview before saving.
- Drag-and-drop ordering and image cropping.
- Validation messages, confirmation before delete, and soft delete with restore for projects.
- Changes appear on the public page right away; cached pages clear automatically.
- Seed data: the six live projects and Monayem's skills are loaded on install so the site is never empty.

## 8. Tech stack and architecture

One Laravel app serves both the public page and the admin panel, using Inertia.js so React pages get data directly from Laravel controllers without a separate API to maintain.

| Area | Choice | Why |
| --- | --- | --- |
| Backend | Laravel (current stable) with PHP 8.3+ | Monayem's main stack; fast CRUD; built-in auth, validation, queues, mail |
| Frontend | React with TypeScript, Inertia.js, Vite | Requested; Laravel's official React starter kit gives auth and layout out of the box |
| Styling | Tailwind CSS, with shadcn/ui components for the admin | Fast, consistent, easy to theme to the space palette |
| 3D and motion | Three.js with React Three Fiber, GSAP, Framer Motion, Lenis | Covers background, scroll story and component animation |
| Database | MySQL | Known stack; simple relational data |
| Media | Laravel storage with an image-processing package for WebP resizing | Responsive images and thumbnails |
| SEO rendering | Inertia server-side rendering for the public page | Search engines and link previews see full content |
| Mail | Laravel Mail with SMTP | Contact form notifications |
| Source control and deploy | GitHub, with GitHub Actions to build and deploy | Repeatable releases |

**How a request flows.** Visitor opens the page, Laravel loads published content from MySQL, Inertia renders the React page on the server, and the browser hydrates it and then lazily loads the 3D scene. In the admin, forms post to Laravel controllers, which validate, save, clear the page cache, and return the updated screen.

**Project layout.** Public page components live under a `Portfolio` folder, admin pages under `Admin`, and shared animation hooks and 3D scenes under `Experience`, so the heavy visual code stays separate from the CRUD code.

## 9. Data model

All tables use an auto-increment id, timestamps, and where relevant `sort_order` and `is_published`.

| Table | Key fields |
| --- | --- |
| users | name, email, password (single admin) |
| settings | key, value (site title, colours, social links, effects level, resume file) |
| sections | key, title, subtitle, sort\_order, is\_visible |
| about\_facts | label, value, sort\_order |
| skills | name, category, level, icon, sort\_order |
| projects | title, slug, summary, description, role, year, live\_url, planet\_style, accent\_color, is\_featured, is\_published, sort\_order |
| project\_media | project\_id, media\_id, type (screenshot, video), caption, sort\_order |
| project\_features | project\_id, group\_label, text, sort\_order |
| tags | name, slug (Laravel, React, MySQL and so on); joined to projects by a pivot table |
| services | title, description, icon, sort\_order |
| experiences | role, company, start\_date, end\_date, description, sort\_order |
| process\_steps | title, description, sort\_order |
| testimonials | quote, author\_name, company, photo, project\_id (optional), is\_published |
| media | path, disk, mime, width, height, alt\_text |
| messages | name, email, subject, body, read\_at, ip |
| seo\_meta | page, title, description, og\_image |

## 10. Non-functional requirements

| Area | Requirement |
| --- | --- |
| SEO | Server-rendered content, unique title and description, Open Graph and Twitter cards, JSON-LD Person and CreativeWork markup, sitemap.xml, robots.txt |
| Accessibility | WCAG 2.2 AA contrast on the dark theme, full keyboard navigation, focus rings, alt text on every image, skip link, reduced-motion support |
| Security | CSRF protection, validated and sanitised input, rate-limited and honeypot-protected contact form, hashed passwords, optional two-factor for admin, file-type and size checks on uploads, HTTPS only |
| Performance | Budget in section 6, page and query caching, indexed queries, CDN-friendly asset names |
| Responsiveness | Designed for 360 px phones up to 1920 px desktops; touch gestures replace hover effects on mobile |
| Browser support | Latest two versions of Chrome, Edge, Safari, Firefox; WebGL fallback when unsupported |
| Analytics | Privacy-friendly analytics (such as Plausible or Google Analytics) set from the admin, with a cookie notice if required |
| Maintainability | TypeScript strict mode, Laravel Pint and ESLint, feature tests for every CRUD module, `.env`-based configuration |

## 11. Roadmap, acceptance and open questions

A solo build takes roughly 9 weeks. These durations are estimates and assume part-time hours can stretch each phase.

1. **Discovery and design (1 week):** collect screenshots and copy for the six projects, moodboard, wireframes, and a Figma design of the hero, solar system and admin.
2. **Foundation (1 week):** Laravel and React starter kit, database migrations, seeders, auth, deployment pipeline.
3. **Admin CRUD (2 weeks):** all modules in section 7, media library, drafts and ordering, tests.
4. **Public page and animation (3 weeks):** ten sections, 3D starfield, planets, scroll story, mobile layouts, fallbacks.
5. **Content, QA and performance (1.5 weeks):** real content, Lighthouse and device testing, accessibility pass, SEO.
6. **Launch (0.5 week):** domain, SSL, analytics, backups, handover notes.

**Acceptance criteria**

- [x] All six live projects appear as planets with their own look and a working detail panel.
- [x] Every item in section 7 can be created, edited, reordered and deleted without touching code.
- [x] A change saved in the admin shows on the public page within seconds.
- [x] Lighthouse targets from section 1 are met on mobile.
- [ ] Reduced-motion and low-power fallbacks work.
- [x] Contact form emails Monayem and stores the message in the inbox.
- [x] Site works at 360 px, 768 px and 1440 px widths.

**Open questions**

- [ ] Answered: all six were built by Monayem from scratch for real businesses, so each is shown as a full build. Every feature you built is listed on each project's detail panel, grouped by area, with no limit on items. Drafts for all six are in section 5. Still needed: your review of them, plus the feature lists for Mercury and ASN, and the admin features of Sinbad and ASN.
- [ ] Decided: domain and hosting will be bought later. Recommendation: a small VPS with Node.js so server-side rendering works; plain shared hosting would mean dropping server-side rendering.
- [ ] Decided: yes, your photo and a downloadable resume PDF are on the page, both managed from the admin.
- [ ] Decided: yes, the contact section includes WhatsApp and a booking link, both editable in site settings.
- [ ] Decided: English only, no Bangla. Light and dark themes both ship in v1.
- [ ] Decided: more projects exist and will be added later through the admin; the six are the launch set.
