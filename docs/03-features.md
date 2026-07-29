# Features Guide

A complete reference for every public-facing feature in the portfolio.

---

## Hero Section

The very first thing visitors see. Fully configurable from `/admin/hero`.

| Element | What it is | Admin field |
|---------|-----------|-------------|
| Role Chip | Green badge top-left (e.g. "Available for work") | Hero Role Chip Text |
| Greeting | Top of headline (e.g. "Hi, I'm") | Name/Greeting |
| Animated headline | The teal highlighted text below the greeting | Main Headline |
| Sub-tagline | The paragraph below the headline | Sub-tagline |
| Years of Experience | Stat in the bottom row | Years of Experience |
| Projects Count | Stat in the bottom row | Projects Count |
| CV button | "Download CV" button | CV URL |

**How it works:** On page load, the headline fades in with a spring animation. The background has two animated morphing blobs (teal and slate) for depth. On scroll, the section fades and scales slightly creating a parallax collapse effect.

---

## Projects Section

A grid of featured projects on the home page.

- Projects appear here only if marked **Featured** in the admin
- Maximum 6 projects shown, ordered by newest first
- Click any card → goes to `/projects/[slug]` for the full project page

### Project Detail Page (`/projects/[slug]`)

| Feature | Details |
|---------|---------|
| Cover image | Full-width hero image |
| Image gallery | Grid of thumbnails; clicking any opens a **fullscreen lightbox** with ← → arrows to browse |
| Description | Plain text block |
| Tech stack | Vertical list of icons — grey by default, **transitions to brand color on hover** (React=cyan, TypeScript=blue, etc.) |
| Live link button | Links to the live project URL |
| Back button | Returns to the projects list |

---

## Certificates Section

A grid of featured certifications.

- Certificates appear here only if marked **Featured** in the admin
- Maximum 10 shown on the home page
- Click any certificate → opens a **modal** with a large image and a LinkedIn link button
- "View all certificates" → `/certificates` page with all certificates

---

## Experience Section

An animated vertical timeline of career / leadership roles.

### Timeline card

Each card shows: date range, role title, company + location, type badge, description, and skill tags.

Every card has a **"View Details" button** that opens a popup with:

| Popup element | Content |
|--------------|---------|
| Image gallery | Carousel with ← → arrows showing role-related images |
| Overview | Extended popup description text |
| What I Did | A detailed breakdown of responsibilities |
| Related Projects | Clickable links to projects worked on during this role |

If no popup content has been added in the admin, the popup still opens — it just shows the basic card info.

---

## About Section

A two-column layout introducing the portfolio owner.

### Left column
- **About Me text**: Free-form paragraph from the admin
- **Language Proficiency bars**: Animated bars showing proficiency percentages with language name and level label

### Right column — Skills Grid

Skills are grouped by category (e.g. Front-End, Design, Back-End & Infra). Each skill renders in one of two ways:

| Mode | Renders as | Configured in admin |
|------|-----------|---------------------|
| **Icon mode** | Brand icon (coloured on hover) | Toggle = Icon |
| **Text mode** | Plain pill tag | Toggle = Text |

Both modes appear together in the same flex-wrap grid within each category card.

**Icon color on hover:** Each icon transitions to its official brand colour using a CSS variable trick (`--hover-color`). React → `#61DAFB`, TypeScript → `#3178C6`, etc.

---

## Contact Section

A two-column layout with a contact form on the right and social links on the left.

### Contact form

Fields: Name, Email (validated), Message (minimum 20 characters).

Submissions are sent via **Resend** to the email configured in `RESEND_TO_EMAIL`. The form shows inline success/error feedback.

### Social links sidebar

Three links with icons: GitHub, LinkedIn, Email. Each has a customisable label and URL, both set in the admin. Hovering slides the link slightly right for a subtle interactive feel.

---

## Footer

- **Glassmorphism design**: Blurred glass effect matching the navbar
- **Social links**: Same GitHub / LinkedIn / Email links as the contact section — one source of truth in the admin
- **Theme**: Adapts automatically to dark/light mode

---

## Dark / Light Mode

A sun/moon toggle in the navbar. Preference is persisted in `localStorage` via `next-themes`. The default respects the user's OS setting.

## Scroll-to-Top Button

An ↑ arrow button in the navbar (next to the theme toggle) smoothly scrolls the page back to the top.
