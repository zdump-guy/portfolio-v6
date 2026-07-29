# Portfolio V6

A premium, full-stack personal portfolio with a built-in CMS. Built with Next.js 15, Supabase, Tailwind CSS v4, and Framer Motion.

## Features

- **Full Admin CMS** — manage every word and image on the site from a secure dashboard at `/admin`
- **Dynamic Hero** — editable name, headline, tagline, stats, and CV link
- **Projects with Lightbox Gallery** — cover images, multi-image gallery with arrow navigation, tech stack with brand-colored icons
- **Experience Timeline** — animated vertical timeline with rich popup modals (images, description, what I did, related projects)
- **Certificates Showcase** — featured grid with click-to-expand modal and LinkedIn link
- **About Section** — bio text, language proficiency bars, skills grid (brand icons + text tags)
- **Contact Form** — powered by Resend, with customisable text and social links
- **Glassmorphism Footer** — shared social links with the contact section
- **Dark / Light Mode** — system-aware, persisted, flicker-free
- **Performance Optimised** — parallel data fetching, lazy-loaded sections, AVIF/WebP images, ISR

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 15** | App Router, Server Components, ISR, image optimisation |
| **TypeScript** | End-to-end type safety |
| **Tailwind CSS v4** | CSS-variable theming, dark mode, glassmorphism |
| **Supabase** | PostgreSQL database, authentication, file storage |
| **Framer Motion** | Scroll animations, modals, lightbox, page transitions |
| **Resend** | Transactional email for the contact form |
| **react-icons** | Brand-accurate SVG icons |
| **next-themes** | Dark/light mode with system preference |

## Quick Start

1. **Clone & install**
   ```bash
   git clone <repo-url>
   cd portfolio-v6
   npm install
   ```

2. **Create `.env.local`**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   RESEND_TO_EMAIL=you@yourdomain.com
   ```

3. **Run the SQL schema** in Supabase SQL Editor
   — copy from `supabase/schema.sql`

4. **Create an admin user** in Supabase → Authentication → Users

5. **Start dev server**
   ```bash
   npm run dev
   ```
   - Site: `http://localhost:3000`
   - Admin: `http://localhost:3000/admin`

## Documentation

| Guide | Description |
|-------|-------------|
| [Getting Started](./docs/01-setup.md) | Full setup walkthrough from clone to running locally |
| [Architecture](./docs/02-architecture.md) | Tech stack, directory structure, data flow, DB schema |
| [Features Guide](./docs/03-features.md) | Every public-facing feature explained in detail |
| [Admin Panel Guide](./docs/04-admin-guide.md) | How to use every admin page and field |
| [Deployment](./docs/05-deployment.md) | Vercel deployment, Supabase config, custom domains |

## Admin Panel

The admin panel lives at `/admin`. It includes a rich dashboard with:
- Stats overview (projects, certificates, experiences)
- Quick action shortcuts
- Site section editors (Hero, Experience, About, Contact & Footer)
- Full CRUD for projects, certificates, and experience timeline entries

## License

MIT
