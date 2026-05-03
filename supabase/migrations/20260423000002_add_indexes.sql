create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_author_created_at_idx on public.posts (author_id, created_at desc);
create index if not exists comments_post_created_at_idx on public.comments (post_id, created_at desc);
create index if not exists likes_post_id_idx on public.likes (post_id);
create index if not exists follows_following_id_idx on public.follows (following_id);
create index if not exists reports_status_created_at_idx on public.reports (status, created_at desc);
create index if not exists identity_verifications_status_idx on public.identity_verifications (status);

