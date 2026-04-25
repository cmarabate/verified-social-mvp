# VerifiedSocial MVP: SEO, Accessibility, and Performance Roadmap

## Current State
- **Framework & Dependencies:** Next.js 16.2.4 (App Router), React 19.2.4, Tailwind CSS 4, `@supabase/ssr`, Stripe, and `lucide-react`. Scripts available: `dev`, `build`, `start`, `lint`, `typecheck`.
- **Observed Routes:** 
  - `/` (Homepage)
  - `/explore` (Explore Feed)
  - `/auth/login`, `/auth/signup`
  - `/verify`
  - `/account`
  - `/u/[handle]` (User Profiles)
  - `/admin/reports`
- **Implemented Primitives:**
  - `next.config.ts` is configured for `*.supabase.co` remote patterns.
  - SEO fundamentals are implemented (`sitemap.ts`, `robots.ts`, Open Graph, Twitter cards, metadata, JSON-LD).
  - Accessibility primitives are implemented (skip links, ARIA labels, semantic landmarks, reduced motion, focus visibility).
  - Performance fundamentals are implemented (loading skeletons, optimized `next/image` usage).

## Guiding Product Vision
VerifiedSocial is built as a **trust-first social platform**. Our core philosophy:
- **Browse freely, verify to post:** Anyone can explore, but contributing requires a real identity.
- **Real identity verification as a safety layer:** Not just a blue checkmark, but a meaningful safeguard against abuse.
- **Credible, modern, and safe:** Public content should feel premium and trustworthy, avoiding the sterile feel of corporate tools while remaining safe and structured.

---

## Phase 1 — Audit and Baseline
- [ ] Confirm active branch, scripts, app structure, and routes.
- [ ] Document existing Supabase auth, `is_verified`, `is_adult`, and `is_admin` behaviors.
- [ ] Capture current local dev and testing commands (`yarn dev`, `yarn lint`, `yarn typecheck`).
- [ ] Identify top pages that need metadata and UX polish (Homepage, Explore, Profiles).
- [ ] Decide on the necessity of any dedicated verification scripts (only if clearly justified).

## Phase 2 — SEO Foundations
- [x] Improve root Metadata in `layout.tsx` with a title template, robust description, app name, `metadataBase` placeholder, Open Graph config, Twitter cards, and robots settings.
- [x] Add route-level metadata for homepage, explore, auth, verify, account, user profiles, and admin routes.
- [x] Add `sitemap.ts` and `robots.ts` to the app root.
- [x] Add structured data (JSON-LD) for `WebSite`, `Organization`/`SoftwareApplication`, and potentially safe public profile/post schemas.
- [ ] Improve homepage copy to emphasize trust, verified communities, safer posting, and authenticity.
- [ ] Add social preview image strategy (static OG image or generated route).

## Phase 3 — Accessibility
- [x] Add skip-to-content link and ensure the `<main>` landmark has a stable `id`.
- [x] Improve nav semantics, `aria-current` affordances, mobile/responsive behavior, and visible keyboard focus states.
- [x] Review color contrast across the app, ensuring we do not rely on color alone for verified/admin/report states.
- [x] Ensure buttons and links have accessible names; ensure disabled states (like unauthorized interactions) remain understandable to screen readers.
- [x] Improve avatar `alt` text and implement a fallback initials mechanism.
- [x] Add `prefers-reduced-motion` support for all UI animations.
- [x] Improve form labels, error messages, success messages, and focus handling in auth, post, report, and verification flows.

## Phase 4 — Performance
- [x] Replace raw avatar `<img>` usage with a safe, optimized `<Image>` component using `next/image` (or a well-reasoned UI fallback if remote domains are unknown).
- [x] Configure `next.config.ts` for remote images (inspect Supabase storage/avatar URL patterns first).
- [x] Keep the public homepage mostly server-rendered, avoiding unnecessary client JavaScript.
- [x] Add loading/skeleton states for the feed and major interaction points (`loading.tsx` or Suspense boundaries).
- [x] Review the public feed query shape, reduce repeated Supabase calls, and verify selected columns and limits.
- [x] Document bundle/performance notes and plan for Lighthouse audits.

## Phase 5 — Premium UI, Motion, and Fun
- [ ] Build a stronger landing page with sections: Trust Layer, How Verification Works, Browse vs Verified Posting, Safety Tools, and Community Signals.
- [ ] Add an animated hero background using CSS gradients, noise, or orbs (avoiding heavy external libraries).
- [ ] Establish a shield/check/identity visual language using `lucide-react`.
- [ ] Add feed card hover polish, verified badge microinteractions, and report affordance polish.
- [ ] Implement tasteful staggered reveal animations using CSS (respecting `prefers-reduced-motion`).
- [ ] Create helpful and branded empty states (e.g., empty feed).
- [ ] (Optional) Add a "trust score explainer" or "verification journey" visual.
- [ ] Improve responsive design, ensuring controls wrap or drop gracefully instead of causing horizontal overflow.

## Phase 6 — Verification and Manual QA
Include the following exact checks:
- [ ] `yarn typecheck`
- [ ] `yarn lint`
- [ ] `yarn build`
- [ ] `yarn dev` (for manual browser testing)

Include manual browser checks:
- [ ] Homepage desktop/mobile behavior.
- [ ] Explore feed logged out vs logged in (if credentials are available).
- [ ] Keyboard-only navigation.
- [ ] Visible focus states.
- [ ] Reduced motion settings simulation.
- [ ] Metadata/OG inspection via browser devtools or page source.
- [ ] Lighthouse-style SEO/accessibility/performance spot check.

---

## Suggested Implementation Order
1. **Roadmap Only:** (Completed in this pass)
2. **Metadata, Sitemap & Robots:** Quick wins for SEO visibility.
3. **Layout, Nav & Accessibility:** Establish a strong structural baseline.
4. **Homepage Redesign:** Execute the premium UI and copy updates.
5. **Explore Feed Card Polish:** Update avatars, loading states, and interactions.
6. **Performance & Image Hardening:** Configure `next/image` and optimize queries.
7. **Manual QA & Final Cleanup:** Run all linters, builds, and browser checks.

---

## Non-Goals / Guardrails
- **Security:** Do not weaken identity verification or authorization gates.
- **Privacy:** Do not expose private user data in metadata, sitemap, structured data, or public pages.
- **Indexing:** Do not make admin, private, or account routes indexable by search engines.
- **Dependencies:** Do not introduce heavy animation libraries unless explicitly justified by actual need.
- **Accessibility:** Always respect `prefers-reduced-motion`.
- **Scope:** Keep changes incremental and verifiable. Do not redesign the backend schema unless a later implementation phase proves it is necessary.

---

## Progress Log
- **2026-04-25:** Created initial `ROADMAP_SEO_A11Y_PERFORMANCE.md` covering Phase 1 through Phase 6 planning.
- **2026-04-25:** Reconciled and implemented Phase 2 SEO Foundations (root/route metadata, JSON-LD, sitemap, robots).
- **2026-04-25:** Reconciled and implemented Phase 3 Accessibility (skip link, nav `aria-current`, button ARIA, form labels, reduced motion).
- **2026-04-25:** Reconciled and implemented Phase 4 Performance (`next/image`, `next.config.ts`, loading skeletons).
- [ ] *Future passes will log updates here...*
