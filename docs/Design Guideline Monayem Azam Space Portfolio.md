# Design Guideline: Monayem Azam Space Portfolio

Oct 19, 2026 · @Monayem

## 1. Design principles

The look is **Mission Control**: a calm, precise instrument panel in front of a deep, glowing universe. This guideline extends section 3 of the [PRD](https://claude.ai/code/artifact/c16fc2c3-eef2-4713-84f1-8e7dffd086e6) and is the single source for every visual decision.

1. **Content first, space second.** The universe is the stage. Text, project planets and buttons must always stay clearly readable on top of it.
2. **One sun.** Light comes from the top right. Planets, glows and shadows all follow that direction.
3. **Glow means interactive.** Only things a visitor can click, hover or focus glow. Decoration stays quiet.
4. **Motion has a job.** Every animation explains, guides or rewards. Nothing moves just to move.
5. **Both themes are first-class.** Deep Space (dark) and Solar (light) are designed together, never one as an afterthought.
6. **Fast by design.** Beautiful effects must fit the performance budget in PRD section 6.

**Mood words:** deep, precise, luminous, calm, confident. **Avoid:** cartoonish, neon overload, cluttered, flat grey.

## 2. Colour system

Colours are CSS variables on `:root` for light and `[data-theme="dark"]` for dark. Components never use raw hex values, only tokens.

| Token | Deep Space (dark) | Solar (light) | Use |
| --- | --- | --- | --- |
| `--bg` | #05060F | #F6F7FB | Page background |
| `--bg-elevated` | #0B0E1F | #FFFFFF | Sections with a tint, drawers |
| `--surface` | rgba(18, 22, 48, 0.55) | rgba(255, 255, 255, 0.70) | Glass panels (with blur) |
| `--surface-border` | rgba(124, 58, 237, 0.35) | rgba(91, 33, 182, 0.20) | Glass panel edge |
| `--text` | #E2E8F0 | #0F172A | Body and headings |
| `--text-muted` | #94A3B8 | #475569 | Secondary text, captions |
| `--primary` | #7C3AED | #6D28D9 | Main accent, buttons, glows |
| `--secondary` | #22D3EE | #0E7490 | Links, data lines, highlights |
| `--accent` | #F59E0B | #B45309 | Calls to action, sun glow |
| `--success` | #34D399 | #047857 | Success messages |
| `--danger` | #F87171 | #B91C1C | Errors, delete actions |
| `--star` | #FFFFFF | #6D28D9 | Star dots (light theme uses violet dots on soft sky) |

**Gradients**

- Hero glow: radial from `--primary` at 35% opacity to transparent.
- Primary button: linear 135 degrees from `--primary` to `--secondary`.
- Text highlight: linear from `--secondary` to `--primary`, used only on one key word per heading.
- Solar theme sky: a soft vertical gradient from #F6F7FB to #E8ECFA, with faint violet stardust.

**Contrast rules**

- Body text must reach 4.5 to 1 against its background in both themes; large text and icons 3 to 1.
- Never place muted text on a glowing area. Put it on a glass panel.
- Accent amber is for one call to action per screen at most.
- Check every new colour pair with a contrast checker before shipping.

## 3. Typography

Three fonts, each with one job. All loaded with `font-display: swap`; self-host the files for speed.

| Role | Font | Fallback | Use |
| --- | --- | --- | --- |
| Display | Orbitron (or Space Grotesk if Orbitron feels too heavy in testing) | system-ui | Hero name, section titles, big numbers |
| Body | Inter | system-ui, sans-serif | Paragraphs, buttons, forms, admin |
| Mono | JetBrains Mono | ui-monospace | Labels like "MISSION 03", coordinates, tags, telemetry |

**Type scale (desktop, then mobile)**

| Style | Desktop | Mobile | Weight | Line height | Notes |
| --- | --- | --- | --- | --- | --- |
| Hero name | 88 px | 44 px | 800 | 1.05 | Display font, letter spacing 0.02 em |
| Section title | 48 px | 30 px | 700 | 1.15 | Display font |
| Subtitle | 24 px | 18 px | 500 | 1.4 | Body font, muted colour |
| Card title | 22 px | 20 px | 600 | 1.3 | Display or body |
| Body | 17 px | 16 px | 400 | 1.7 | Maximum line length 68 characters |
| Small | 14 px | 14 px | 400 | 1.5 | Captions, helper text |
| Mono label | 12 px | 12 px | 500 | 1.4 | Uppercase, letter spacing 0.14 em |

**Rules**

- Use fluid sizing with `clamp()` so sizes move smoothly between mobile and desktop.
- Highlight at most one word per heading with the text gradient.
- Never use pure white text on the light theme or pure black on the dark theme; use the `--text` token.
- Bangla text is not needed in this project; English only.

## 4. Layout, spacing and depth

**Grid and breakpoints**

| Name | Width | Columns | Side gutter | Notes |
| --- | --- | --- | --- | --- |
| Mobile | 360 to 639 px | 4 | 16 px | Single column, stacked cards |
| Tablet | 640 to 1023 px | 8 | 24 px | Two-column cards |
| Desktop | 1024 to 1439 px | 12 | 32 px | Content max width 1120 px |
| Wide | 1440 px and up | 12 | 48 px | Content max width 1280 px, background stays full width |

**Spacing scale** (multiples of 4 px): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Sections use 96 px vertical padding on desktop and 64 px on mobile.

**Corner radius:** 8 px for inputs and chips, 16 px for cards, 24 px for large panels, full round for planets and avatar frames.

**Depth and effects**

- **Glass panel:** background `--surface`, 16 px backdrop blur, 1 px `--surface-border`, soft outer glow of `--primary` at 20% opacity. Provide a solid-colour fallback where blur is unsupported.
- **Glow:** only on interactive elements, `0 0 24px` of `--primary` at 40% on hover and focus.
- **Shadow:** `0 20px 60px` black at 40% (dark theme) or `0 20px 60px` violet at 15% (light theme).
- **Z-order:** starfield 0, content 10, navigation 50, project panel 80, loader 100, cursor 110.
- **Section dividers:** a thin line with a small moving light, never a heavy rule.

## 5. Core components

| Component | Look | States |
| --- | --- | --- |
| Primary button | Gradient from `--primary` to `--secondary`, 48 px tall, 12 px radius, medium-weight text, Lineicons arrow | Hover: lifts 2 px, glow, magnetic pull toward cursor. Focus: 3 px cyan ring. Pressed: scales to 0.97. Disabled: 40% opacity, no glow |
| Secondary button | Transparent with 1 px `--primary` border and `--text` label | Hover fills with `--primary` at 15%. Same focus ring |
| Call-to-action button | Solid `--accent` with dark text, used once per screen (Hire me, Send message) | Hover: sun-flare glow |
| Glass panel | As defined in section 4, 24 px padding on mobile, 32 px on desktop | Hover on clickable panels: border brightens, 4 px lift |
| Input and textarea | 48 px tall, `--surface` fill, 1 px border, label above in mono style | Focus: cyan border and glow. Error: `--danger` border plus message under the field. Success: green check |
| Tag chip | 28 px tall, mono 12 px text, `--primary` at 15% fill, full radius | Hover: brighter fill. Selected (admin): solid `--primary` |
| Orbit-dot navigation | Vertical stack of small dots on the right edge (desktop), one per section; the active dot is a larger glowing ring | Hover shows the section name in a small label; click scrolls smoothly |
| Mobile menu | Round floating button bottom right opening a full-screen glass overlay with large links | Opens with a circular reveal; closes with Esc or swipe down |
| Tooltip | Small glass bubble, mono 12 px text, 8 px offset, arrow | Shows on hover and keyboard focus; never holds essential information |
| Modal and project panel | Large glass panel over a dimmed, blurred scene | Traps focus, closes with Esc, close button and swipe down |
| Toggle (theme, reduce effects) | Pill switch with sun and moon icons, 40 by 24 px | Focus ring; state also announced to screen readers |
| Toast (admin) | Small glass panel bottom right, success or error accent | Auto-hides after 4 seconds, stays on error until dismissed |

## 6. Section layouts

Each section is a full-width band with 96 px vertical padding. Sketches show desktop; mobile rules follow each one.

**1. Hero (100 vh)**

```text
+--------------------------------------------------+
| logo                                  [theme]    |
|                                                  |
|        MISSION 01 / LAUNCH                       |
|        MONAYEM AZAM                              |
|        Full-stack developer . _typed role_       |
|        [ View projects ]  [ Hire me ]            |
|                                                  |
|                 scroll cue (rocket)              |
+--------------------------------------------------+
```

Mobile: text centred, name 44 px, buttons stacked full width.

**2. About**

```text
+--------------------------------------------------+
|  (porthole photo)    MISSION BRIEFING            |
|                      bio paragraph               |
|                      [facts] [facts] [facts]     |
|                      counter . counter . counter |
|                      [ Download resume ]         |
+--------------------------------------------------+
```

Mobile: photo on top, text below, counters in a 2-column grid.

**3. Skills (constellations)**

```text
+--------------------------------------------------+
|  SKILLS  .  . *---*                              |
|        *--*    \  *  (Backend)   *--*--*          |
|   (Frontend)    *            (Platforms)         |
|            hover: panel with name, level, icon   |
+--------------------------------------------------+
```

Mobile: constellations become grouped chip grids, tap shows level.

**4. Projects (solar system)**

```text
+--------------------------------------------------+
|  PROJECTS      drag or scroll  <  >              |
|   (o)    (O)    (@)     ((O))    (o)    (O)      |
|  Mercury  ASN   Tasa  Tazwar  Sinbad  Ayra       |
|  name, year, tags appear under the hovered one   |
+--------------------------------------------------+
```

Mobile: vertical list of planet cards, each opening the same detail panel.

**5. Services**

```text
+--------------------------------------------------+
|  [icon] Full-stack apps   [icon] CMS             |
|  [icon] Ecommerce         [icon] WordPress       |
|  [icon] UI/UX design                             |
+--------------------------------------------------+
```

Three columns on desktop, two on tablet, one on mobile.

**6. Experience (flight log):** a central vertical line with milestone nodes alternating left and right on desktop; all on one side on mobile.

**7. Process:** six step panels in a row on desktop with a connecting line and a countdown number each; a vertical stack on mobile.

**8. Testimonials:** one large quote panel in the centre with a signal-wave line behind it, dots below, arrows at the sides.

**9. Contact**

```text
+--------------------------------------------------+
|  OPEN CHANNEL                                    |
|  [ form: name  email  subject  message ]  | email|
|  [ Send message ]                         | phone|
|                                           | WhatsApp
|                                           | Book a call
+--------------------------------------------------+
```

Mobile: contact links first, then the form.

**10. Footer:** one row with copyright, social links and the rocket back-to-top button.

## 7. Planet visual specs

Planets are drawn in Three.js with a shared sun light from the top right. Textures are small (512 px) and generated procedurally or from one compressed image each. Every planet has an accent colour that the admin can override.

| Project | Style key | Colours | Surface and extras | Idle motion | Hover motion |
| --- | --- | --- | --- | --- | --- |
| Mercury | `rocky` | Grey-silver with warm highlights | Cratered rock, thin sun-facing glow | Fast spin, 12 s per turn; short comet trail | Spin speeds up 2x, trail lengthens |
| ASN Group | `station` | Steel blue with cyan window lights | Ring-shaped cargo station with 4 docking arms | Slow rotation, 40 s per turn; blinking lights | A freight ship glides in and docks, panel hint appears |
| Tasa | `amber` | Warm amber and deep brown | Leather-grain bump texture, soft stitch line around the equator | Very slow drift of the surface | Surface zooms slightly to a close-up grain |
| Tazwar BD | `ringed` | Cream, sand and muted violet bands | Gas bands plus two tilted rings; ring segments carry tags (stack, role, year) | Gentle ring wobble | Rings tilt toward the cursor |
| Sinbad Shipping Lines | `ocean` | Deep blue with lime-green accent from the brand | Water surface with cloud wisps; a small starship sails a path on top | Ship loops around the planet in 18 s | Ship stops, route line and label appear |
| Ayra España | `desert` | Red-orange with dark canyons | One grey moon orbiting at a tilt | Moon orbit, 15 s | Planet splits open to reveal a screenshot core, closes on leave |
| Any new project | `generic` | Uses the project's accent colour | Smooth sphere with a soft atmosphere ring | Slow spin | Glow and slight scale up |

**Common rules**

- Size: normal planets 140 px diameter at 1440 px width; featured planets 200 px; mobile cards show a 96 px planet image.
- Each planet has a name label (display font) and a mono sub-label with year and a few tags, shown below it.
- A thin orbit line (1 px, `--secondary` at 20%) connects planets in order, with a tiny moving light.
- Planet palettes echo the real site's brand but stay inside the theme; never copy a client logo onto a planet.
- In the Solar (light) theme, planets keep their colours; only the sky behind them changes, and shadows become softer.
- The generic style must always work, so a newly added project never renders blank.

## 8. Motion specification

**Timing and easing**

| Type | Duration | Easing | Examples |
| --- | --- | --- | --- |
| Micro | 150 to 200 ms | ease-out | Hover colour, button press, toggle |
| Standard | 300 to 450 ms | cubic-bezier(0.22, 1, 0.36, 1) | Panels, chips, card hover lift |
| Reveal | 600 to 800 ms | cubic-bezier(0.16, 1, 0.3, 1) | Section content entering on scroll |
| Scene | 900 to 1400 ms | cubic-bezier(0.65, 0, 0.35, 1) | Camera fly-in to a planet, hero launch |
| Ambient | 8 to 60 s loops | linear | Star drift, planet spin, moon orbit |

**Scroll behaviour**

- Sections reveal when 20% enters the screen: fade and rise 32 px, children staggered by 80 ms, once only.
- A thin progress line at the top shows how far the visitor has travelled; the "distance" number in mono type updates beside it.
- Smooth scrolling uses Lenis with a moderate lerp (0.1). It is switched off for reduced motion.
- Pinned or scrubbed scenes are limited to the hero and the experience timeline, so normal scrolling never feels trapped.

**Signature moments**

| Moment | What happens | Length |
| --- | --- | --- |
| Loader | Small rocket rises through a percent counter, then dissolves into the starfield | 1.2 to 2 s, never more |
| Hero entrance | Camera pushes forward, name assembles from particles, role line starts typing | 2.2 s |
| Planet open | Camera flies to the planet, others blur and dim, glass panel scales in | 1.1 s |
| Contact sent | Radar ping, then a satellite flies off with "message transmitted" | 2 s |
| Back to top | Rocket button launches upward while the page scrolls up | 1.2 s |

**Reduced motion and low power**

| Setting | Behaviour |
| --- | --- |
| Effects: full | Everything above |
| Effects: light (admin setting, or auto on weak devices) | 2D canvas starfield, no custom cursor, no particle name, simple fades |
| Effects: off, or `prefers-reduced-motion` | Static starfield image, no parallax or scroll animation, instant panel open, carousels do not auto-rotate |

A visible "Reduce effects" toggle is always available, and its choice is remembered.

## 9. Icons, imagery and media

- **Icons:** Lineicons, outline style only, 24 px by default, 1.5 px stroke feel, coloured with `currentColor`. Skills and services store the icon name in the database, so the admin shows an icon picker with search.
- **Photo of Monayem:** square 1:1, at least 800 px, shown inside a round porthole frame with a thin glowing ring. Background should be plain or easy to crop. Light and dark both use the same photo.
- **Project screenshots:** 16:10 ratio, at least 1600 px wide, exported as WebP; one desktop and one mobile shot per project where possible. Cover image is the first.
- **Project videos:** MP4 or WebM, 5 to 12 seconds, silent loop, under 2 MB, poster image required.
- **Share image (Open Graph):** 1200 by 630 px, dark space background, name and role in display font.
- **Favicon:** a small glowing planet or rocket on transparent background, in 32, 180 and 512 px sizes.
- **Alt text** is mandatory for every image and is edited in the media library.
- **No stock rocket clip art.** Use drawn SVG shapes in the theme colours so everything stays consistent and light.

## 10. Admin panel UI

The admin is calm and practical. It shares the colour tokens, fonts and components above, but with no starfield animation, so work stays fast and focused. Dark and light both apply.

**Layout**

```text
+---------+----------------------------------------+
| logo    |  breadcrumb            [theme] [user]  |
| Dashboard|---------------------------------------|
| Settings|  Page title              [ + New ]     |
| Sections|  [search]  [filters]                   |
| Hero    |  +----------------------------------+  |
| About   |  | drag | item | status | actions  |  |
| Skills  |  | drag | item | status | actions  |  |
| Projects|  +----------------------------------+  |
| Services|  pagination                            |
| ...     |                                        |
+---------+----------------------------------------+
```

**Screens and patterns**

| Screen | Layout | Key details |
| --- | --- | --- |
| Login | Centred glass card on a quiet starfield | Email, password, show password, forgot password link, no registration link |
| Dashboard | Row of count cards, recent messages list, quick links (Add project, Edit hero) | Unread messages highlighted with the accent colour |
| List screens | Data table with drag handle, title, status chip, updated date, action menu | Search at the top, bulk delete only in Trash, empty state with an illustration and a "Create the first one" button |
| Edit forms | Two columns on desktop: main fields left, side panel right (publish toggle, featured, order, preview) | Sticky save bar at the bottom with Save, Save and close, Cancel; unsaved-changes warning |
| Project form | Tabs: Details, Features, Media, SEO | Features tab supports a bulk paste box and drag ordering; Media tab shows thumbnails with caption fields |
| Media library | Grid of thumbnails with filter by type, side panel for alt text and file info | Drag-and-drop upload with progress bars; "in use" badge on files used somewhere |
| Messages inbox | Two panes: list left, message right | Unread bold with a dot; Reply opens the mail app; Delete asks for confirmation |
| Delete dialog | Small glass dialog naming the item | Danger button on the right, Cancel focused by default |

**Rules:** every action shows a toast; every form shows field-level errors; no screen needs more than two clicks to reach from the dashboard.

## 11. Responsive, accessibility and checklist

**Responsive rules**

- Design mobile first at 360 px, then enhance at 640, 1024 and 1440 px.
- Touch targets are at least 44 by 44 px. Hover effects have a tap or focus equivalent.
- No horizontal scroll at any width. Long words and URLs wrap.
- Heavy effects (particle name, 3D planets, custom cursor) are desktop only; mobile gets lighter versions.
- Test on a real mid-range Android phone as well as the browser device toolbar.

**Accessibility rules**

- Meet WCAG 2.2 AA in both themes.
- Every interactive element is reachable and operable with the keyboard, with a visible 3 px focus ring in `--secondary`.
- The project panel and mobile menu trap focus and return it to the opener on close.
- Headings follow a logical order; each section has one `h2`.
- Information is never carried by colour alone.
- Respect `prefers-reduced-motion` and the "Reduce effects" toggle everywhere.

**Final design checklist (tick before launch)**

- [ ] Every colour comes from a token; no raw hex in components.
- [ ] Both themes reviewed for all ten sections, the project panel and the admin.
- [ ] Contrast checked for text, icons, buttons and focus rings.
- [ ] Only interactive things glow.
- [ ] Each animation matches the durations and easing in section 8.
- [ ] All six planets match the table in section 7 and the generic planet works.
- [ ] Mobile layouts match the section 6 notes with no horizontal scroll.
- [ ] Fonts self-hosted and swap correctly; no layout jump on load.
- [ ] Images are WebP, sized as specified, with alt text.
- [ ] Reduced-motion and light-effects modes were tested on a weak device.
