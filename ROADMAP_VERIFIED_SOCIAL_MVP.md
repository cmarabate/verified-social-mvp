# Verified Social Platform - MVP Roadmap

## Current State Summary (Code Review)
Based on local repository inspection:
- **Stack:** Next.js 16.2.4 (App Router), React 19.2.4, Tailwind CSS v4, Supabase SSR/Client, Stripe Identity.
- **Repository Health:** Basic Next.js setup. `README.md` is the stock template. `package.json` includes required dependencies.
- **Auth & Profiles:** Supabase auth is minimally implemented (`login`, `signup`, `logout`). Profile creation on signup is handled via Postgres trigger. Basic profile editing (`/account`) is available.
- **Social Core:** Feed (`/explore`) and profile pages (`/u/[handle]`) exist. Verified-only composer, likes, and follows are implemented. Server actions handle likes, follows, and reports.
- **Stripe Identity:** The `/verify` route has basic API endpoints for `start` and `status`. Stripe Identity webhooks are handled via `src/app/api/stripe/webhook/route.ts`, which processes `identity.verification_session.*` events and updates `identity_verifications` and `profiles`.
- **Admin & Safety:** Basic report submission and admin moderation queue (`/admin/reports`) exist. Admin audit logs are recorded.
- **UX & Accessibility:** `globals.css` includes `prefers-reduced-motion` and focus-visible utilities. Components use `lucide-react` icons. Client interaction patterns sometimes rely on primitive `alert()` rather than accessible toasts.

## Product Vision
A trust-first social network where identity verification is required for participation. The platform prioritizes safety, credibility, and accountability over viral engagement, ensuring interactions occur between verified adults.

## Target User Roles
1. **Unverified User:** Can browse public feeds and profiles, but cannot post, like, comment, or follow.
2. **Verified Adult:** Fully authenticated user who has passed Stripe Identity verification. Can post, interact, and report content.
3. **Admin:** Trusted personnel with access to moderation queues, audit logs, and sanction tools.

## Architecture Overview
- **Frontend:** Next.js App Router, React Server Components (RSC) for data fetching, Client Components for interactivity.
- **Styling:** Tailwind CSS v4.
- **Backend & Database:** Supabase Postgres. Row Level Security (RLS) enforces verified-adult rules at the database level. Server Actions handle mutations.
- **Identity:** Stripe Identity handles document verification.
- **Hosting:** Vercel (intended).

## Data Model / Supabase Requirements
- **`profiles`**: User metadata (`handle`, `display_name`, `is_verified`, `is_adult`, `is_admin`).
- **`identity_verifications`**: Tracks Stripe verification sessions and status.
- **`posts` & `comments`**: Core content tables.
- **`likes` & `follows`**: Social graph and interactions.
- **`reports` & `admin_audit_logs`**: Moderation tracking.
- **Note:** All tables have RLS policies ensuring only verified adults can mutate social data.

## Current Known Technical Risks
- Stripe configuration previously allowed unsafe fake secret fallbacks; production should fail fast and clearly when secrets are missing.
- Env vars currently accessed via non-null assertions without centralized runtime validation.
- README is stock template.
- Auth forms do not appear to render query-param errors comprehensively.
- Admin/reporting UX is basic.
- Feed lacks pagination/loading strategy beyond a 20-item limit.
- Profile updates need validation and handle uniqueness UX.
- Client components use `alert()` in several interaction paths; replace later with accessible toasts/dialog status patterns.
- Moderation actions require stronger auditability and confirmation UX.
- Need rate limits / anti-abuse controls even for verified users.

## High-Impact Impressive Features (Future Ideas)
- Trust badge system with verification states.
- Identity privacy controls (hiding legal name while proving verified status).
- Verification renewal or status health dashboard.
- Credibility signals without exposing private identity data.
- Verified-only interaction controls.
- Public read / private interact model.
- Safety center and report transparency for users.
- Reputation/trust score based on behavior, not popularity.
- Community guidelines acknowledgements during onboarding.
- Admin risk dashboard.
- Onboarding checklist and polished verification progress tracker.
- Keyboard-friendly social interactions.
- Feed filters: newest, following, verified creators, trending.
- Search/discovery with profile and content results.
- Notification center (in-app and optional email digest).
- Privacy export/delete account flow.
- Responsive mobile-first navigation.

---

## Roadmap & Progress Tracking

| Phase | Priority | Status | Owner/Agent | Key Files | Exit Criteria |
|---|---|---|---|---|---|
| Phase 0: Repo Audit | High | [x] Complete | SOLO Agent | `ROADMAP_VERIFIED_SOCIAL_MVP.md` | Roadmap created, git state verified. |
| Phase 1: Foundation | High | [~] In progress | SOLO Agent | `src/env/*`, `README.md`, `src/app/error.tsx` | Env validation, typed DB contracts, error states. |
| Phase 2: Onboarding | High | [ ] Not started | - | `auth/`, `verify/`, webhook | Stripe webhook handles verification, handle availability works. |
| Phase 3: Core Social | Medium | [ ] Not started | - | `explore/`, `u/`, composer | Feed pagination, polished composer, comments. |
| Phase 4: Safety | Medium | [ ] Not started | - | `admin/`, `actions/admin.ts` | Report taxonomy, admin dashboard, rate limits. |
| Phase 5: Discovery | Low | [ ] Not started | - | `search/`, `notifications/` | Search, notifications, trending. |
| Phase 6: UX Polish | Low | [ ] Not started | - | Components, `globals.css` | Accessible modals, animations, skeletons. |
| Phase 7: Production | Low | [ ] Not started | - | `.github/`, tests | CI/CD, tests, observability, deployment docs. |

### Phase 1: Foundation Hardening
- **Done when:** Environment variables are validated at runtime. Database contracts are strictly typed. The README explains the project setup and deployment. Basic error boundaries and loading states exist.
- **Required tests/checks:** `yarn typecheck` and `yarn lint` pass.
- **Manual QA steps:** Load the app with a missing env var; it should fail cleanly.
- **Risk notes:** Changing env handling might break existing non-null assertions.
- **Dependencies/blockers:** None.
- **Suggested files/areas:** `src/env.ts`, `src/utils/supabase/`, `README.md`, `src/app/error.tsx`.

#### Phase 1 Progress (Foundation Hardening)
- Added centralized env validation for public vs server-only variables.
- Added typed database contract derived from `supabase/migrations/20260423000000_initial_schema.sql`.
- Added global loading, not-found, and error UI.
- Improved unauthenticated browsing by allowing `/u/[handle]` routes without login redirects.
- Replaced `alert()` feedback with inline accessible status messaging for likes/follows/reports.
- Added Supabase SQL Editor package under `supabase/sql_editor_package/` (master + numbered scripts).
- Added explicit auth UX for missing Supabase config (login/signup show non-leaky inline status + disabled form).
- Tightened admin route UX for not-configured / unauthorized / unavailable cases.
- SQL package status: no new database changes required for this slice.

##### Phase 1 Slice: Supabase Config UX + Admin UX
- **What shipped:** Pages now render safe, accessible inline “not configured” / “unavailable” panels instead of hard errors when Supabase public env is missing. Auth actions preserve `next` and avoid open-redirects.
- **Key files:** `src/env/public.mjs`, `src/utils/supabase/*`, `src/app/auth/*`, `src/app/admin/reports/page.tsx`, `src/app/account/*`
- **Verification:** `npm run test:ci`, `npm run verify:ts`, `npm run verify:lint`, `NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... npm run verify:build`
- **UI validation (missing Supabase env):** `/auth/login`, `/auth/signup`, `/admin/reports`, `/account` (forms disabled; status panels visible; no runtime console errors beyond devtools info)
- **SQL:** No new SQL required for this slice; use existing `supabase/sql_editor_package/` for schema setup.

##### Phase 1 Slice: Unreachable vs Not Configured
- **What shipped:** Added deterministic user-safe messaging for “not configured” vs “unreachable” vs “temporarily unavailable” across Explore/Profile/Admin/Account surfaces.
- **Key files:** `src/utils/supabase/userFacing.ts`, `src/utils/supabase/middleware.ts`, `src/app/explore/page.tsx`, `src/app/u/[handle]/page.tsx`, `src/app/admin/reports/page.tsx`, `src/app/account/page.tsx`
- **Tests:** Added `safeNextPath` helper + tests to prevent open redirects (`src/utils/routing.*`, `tests/routing.test.mjs`).
- **SQL:** No new SQL required for this slice.
- **UI validation:** Confirmed “not configured” and “unreachable” panels render on `/explore`, `/u/test`, `/admin/reports` with no runtime console errors beyond devtools info.
- **Verification:** `npm run test:ci`, `npm run verify:ts`, `npm run verify:lint`, `NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... npm run verify:build`

### Phase 2: Onboarding and Trust Flow
- **Done when:** Users can sign up, set a unique handle, complete Stripe Identity verification, and the webhook successfully updates their profile to `verified` and `adult`.
- **Required tests/checks:** Webhook signature validation tests.
- **Manual QA steps:** Full end-to-end Stripe test mode verification. Verify DB updates correctly via webhook.
- **Risk notes:** Stripe webhooks require public endpoints; local testing requires Stripe CLI.
- **Dependencies/blockers:** Stripe account setup and CLI for local dev.
- **Suggested files/areas:** `src/app/api/identity/webhook/route.ts`, `src/app/account/ProfileForm.tsx`, `src/app/verify/page.tsx`.

### Phase 3: Core Social Product
- **Done when:** Feed supports infinite scroll or pagination. Users can view profiles, post rich text, and comment on posts.
- **Required tests/checks:** RLS policies verified for comment insertion.
- **Manual QA steps:** Scroll feed to trigger next page load. Post a comment as a verified user.
- **Risk notes:** Pagination in Server Components requires careful state management or infinite scroll client wrappers.
- **Dependencies/blockers:** Needs Phase 2 for easy verified user testing.
- **Suggested files/areas:** `src/app/explore/page.tsx`, `src/components/Feed.tsx`.

### Phase 4: Safety and Moderation
- **Done when:** Admins have a dashboard to view reports, suspend users, and delete content. Rate limiting is active on post creation.
- **Required tests/checks:** RLS policies verified for admin actions.
- **Manual QA steps:** Report a post, log in as admin, dismiss report or delete post. Check audit logs.
- **Risk notes:** Suspension logic requires updating RLS policies to block suspended users.
- **Dependencies/blockers:** Admin user setup.
- **Suggested files/areas:** `src/app/admin/`, `src/app/actions/admin.ts`.

### Phase 5: Discovery and Retention
- **Done when:** Users can search for handles or post content. Basic notification system alerts users of likes/follows.
- **Required tests/checks:** Search query performance (indexes).
- **Manual QA steps:** Search for a known user. Receive a notification when followed.
- **Risk notes:** Real-time notifications require Supabase Realtime setup.
- **Dependencies/blockers:** Supabase Realtime configuration.
- **Suggested files/areas:** `src/components/Search.tsx`, `src/app/notifications/`.

### Phase 6: UX Polish and Delight
- **Done when:** The app is fully responsive, accessible, uses skeletons instead of blank loading screens, and `alert()` calls are replaced with a toast system.
- **Required tests/checks:** Lighthouse accessibility score > 95.
- **Manual QA steps:** Keyboard navigation through the feed and composer. Screen reader testing.
- **Risk notes:** High effort for accessibility compliance.
- **Dependencies/blockers:** None.
- **Suggested files/areas:** All `src/components/`.

### Phase 7: Production Readiness
- **Done when:** CI pipeline runs lint/typecheck. Analytics are integrated. Deployment docs are complete.
- **Required tests/checks:** Vercel build succeeds.
- **Manual QA steps:** Review deployment logs. Verify analytics events fire.
- **Risk notes:** Requires production credentials for Stripe and Supabase.
- **Dependencies/blockers:** Production environment provisioning.
- **Suggested files/areas:** `.github/workflows/`, `README.md`.
