# Deployment Guide

This portfolio is designed to deploy on **Vercel** in minutes. Any Node.js host (Railway, Render, etc.) also works.

---

## Deploy to Vercel (Recommended)

### Step 1 — Push to GitHub

If you haven't already, push your code to a GitHub repository.

### Step 2 — Import on Vercel

1. Log into [vercel.com](https://vercel.com)
2. Click **Add New → Project**
3. Select your GitHub repository
4. Vercel auto-detects Next.js — no framework config needed

### Step 3 — Set Environment Variables

In the Vercel project settings (or during import), add:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `RESEND_API_KEY` | Your Resend API key |
| `RESEND_TO_EMAIL` | Your email for receiving contact form messages |

### Step 4 — Deploy

Click **Deploy**. Vercel builds and deploys in about 60-90 seconds.

---

## Post-Deployment: Supabase Auth Configuration

Supabase needs to know your production URL to redirect after login correctly.

1. Supabase Dashboard → **Authentication → URL Configuration**
2. Set **Site URL** to your Vercel domain: `https://your-portfolio.vercel.app`
3. Add the same URL to **Redirect URLs**

Without this, the admin login redirect will fail in production.

---

## Post-Deployment: Resend Domain Verification

For reliable email delivery (contact form), verify a domain in Resend:

1. [resend.com](https://resend.com) → **Domains → Add Domain**
2. Enter your custom domain
3. Add the provided DNS records (SPF, DKIM) to your domain registrar
4. Wait for verification (usually minutes)
5. Update `RESEND_TO_EMAIL` to use your verified domain

> **Without domain verification**, emails still send from `onboarding@resend.dev` but may land in spam.

---

## Custom Domain on Vercel

1. Vercel project → **Settings → Domains**
2. Add your custom domain
3. Follow Vercel's DNS setup instructions (usually a CNAME or A record)
4. Update Supabase **Site URL** and **Redirect URLs** to use your custom domain

---

## Cache & Revalidation

The homepage uses **Incremental Static Regeneration (ISR)**:

```typescript
// app/page.tsx
export const revalidate = 60 // seconds
```

This means:
- The page is statically served (fast!) from Vercel's CDN
- Every 60 seconds, the next request re-fetches data from Supabase
- Changes made in the admin panel **appear on the live site within ~60 seconds**

### Making changes appear instantly

If you need instant updates (e.g. fixing a typo), you can trigger an on-demand revalidation by calling Vercel's revalidate endpoint, or simply:

1. Go to your Vercel dashboard
2. Click **Deployments → Redeploy** (uses cached build, takes ~10s)

---

## Production Checklist

- [ ] All 4 environment variables set in Vercel
- [ ] Supabase Auth Site URL updated to production domain
- [ ] Admin user created in Supabase Authentication
- [ ] SQL schema run in Supabase SQL editor
- [ ] `project-images` storage bucket is public
- [ ] Resend API key valid
- [ ] (Optional) Custom domain configured on Vercel
- [ ] (Optional) Resend domain verified for better email deliverability
