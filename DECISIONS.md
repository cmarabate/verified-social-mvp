# Architecture & Technical Decisions

## Date: 2026-04-23
### Decision: Tech Stack Selection
**Context**: Greenfield verified social platform MVP.
**Decision**: Use Next.js (App Router), TypeScript, TailwindCSS.
**Rationale**: Rapid development, type safety, and production-ready defaults.

### Decision: Database and Auth
**Context**: Need auth, database, and object storage.
**Decision**: Use Supabase (Auth, Postgres, Storage).
**Rationale**: Full-featured backend-as-a-service that works well with Next.js and provides server-enforced RLS.

### Decision: Identity Verification
**Context**: Need robust identity verification.
**Decision**: Stripe Identity.
**Rationale**: High trust, built-in document verification, and clear webhook integration for async state updates.

### Decision: Data Minimization
**Context**: Handling sensitive identity data.
**Decision**: Store only the verification status, provider session ID, and boolean flags (`is_verified`, `is_adult`).
**Rationale**: Avoid liability and compliance risks associated with storing raw identity documents or images.

### Decision: RLS Gating
**Context**: Restricting platform write actions to verified users.
**Decision**: Server-side Row Level Security (RLS) on Postgres.
**Rationale**: Prevents bypassing client-side UI restrictions; ensures security at the database layer.

### Decision: Interaction Features
**Context**: Need interactions like Likes, Follows, and Reports.
**Decision**: Leverage Supabase Server Actions for database inserts/deletes, relying on RLS for access control. Use React optimistic updates for likes.
**Rationale**: Simplified state management while ensuring strong server-enforced data integrity.

