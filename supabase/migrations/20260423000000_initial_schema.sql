-- Migration: 00001_initial_schema.sql
-- Description: Create initial tables and RLS policies for verified social platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum for verification status
CREATE TYPE verification_status AS ENUM (
  'unverified',
  'pending',
  'verified',
  'failed',
  'canceled',
  'requires_input'
);

-- ==============================================================================
-- TABLES
-- ==============================================================================

-- 1. PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  handle TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE NOT NULL,
  is_adult BOOLEAN DEFAULT FALSE NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE NOT NULL, -- Added to track admins for RLS
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. IDENTITY_VERIFICATIONS
CREATE TABLE public.identity_verifications (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT DEFAULT 'stripe_identity' NOT NULL,
  stripe_verification_session_id TEXT UNIQUE,
  status verification_status DEFAULT 'unverified' NOT NULL,
  is_adult BOOLEAN DEFAULT FALSE NOT NULL,
  verified_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_error TEXT
);

-- 3. POSTS
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. COMMENTS
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. LIKES
CREATE TABLE public.likes (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, post_id)
);

-- 6. FOLLOWS
CREATE TABLE public.follows (
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (follower_id, following_id)
);

-- 7. REPORTS
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  target_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. ADMIN_AUDIT_LOGS
CREATE TABLE public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  target_post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);


-- ==============================================================================
-- RLS POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.identity_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Helpers for RLS
CREATE OR REPLACE FUNCTION is_verified_adult(user_id UUID) RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND is_verified = TRUE AND is_adult = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin(user_id UUID) RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND is_admin = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- PROFILES Policies
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- IDENTITY_VERIFICATIONS Policies
CREATE POLICY "Users can view own verification status."
  ON public.identity_verifications FOR SELECT
  USING (auth.uid() = user_id OR is_admin(auth.uid()));

CREATE POLICY "Users can update own verification (restricted fields)."
  ON public.identity_verifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all verifications."
  ON public.identity_verifications FOR SELECT
  USING (is_admin(auth.uid()));

-- POSTS Policies
CREATE POLICY "Posts are viewable by everyone."
  ON public.posts FOR SELECT
  USING (true);

CREATE POLICY "Verified adults can insert posts."
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = author_id AND is_verified_adult(auth.uid()));

CREATE POLICY "Verified adults can update own posts."
  ON public.posts FOR UPDATE
  USING (auth.uid() = author_id AND is_verified_adult(auth.uid()));

CREATE POLICY "Users can delete own posts."
  ON public.posts FOR DELETE
  USING (auth.uid() = author_id);

-- COMMENTS Policies
CREATE POLICY "Comments are viewable by everyone."
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Verified adults can insert comments."
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = author_id AND is_verified_adult(auth.uid()));

CREATE POLICY "Verified adults can update own comments."
  ON public.comments FOR UPDATE
  USING (auth.uid() = author_id AND is_verified_adult(auth.uid()));

CREATE POLICY "Users can delete own comments."
  ON public.comments FOR DELETE
  USING (auth.uid() = author_id);

-- LIKES Policies
CREATE POLICY "Likes are viewable by everyone."
  ON public.likes FOR SELECT
  USING (true);

CREATE POLICY "Verified adults can insert likes."
  ON public.likes FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_verified_adult(auth.uid()));

CREATE POLICY "Users can delete own likes."
  ON public.likes FOR DELETE
  USING (auth.uid() = user_id);

-- FOLLOWS Policies
CREATE POLICY "Follows are viewable by everyone."
  ON public.follows FOR SELECT
  USING (true);

CREATE POLICY "Verified adults can follow."
  ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id AND is_verified_adult(auth.uid()));

CREATE POLICY "Users can unfollow."
  ON public.follows FOR DELETE
  USING (auth.uid() = follower_id);

-- REPORTS Policies
CREATE POLICY "Verified adults can insert reports."
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id AND is_verified_adult(auth.uid()));

CREATE POLICY "Admins can view and manage reports."
  ON public.reports FOR ALL
  USING (is_admin(auth.uid()));

-- ADMIN_AUDIT_LOGS Policies
CREATE POLICY "Admins can view audit logs."
  ON public.admin_audit_logs FOR SELECT
  USING (is_admin(auth.uid()));

-- ==============================================================================
-- TRIGGERS
-- ==============================================================================

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');

  INSERT INTO public.identity_verifications (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
