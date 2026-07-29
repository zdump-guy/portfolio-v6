# Getting Started

Follow these steps to run Portfolio V6 locally after cloning.

## Prerequisites

| Requirement | Version/Details |
|-------------|----------------|
| **Node.js** | v18 or newer |
| **npm** | Included with Node.js |
| **Supabase account** | [supabase.com](https://supabase.com) — free tier is fine |
| **Resend account** | [resend.com](https://resend.com) — free tier sends up to 100 emails/day |

---

## Step 1 — Clone & Install

```bash
git clone <your-repo-url>
cd portfolio-v6
npm install
```

---

## Step 2 — Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase — found in Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Resend — from resend.com dashboard
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx

# Where contact form emails get delivered to
RESEND_TO_EMAIL=you@yourdomain.com
```

### Where to find each key

| Key | Where to get it |
|-----|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API → `anon` `public` key |
| `RESEND_API_KEY` | [resend.com](https://resend.com) → API Keys → Create API Key |
| `RESEND_TO_EMAIL` | Your own email address where you want to receive contact form messages |

---

## Step 3 — Database Setup (Supabase SQL Editor)

1. Open your Supabase project
2. Go to **SQL Editor** → **New Query**
3. Paste and run the entire contents of `supabase/schema.sql`

This creates all tables, Row Level Security policies, the storage bucket, and seeds a default settings row.

> **Important:** The schema uses `CREATE TABLE IF NOT EXISTS` and `ON CONFLICT DO NOTHING`, so it is safe to re-run.

### What the schema creates

| Table | Purpose |
|-------|---------|
| `projects` | Portfolio projects with gallery, tech stack, links |
| `certificates` | Certifications with image and LinkedIn URL |
| `experiences` | Career timeline with popup details and related projects |
| `settings` | Single-row table for all site-wide config (hero, about, contact, social links) |

It also creates a public Supabase Storage bucket named `project-images` for all uploaded images.

---

## Step 4 — Create an Admin User

You need a Supabase user to access the admin panel at `/admin`.

1. Supabase Dashboard → **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter your email and a strong password
4. Check **Auto Confirm User**
5. Click **Create User**

You can now log in at `http://localhost:3000/admin/login`.

---

## Step 5 — Run the Dev Server

```bash
npm run dev
```

| URL | What it is |
|-----|-----------|
| `http://localhost:3000` | Public portfolio site |
| `http://localhost:3000/admin` | Admin CMS dashboard |

---

## Common Issues

**"Cannot find module" errors** → Run `npm install` again

**Admin login redirects back to login** → Make sure your Supabase Auth user is confirmed and the `NEXT_PUBLIC_SUPABASE_*` vars are correct

**Images not loading** → Verify the `project-images` bucket is set to **public** in Supabase Storage → Policies

**Contact form says "message not sent"** → Double-check your `RESEND_API_KEY` and that the email domain is verified in Resend
