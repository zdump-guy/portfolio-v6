-- ============================================
-- Portfolio V6 — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  role text,
  tech_stack text[],
  content text,
  image_url text,
  gallery text[],
  live_link text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuer text NOT NULL,
  date text NOT NULL,
  image_url text,
  linkedin_url text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Settings table (single row for site-wide config)
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_greeting text,
  about_text text,
  resume_url text
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Public read settings"
  ON settings FOR SELECT
  USING (true);

CREATE POLICY "Public read certificates"
  ON certificates FOR SELECT
  USING (true);

-- Authenticated users can write projects
CREATE POLICY "Auth insert projects"
  ON projects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth update projects"
  ON projects FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth delete projects"
  ON projects FOR DELETE
  USING (auth.role() = 'authenticated');

-- Authenticated users can write certificates
CREATE POLICY "Auth insert certificates"
  ON certificates FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth update certificates"
  ON certificates FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth delete certificates"
  ON certificates FOR DELETE
  USING (auth.role() = 'authenticated');

-- Authenticated users can write settings
CREATE POLICY "Auth insert settings"
  ON settings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth update settings"
  ON settings FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Seed default settings row
INSERT INTO settings (hero_greeting, about_text, resume_url)
VALUES (
  'Hi, I''m a UI/UX Designer & Front-End Developer.',
  'I''m a CS & AI student at MNU, balancing a freelancing career and running One Voxel — a software startup. I specialize in building premium digital experiences with React, Next.js, and Figma.',
  '/cv.pdf'
)
ON CONFLICT DO NOTHING;

-- ============================================
-- Storage Bucket Setup (for Images)
-- ============================================

-- Create public bucket 'project-images'
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public Read Storage Objects"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

CREATE POLICY "Auth Insert Storage Objects"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth Update Storage Objects"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth Delete Storage Objects"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');

-- ============================================
-- Migration: Experiences + expanded settings
-- ============================================

-- Experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date text NOT NULL,
  role text NOT NULL,
  company text NOT NULL,
  location text,
  type text,
  description text,
  tags text[],
  highlight boolean DEFAULT false,
  popup_description text,
  popup_what_i_did text,
  popup_images text[],
  related_project_ids uuid[],
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Auth insert experiences" ON experiences FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update experiences" ON experiences FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete experiences" ON experiences FOR DELETE USING (auth.role() = 'authenticated');

-- Expand settings table
ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS hero_name text,
  ADD COLUMN IF NOT EXISTS hero_role_chip text,
  ADD COLUMN IF NOT EXISTS hero_headline text,
  ADD COLUMN IF NOT EXISTS hero_sub_tagline text,
  ADD COLUMN IF NOT EXISTS stat_years_experience int,
  ADD COLUMN IF NOT EXISTS stat_projects_count int,
  ADD COLUMN IF NOT EXISTS skills jsonb,
  ADD COLUMN IF NOT EXISTS languages jsonb,
  ADD COLUMN IF NOT EXISTS contact_headline text,
  ADD COLUMN IF NOT EXISTS contact_sub text,
  ADD COLUMN IF NOT EXISTS social_github text,
  ADD COLUMN IF NOT EXISTS social_linkedin text,
  ADD COLUMN IF NOT EXISTS social_email text,
  ADD COLUMN IF NOT EXISTS social_github_label text,
  ADD COLUMN IF NOT EXISTS social_linkedin_label text,
  ADD COLUMN IF NOT EXISTS social_email_label text;

-- Update default settings row with new fields
UPDATE settings SET
  hero_name = 'Hi, I''m',
  hero_role_chip = 'Available for work',
  hero_headline = 'UI/UX Designer & Dev.',
  hero_sub_tagline = 'Blending product thinking with engineering precision to craft digital experiences that feel both inevitable and delightful.',
  stat_years_experience = 3,
  stat_projects_count = 20,
  contact_headline = 'Let''s Build Something Great',
  contact_sub = 'Whether you have a project in mind, want to collaborate, or just want to say hello — my inbox is always open.',
  social_github = 'https://github.com',
  social_linkedin = 'https://linkedin.com',
  social_email = 'mailto:hello@portfolio.dev',
  social_github_label = 'GitHub',
  social_linkedin_label = 'LinkedIn',
  social_email_label = 'hello@portfolio.dev'
WHERE id IS NOT NULL;


