# VerifiedSocial MVP

Trust-first social network MVP. Anyone can browse; posting and interactions require identity verification (Stripe Identity) and verified-adult gating enforced by Postgres RLS (Supabase).

## Stack

- Next.js (App Router), React, TypeScript
- Supabase (Auth + Postgres + RLS)
- Stripe Identity
- Tailwind CSS

## Local Setup

1. Install dependencies

```bash
yarn install
```

2. Create `.env.local` with the required variables

### Required environment variables

Public (safe in the browser):

- `NEXT_PUBLIC_SITE_URL` (recommended for production; optional in local dev)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (required to use `/verify`)

Server-only:

- `SUPABASE_SERVICE_ROLE_KEY` (required for Stripe webhook processing)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

3. Run the dev server

```bash
yarn dev
```

Open http://localhost:3000

## Database (Supabase SQL Editor)

The repo includes a Supabase SQL Editor package under `supabase/sql_editor_package/`. Run the master script first to create the schema and policies, then any follow-up scripts in order.

## Verification Commands

```bash
yarn verify:ts
yarn verify:lint
yarn verify:build
yarn test:ci
```
