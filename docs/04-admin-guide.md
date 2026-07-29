# Admin Panel Guide

Access the admin at `/admin`. You must be logged in as an authenticated Supabase user.

---

## Login — `/admin/login`

Email and password. Credentials are managed in your Supabase project → **Authentication → Users**.

After login, you are redirected to the dashboard.

---

## Dashboard — `/admin`

An at-a-glance overview of the entire portfolio.

### Stats cards (top row)
Each card is **clickable** and links to its management page.

| Card | What it shows |
|------|--------------|
| Projects | Total count + how many are featured |
| Certificates | Total count + how many are featured |
| Experiences | Total count in the timeline |
| Site Settings | Green ✓ if hero headline and social links are set; orange ⚠ if not |

### Quick Actions
Shortcuts to create new content without navigating the sidebar.
- **New Project** → `/admin/projects/new`
- **New Certificate** → `/admin/certificates/new`
- **New Experience** → `/admin/experience/new`

### Site Sections
One-click navigation to every section editor:

| Button | Goes to |
|--------|---------|
| Hero Section | `/admin/hero` |
| Experience | `/admin/experience` |
| About | `/admin/about` |
| Contact & Footer | `/admin/contact` |

### Recent Projects table
The 5 most recently created projects with title, role, date, and an Edit link.

### Experience snapshot
A compact view of your timeline entries with their type badge.

---

## Projects — `/admin/projects`

A table of all projects with columns: Title, Role, Status (featured badge), Created date, Actions (Edit / Delete).

### New Project — `/admin/projects/new`
### Edit Project — `/admin/projects/[id]/edit`

| Field | Type | Notes |
|-------|------|-------|
| Title | Text | Required |
| Slug | Text | Auto-generated from title; must be URL-safe and unique |
| Role | Text | e.g. "Lead Developer", shown as a chip on the card |
| Description | Textarea | Plain text displayed on the project page |
| Tech Stack | Text | Comma-separated, e.g. `React, TypeScript, Supabase` — renders as icons |
| Cover Image | File upload | Stored in Supabase Storage; shown as card thumbnail and page hero |
| Gallery Images | Multi-file upload | Shown in the lightbox on the project detail page |
| Live Link | URL | "View Live" button on the project page |
| Featured | Toggle | Shows on the home page projects grid when enabled |

---

## Certificates — `/admin/certificates`

A table of all certificates with title, issuer, and featured status.

### New/Edit Certificate

| Field | Type | Notes |
|-------|------|-------|
| Title | Text | Required |
| Issuer | Text | e.g. "Google", "Coursera" |
| Date | Text | e.g. "Jan 2024" |
| Image | File upload | Shown in the certificate modal |
| LinkedIn URL | URL | Renders a "View on LinkedIn" button in the modal |
| Featured | Toggle | Shows on the home page certificates grid when enabled |

---

## Hero Section — `/admin/hero`

Controls the landing section of the homepage. Changes appear on the live site within 60 seconds.

| Field | What it controls | Example |
|-------|----------------|---------|
| Name/Greeting | Text before the animated headline | `Hi, I'm` |
| Role Chip Text | The green badge at the top | `Available for work` |
| Main Headline | The large teal animated text | `UI/UX Designer & Dev.` |
| Sub-tagline | The paragraph beneath the headline | `Blending product thinking…` |
| Years of Experience | First stat in the bottom bar | `3` → shown as `3+` |
| Projects Count | Second stat in the bottom bar | `20` → shown as `20+` |
| CV URL | Target for the "Download CV" button | `/cv.pdf` or a full URL |

---

## Experience — `/admin/experience`

A table of all timeline entries ordered by **Sort Order** (ascending). Entries with lower sort numbers appear first.

### New Experience — `/admin/experience/new`
### Edit Experience — `/admin/experience/[id]/edit`

**Basic Info tab:**

| Field | Type | Notes |
|-------|------|-------|
| Date | Text | e.g. `2024 — Present` or `2023` |
| Role | Text | Job title or position name |
| Company | Text | Organisation name |
| Location | Text | e.g. `Remote`, `MNU Campus` |
| Type | Text | e.g. `Startup`, `Internship`, `Leadership` — shown as a badge |
| Description | Textarea | Shown directly on the timeline card |
| Tags | Text | Comma-separated skills; shown as small tags on the card |
| Highlight | Checkbox | Fills the timeline dot with teal; adds teal border to the card |
| Sort Order | Number | Lower numbers appear higher in the timeline |

**Popup Details section:**

| Field | Type | Notes |
|-------|------|-------|
| Popup Description | Textarea | Extended description in the modal (Overview section) |
| What I Did | Textarea | Detailed responsibilities (What I Did section in modal) |
| Popup Images | Multi-file upload | Shown in the modal image carousel with ← → arrows |
| Related Projects | Checkboxes | Multi-select from all projects — renders as teal links in the modal |

> The "View Details" button always appears on the public card. If no popup content is added, the popup shows basic card information.

---

## About — `/admin/about`

Three sections on one page. Hit **Save Changes** to save all three at once.

### About Me
A large textarea for the biography paragraph shown on the left column of the About section.

### Languages

A dynamic list of language proficiency rows.

| Field | What it does |
|-------|-------------|
| Language name | e.g. `Arabic`, `English`, `French` |
| Level label | e.g. `Native`, `C2 Proficient`, `Intermediate` — shown next to the bar |
| Percentage (0–100) | Controls how wide the animated progress bar is |

Use the **+ Add Language** button to add rows. Click **×** on a row to remove it.

### Skills

A dynamic list of skill groups.

**Adding a group:**
1. Click **+ Add Skill Group**
2. Type a category name (e.g. `Front-End`, `Design`)

**Adding a skill within a group:**
1. Click **+ Add Skill** inside the group
2. Type the skill name (e.g. `React`, `Figma`)
3. Click the toggle button to switch between **Icon mode** and **Text mode**:
   - 🖼 **Icon mode** (image icon, teal highlight): The skill renders as a brand icon with brand colour on hover
   - `T` **Text mode** (text icon): The skill renders as a plain text pill tag

> **Tip:** Use Icon mode for technologies with known logos (React, TypeScript, Node.js, Figma, etc.). Use Text mode for concepts that don't have icons (e.g. `Design Systems`, `Project Management`).

Click **×** next to a skill to remove it. Click **×** next to a category name to remove the entire group.

---

## Contact & Footer — `/admin/contact`

> **Note:** Changes here update **both** the Contact section on the homepage **and** the Footer simultaneously — they share one source of truth.

### Contact Section Text

| Field | What it controls |
|-------|----------------|
| Contact Headline | The large heading (`Let's Build Something Great`) |
| Contact Sub-text | The paragraph beneath the heading |

### Social Links

For each platform — GitHub, LinkedIn, Email:

| Field | Notes |
|-------|-------|
| URL | Full URL including `https://` prefix (or `mailto:` for email) |
| Label | Text shown next to the icon on both the contact section and footer |

These links render with hover animations on both the contact section and footer.
