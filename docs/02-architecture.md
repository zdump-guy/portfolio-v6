# Project Architecture

## Tech Stack

| Technology | Version | Why |
|-----------|---------|-----|
| **Next.js** | 15 (App Router) | Server Components, file-based routing, built-in image optimisation, ISR |
| **TypeScript** | 5 | Type safety across the entire codebase — DB types flow end-to-end |
| **Tailwind CSS** | v4 | CSS-variable-based theming, dark mode, glassmorphism utilities |
| **Supabase** | — | PostgreSQL database + Auth + Storage — one platform for everything backend |
| **Framer Motion** | 11 | Scroll animations, layout transitions, the lightbox and modals |
| **react-icons** | — | `SiReact`, `FaGithub`, etc. — brand-accurate SVG icons |
| **next-themes** | — | Flicker-free dark/light mode with system preference support |
| **Resend** | — | Transactional email for the contact form |

---

## Directory Structure

```
portfolio-v6/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Home page — Server Component, data fetching
│   ├── layout.tsx              # Root layout (fonts, Navbar, Footer, ThemeProvider)
│   ├── globals.css             # Design tokens, CSS variables, Tailwind base
│   ├── actions/                # Server Actions (contact form email)
│   ├── admin/                  # Admin CMS — protected by Supabase Auth
│   │   ├── login/              # Login page
│   │   └── (dashboard)/        # Route group — all pages require auth
│   │       ├── page.tsx        # Dashboard overview
│   │       ├── hero/           # Hero section editor
│   │       ├── experience/     # Experience CRUD
│   │       ├── about/          # About section editor
│   │       ├── contact/        # Contact & Footer editor
│   │       ├── projects/       # Projects CRUD
│   │       └── certificates/   # Certificates CRUD
│   ├── projects/               # Public project list and [slug] detail pages
│   └── certificates/           # Public certificates page
│
├── components/
│   ├── layout/                 # Navbar, Footer, FooterWrapper, ThemeProvider
│   ├── sections/               # One file per home page section
│   │   ├── HeroSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── CertificatesSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── AboutSection.tsx
│   │   └── ContactSection.tsx
│   ├── admin/                  # Admin-only components (tables, forms)
│   └── ui/                     # Shared UI: Button, ProjectCard, Icons, modals
│
├── lib/
│   ├── types.ts                # All TypeScript interfaces (Project, Experience, Settings…)
│   ├── utils.ts                # cn() classname utility
│   └── supabase/
│       ├── client.ts           # Browser Supabase client (for client components)
│       └── server.ts           # Server Supabase client (for server components + cookies)
│
├── supabase/
│   └── schema.sql              # Full DB schema, RLS policies, storage setup
│
├── docs/                       # Project documentation
└── public/                     # Static files (favicon, etc.)
```

---

## Data Flow

```
Supabase DB
    │
    ▼ (server-side, cookie-auth session)
Server Component (app/page.tsx)
    │  Promise.all([...parallel queries...])
    │
    ▼ (props)
Client Section Components
    │  (HeroSection, ExperienceSection, etc.)
    │
    ▼ (state + interactions)
User's Browser
```

All heavy data fetching happens in **Server Components** at request time. Client components only receive the already-fetched data as props. This means no client-side API waterfall and no loading spinners for initial content.

---

## Authentication

The admin panel uses **Supabase Auth** with cookie-based sessions.

- `lib/supabase/server.ts` creates a server-side client that reads cookies (set by Supabase during login)
- The `app/admin/(dashboard)/layout.tsx` Server Component calls `supabase.auth.getUser()` on every request
- If no valid session is found, it redirects to `/admin/login`
- Client components in the admin use `lib/supabase/client.ts` to write data (insert/update/delete)

---

## Database Schema Overview

```
┌─────────────┐     ┌──────────────┐
│   projects  │     │ certificates │
│─────────────│     │──────────────│
│ id (uuid)   │     │ id (uuid)    │
│ title       │     │ title        │
│ slug        │     │ issuer       │
│ role        │     │ date         │
│ tech_stack  │     │ image_url    │
│ content     │     │ linkedin_url │
│ image_url   │     │ featured     │
│ gallery[]   │     └──────────────┘
│ live_link   │
│ featured    │     ┌──────────────────────────────┐
└─────────────┘     │           settings            │
                    │──────────────────────────────│
┌─────────────┐     │ id (uuid)                    │
│ experiences │     │ hero_name / headline / ...   │
│─────────────│     │ stat_years_experience        │
│ id (uuid)   │     │ stat_projects_count          │
│ date        │◄────│ about_text                   │
│ role        │     │ skills (jsonb)               │
│ company     │     │ languages (jsonb)            │
│ description │     │ contact_headline / sub       │
│ tags[]      │     │ social_github/linkedin/email │
│ highlight   │     └──────────────────────────────┘
│ popup_*     │
│ related_    │
│ project_ids │
│ sort_order  │
└─────────────┘
```

---

## Image Storage

All images are uploaded to a Supabase Storage public bucket named **`project-images`**.

- **Path pattern**: `experience-images/[timestamp]-[filename]` for experience popup images
- **Project images**: uploaded directly via the admin form
- **Serving**: Next.js is configured in `next.config.ts` to serve from `*.supabase.co` with AVIF/WebP conversion and a 7-day cache TTL

---

## Performance Architecture

| Technique | Where used |
|-----------|-----------|
| Server Components + no client JS | All data fetching |
| `Promise.all()` parallel fetching | `app/page.tsx` |
| `next/dynamic` + `Suspense` | Below-fold sections (Certificates, Experience, About, Contact) |
| `next/image` with `loading="lazy"` | Certificate grid, experience gallery |
| AVIF/WebP auto-conversion | `next.config.ts` `formats` option |
| 7-day image cache TTL | `next.config.ts` `minimumCacheTTL` |
| `optimizePackageImports` | framer-motion, lucide-react, react-icons |
| ISR `revalidate = 60` | `app/page.tsx` — DB changes live within 60 seconds |
