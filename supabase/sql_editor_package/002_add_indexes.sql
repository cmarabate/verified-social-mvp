-- 002_add_indexes.sql
-- Purpose: Add basic performance indexes for common queries (feed, profiles, moderation)
-- Dependencies: 001_initial_schema.sql (and 003_extend_verification_status_enum.sql if upgrading an existing enum)
-- Rollback: Drop the indexes listed at the bottom

begin;

create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_author_created_at_idx on public.posts (author_id, created_at desc);

create index if not exists comments_post_created_at_idx on public.comments (post_id, created_at desc);

create index if not exists likes_post_id_idx on public.likes (post_id);

create index if not exists follows_following_id_idx on public.follows (following_id);

create index if not exists reports_status_created_at_idx on public.reports (status, created_at desc);

create index if not exists identity_verifications_status_idx on public.identity_verifications (status);

commit;

-- Verification
select indexname, tablename
from pg_indexes
where schemaname = 'public'
  and indexname in (
    'posts_created_at_idx',
    'posts_author_created_at_idx',
    'comments_post_created_at_idx',
    'likes_post_id_idx',
    'follows_following_id_idx',
    'reports_status_created_at_idx',
    'identity_verifications_status_idx'
  )
order by indexname;

-- Rollback (destructive)
-- begin;
-- drop index if exists public.posts_created_at_idx;
-- drop index if exists public.posts_author_created_at_idx;
-- drop index if exists public.comments_post_created_at_idx;
-- drop index if exists public.likes_post_id_idx;
-- drop index if exists public.follows_following_id_idx;
-- drop index if exists public.reports_status_created_at_idx;
-- drop index if exists public.identity_verifications_status_idx;
-- commit;
