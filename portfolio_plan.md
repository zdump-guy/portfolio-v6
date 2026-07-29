# AI Agent Execution Plan: Portfolio Web App Development

## 🤖 Agent Instructions & Context

**Objective:** Generate, configure, and assemble a full-stack portfolio web application with a custom admin dashboard for content management. 
**Target Persona:** The portfolio is for a UI/UX Designer and Front-End Developer. The generated UI must strictly adhere to high-quality design principles, emphasizing clean typography, adequate whitespace, and accessible contrast ratios.
**Aesthetic Directive:** The visual identity must be a **dimmed light mode**. Do not implement a dark theme.

## 🎨 Design Tokens & Theme Configuration (Dimmed Light Mode)

The agent must configure `tailwind.config.js` to strictly use this color mapping:

* **Backgrounds & Surfaces (Primary):** `#FCF7F8` (Off-White/Dimmed Light)
  * *Usage:* Main page backgrounds, card backgrounds (with slight opacity for glassmorphism).
* **Primary Text & Heavy Elements:** `#2E2C2F` (Deep Charcoal)
  * *Usage:* Headings (H1-H6), primary body text, high-contrast buttons, footer background.
* **Secondary Accents & Borders:** `#475B63` (Slate Blue)
  * *Usage:* Secondary text, borders, subtle hover states, inactive icons.
* **Primary Action & Highlights:** `#79A2AD` (Muted Teal)
  * *Usage:* Primary Call-to-Action (CTA) buttons, active links, progress bars, focus rings.
    
## 📑 Content Architecture & Section Generation
The agent must build the public-facing application (`app/page.tsx`) with the following specific sections, structurally optimizing the UI for this exact content:

### 1. The Hero Section
*   **Component:** Full-height or prominent introductory section.
*   **Content Strategy:** Establish the user as a dual-threat UI/UX Designer and Front-End Web Developer.
*   **Actions:** Include two primary CTA buttons using the Muted Teal (`#79A2AD`): "View Work" and "Download CV".

### 2. Featured Case Studies
*   **Component:** Glassmorphism card grid linking to dynamic `/projects/[slug]` routes.
*   **Content Strategy:** Highlight premium web development solutions and UI/UX problem-solving. Structure the layout to accommodate case studies for software development projects built under the One Voxel startup.
*   **Case Study Layout:** Dynamic pages must include structured sections for: The UX Problem, Wireframes, Tech Stack, and High-Fidelity UI.

### 3. Experience & Leadership
*   **Component:** Minimalist vertical timeline or structured list component.
*   **Content Strategy:** Showcase professional trajectory, technical roles, and workload management. Scaffold placeholders for:
    *   Computing Internship at ESIIC headquarters.
    *   Founder & CEO role at One Voxel.
    *   Technical leadership and committee roles (IEEE, GDG, Enactus).

### 4. About & Skills Matrix
*   **Component:** Two-column split layout (Narrative on one side, highly scannable grid on the other).
*   **Content Strategy:** 
    *   *Narrative:* Weave the story of balancing a CS & AI degree at MNU while managing freelancing and a startup. Accommodate space for deep technical hardware and server administration knowledge.
    *   *Skills Grid:* React, Tailwind, Next.js, Figma, UI/UX Principles. Include a specific localization/language competency section highlighting Native Arabic and C2 English.

### 5. Contact Section
*   **Component:** Frictionless contact form at the page footer.
*   **Content Strategy:** Simple form fields (Name, Email, Message) with a Muted Teal submit button. Include minimalist social icons for GitHub and LinkedIn.

---    
    
## 🏗️ Technical Architecture for Code Generation

* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS + `lucide-react` (icons)
* **Animations:** Framer Motion
* **Backend/Database:** Supabase (Agent must generate SQL schemas and client-side queries)
* **State Management:** React Hooks + Supabase Auth

---

## 🚀 Execution Sequence (Step-by-Step Prompts for Agent)

### Phase 1: Environment Initialization & Setup

**Agent Tasks:**

1. Execute `npx create-next-app@latest portfolio --typescript --tailwind --eslint --app`
2. Install dependencies: `npm i @supabase/supabase-js framer-motion lucide-react react-hook-form`
3. Generate `tailwind.config.ts` mapping the custom color palette provided above.
4. Update `globals.css` to set the background color to `#FCF7F8` and default text to `#2E2C2F`.

### Phase 2: Database & Auth Provisioning (Supabase)

**Agent Tasks:**

1. Generate the SQL script to create the following tables:
   * `projects`: `id`, `title`, `slug`, `role`, `tech_stack` (text array), `content` (text), `image_url`, `live_link`, `created_at`
   * `settings`: `id`, `hero_greeting`, `about_text`, `resume_url`
2. Generate Row Level Security (RLS) policies allowing public read access, but restricting insert/update/delete strictly to authenticated users.
3. Generate `lib/supabase.ts` for the client initialization.

### Phase 3: Shared UI Component Generation

**Agent Tasks:**

1. Generate a reusable `<Button />` component with variants (primary: `#79A2AD`, secondary: outline `#475B63`) using Tailwind.
2. Generate a `<ProjectCard />` component utilizing a glassmorphism effect (semi-transparent white over `#FCF7F8` background with blur).
3. Generate a `<Navbar />` component with responsive routing and smooth scrolling links.

### Phase 4: Public Front-End Assembly

**Agent Tasks:**

1. **`app/page.tsx` (Home):** Construct the Hero section fetching `hero_greeting` from Supabase. Assemble a grid mapping over the `projects` table using `<ProjectCard />`.
2. **`app/projects/[slug]/page.tsx` (Dynamic Case Study):** Construct a layout optimized for long-form case study reading, focusing on UI/UX design storytelling.
3. Implement `framer-motion` for page transitions and on-scroll fade-in effects.

### Phase 5: Admin Dashboard Implementation

**Agent Tasks:**

1. **`app/admin/login/page.tsx`:** Generate a Supabase email/password authentication form.
2. **`app/admin/layout.tsx`:** Implement an auth-guard layout that redirects unauthenticated users back to login.
3. **`app/admin/page.tsx`:** Generate a data table displaying all projects.
4. **`app/admin/projects/new/page.tsx`:** Generate a form (using `react-hook-form`) configured to execute an `INSERT` operation to the Supabase `projects` table. Includes fields for case study narrative and tech stack.
