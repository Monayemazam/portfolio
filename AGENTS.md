# Agent rules for space-portfolio

1. Read the sections named in the current prompt in `docs/PRD Monayem Azam Space Portfolio.md`, `docs/Design Guideline Monayem Azam Space Portfolio.md` and `docs/database-schema.md` before writing code.
2. Never hard-code site content. Text, images, links and numbers come from the database.
3. Colours come from design tokens only (`docs/Design Guideline Monayem Azam Space Portfolio.md` section 2). No raw hex in components.
4. Both themes (dark and light) must work in every component you build.
5. Every animation follows `docs/Design Guideline Monayem Azam Space Portfolio.md` section 8 and respects prefers-reduced-motion and the Reduce effects toggle.
6. Icons: Lineicons, outline style only.
7. A CRUD action is done only when verified by a database query or a hard reload. A success toast or your own report is not proof.
8. Use Form Requests for validation, policies for authorisation, and clear the cache key portfolio.page.v1 on every admin save.
9. Commit once per prompt: "prompt-NN: short title". Do not start the next prompt until the Definition of Done passes.
10. Do not add features that are not in the PRD. Ask instead.
