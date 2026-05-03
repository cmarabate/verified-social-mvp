-- 001_initial_schema.sql
-- Purpose: Create the initial schema for VerifiedSocial (tables, enums, RLS, functions, triggers)
-- Dependencies: Requires Supabase Auth (auth.users) to exist
-- Rollback: Run the rollback statements at the bottom (destructive)

begin;

create extension if not exists "uuid-ossp";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'verification_status') then
    create type verification_status as enum (
      'unverified',
      'pending',
      'processing',
      'verified',
      'failed',
      'canceled',
      'requires_input'
    );
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique,
  display_name text,
  avatar_url text,
  is_verified boolean default false not null,
  is_adult boolean default false not null,
  is_admin boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists public.identity_verifications (
  user_id uuid primary key references auth.users(id) on delete cascade,
  provider text default 'stripe_identity' not null,
  stripe_verification_session_id text unique,
  status verification_status default 'unverified' not null,
  is_adult boolean default false not null,
  verified_at timestamptz,
  updated_at timestamptz default now() not null,
  last_error text
);

create table if not exists public.posts (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists public.comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references public.posts(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists public.likes (
  user_id uuid references public.profiles(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  primary key (user_id, post_id)
);

create table if not exists public.follows (
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  primary key (follower_id, following_id)
);

create table if not exists public.reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid references public.profiles(id) on delete set null,
  target_id uuid references public.profiles(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade,
  reason text not null,
  status text default 'pending' not null,
  created_at timestamptz default now() not null
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_user_id uuid references public.profiles(id) on delete set null,
  target_post_id uuid references public.posts(id) on delete set null,
  details jsonb,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;
alter table public.identity_verifications enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.follows enable row level security;
alter table public.reports enable row level security;
alter table public.admin_audit_logs enable row level security;

create or replace function public.is_verified_adult(user_id uuid) returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = user_id and is_verified = true and is_adult = true
  );
$$ language sql security definer;

create or replace function public.is_admin(user_id uuid) returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = user_id and is_admin = true
  );
$$ language sql security definer;

drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using (true);

drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile."
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can view own verification status." on public.identity_verifications;
create policy "Users can view own verification status."
  on public.identity_verifications for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "Users can update own verification (restricted fields)." on public.identity_verifications;
create policy "Users can update own verification (restricted fields)."
  on public.identity_verifications for update
  using (auth.uid() = user_id);

drop policy if exists "Admins can view all verifications." on public.identity_verifications;
create policy "Admins can view all verifications."
  on public.identity_verifications for select
  using (public.is_admin(auth.uid()));

drop policy if exists "Posts are viewable by everyone." on public.posts;
create policy "Posts are viewable by everyone."
  on public.posts for select
  using (true);

drop policy if exists "Verified adults can insert posts." on public.posts;
create policy "Verified adults can insert posts."
  on public.posts for insert
  with check (auth.uid() = author_id and public.is_verified_adult(auth.uid()));

drop policy if exists "Verified adults can update own posts." on public.posts;
create policy "Verified adults can update own posts."
  on public.posts for update
  using (auth.uid() = author_id and public.is_verified_adult(auth.uid()));

drop policy if exists "Users can delete own posts." on public.posts;
create policy "Users can delete own posts."
  on public.posts for delete
  using (auth.uid() = author_id);

drop policy if exists "Comments are viewable by everyone." on public.comments;
create policy "Comments are viewable by everyone."
  on public.comments for select
  using (true);

drop policy if exists "Verified adults can insert comments." on public.comments;
create policy "Verified adults can insert comments."
  on public.comments for insert
  with check (auth.uid() = author_id and public.is_verified_adult(auth.uid()));

drop policy if exists "Verified adults can update own comments." on public.comments;
create policy "Verified adults can update own comments."
  on public.comments for update
  using (auth.uid() = author_id and public.is_verified_adult(auth.uid()));

drop policy if exists "Users can delete own comments." on public.comments;
create policy "Users can delete own comments."
  on public.comments for delete
  using (auth.uid() = author_id);

drop policy if exists "Likes are viewable by everyone." on public.likes;
create policy "Likes are viewable by everyone."
  on public.likes for select
  using (true);

drop policy if exists "Verified adults can insert likes." on public.likes;
create policy "Verified adults can insert likes."
  on public.likes for insert
  with check (auth.uid() = user_id and public.is_verified_adult(auth.uid()));

drop policy if exists "Users can delete own likes." on public.likes;
create policy "Users can delete own likes."
  on public.likes for delete
  using (auth.uid() = user_id);

drop policy if exists "Follows are viewable by everyone." on public.follows;
create policy "Follows are viewable by everyone."
  on public.follows for select
  using (true);

drop policy if exists "Verified adults can follow." on public.follows;
create policy "Verified adults can follow."
  on public.follows for insert
  with check (auth.uid() = follower_id and public.is_verified_adult(auth.uid()));

drop policy if exists "Users can unfollow." on public.follows;
create policy "Users can unfollow."
  on public.follows for delete
  using (auth.uid() = follower_id);

drop policy if exists "Verified adults can insert reports." on public.reports;
create policy "Verified adults can insert reports."
  on public.reports for insert
  with check (auth.uid() = reporter_id and public.is_verified_adult(auth.uid()));

drop policy if exists "Admins can view and manage reports." on public.reports;
create policy "Admins can view and manage reports."
  on public.reports for all
  using (public.is_admin(auth.uid()));

drop policy if exists "Admins can view audit logs." on public.admin_audit_logs;
create policy "Admins can view audit logs."
  on public.admin_audit_logs for select
  using (public.is_admin(auth.uid()));

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');

  insert into public.identity_verifications (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

commit;

-- Verification (run after commit)
select to_regclass('public.profiles') as profiles_table;
select to_regclass('public.identity_verifications') as identity_verifications_table;
select to_regclass('public.posts') as posts_table;
select to_regclass('public.comments') as comments_table;
select to_regclass('public.likes') as likes_table;
select to_regclass('public.follows') as follows_table;
select to_regclass('public.reports') as reports_table;
select to_regclass('public.admin_audit_logs') as admin_audit_logs_table;

-- Rollback (destructive)
-- begin;
-- drop trigger if exists on_auth_user_created on auth.users;
-- drop function if exists public.handle_new_user();
-- drop table if exists public.admin_audit_logs cascade;
-- drop table if exists public.reports cascade;
-- drop table if exists public.follows cascade;
-- drop table if exists public.likes cascade;
-- drop table if exists public.comments cascade;
-- drop table if exists public.posts cascade;
-- drop table if exists public.identity_verifications cascade;
-- drop table if exists public.profiles cascade;
-- drop function if exists public.is_admin(uuid);
-- drop function if exists public.is_verified_adult(uuid);
-- drop type if exists verification_status;
-- commit;
