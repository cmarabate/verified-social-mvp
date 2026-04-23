# Verified Social Platform - Roadmap

## Phases

### Phase 1: MVP Bootstrap (Current)
- [x] Initialize Next.js + TypeScript project
- [x] Setup git repository (`trae/verified-social/bootstrap-mvp`)
- [x] Create ROADMAP.md and DECISIONS.md
- [x] Supabase Auth setup (signup, login, logout)
- [x] Supabase Postgres schema setup (`profiles`, `identity_verifications`)
- [x] Supabase RLS policies
- [x] Stripe Identity server integration
- [x] Basic frontend pages (`/`, `/explore`, `/verify`, `/account`)

### Phase 2: Core Social Features
- [x] Explore feed list
- [x] User profiles (`/u/[handle]`)
- [x] Verified-only post composer
- [x] Comments and Likes (Likes implemented, Comments deferred to future iteration)
- [x] Follow / Unfollow logic
- [x] Report modal
- [x] Admin reports queue
- [x] Moderation actions
- [x] Admin audit logs

## Decisions
Tracked in `DECISIONS.md`.

## Files Touched
- `ROADMAP.md`
- `DECISIONS.md`
- `.env.example`
- Next.js scaffolding files
- `supabase/migrations/*`

## Manual Testing Checkpoints (To-Do)
- [ ] **Auth**: signup/login works; profile row created.
- [ ] **Gating**: unverified cannot post/comment/like/follow server-side.
- [ ] **Stripe Identity**: complete verification in Stripe test mode; webhook updates DB; UI reflects verified/adult state.
- [ ] **After verification**: verified user can post/comment/like/follow.
- [ ] **Admin**: admin can view reports queue and take moderation actions; actions create audit log entries.

## Blocked Items
- Pending configuration of external services (Supabase & Stripe) requiring manual setup.
