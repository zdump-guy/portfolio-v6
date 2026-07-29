export interface Project {
  id: string
  title: string
  slug: string
  role: string | null
  tech_stack: string[] | null
  content: string | null
  image_url: string | null
  gallery: string[] | null
  live_link: string | null
  featured: boolean
  created_at: string
}

export interface Settings {
  id: string
  // Hero
  hero_greeting: string | null
  hero_name: string | null
  hero_role_chip: string | null
  hero_headline: string | null
  hero_sub_tagline: string | null
  resume_url: string | null
  // Stats
  stat_years_experience: number | null
  stat_projects_count: number | null
  // About
  about_text: string | null
  skills: SkillGroup[] | null
  languages: Language[] | null
  // Contact & Footer
  contact_headline: string | null
  contact_sub: string | null
  social_github: string | null
  social_linkedin: string | null
  social_email: string | null
  social_github_label: string | null
  social_linkedin_label: string | null
  social_email_label: string | null
}

export interface Certificate {
  id: string
  title: string
  issuer: string
  date: string
  image_url: string | null
  linkedin_url: string | null
  featured: boolean
  created_at: string
}

export interface Experience {
  id: string
  date: string
  role: string
  company: string
  location: string | null
  type: string | null
  description: string | null
  tags: string[] | null
  highlight: boolean
  popup_description: string | null
  popup_what_i_did: string | null
  popup_images: string[] | null
  related_project_ids: string[] | null
  sort_order: number
  created_at: string
}

export interface SkillGroup {
  category: string
  skills: Skill[]
}

export interface Skill {
  name: string
  useIcon: boolean
}

export interface Language {
  lang: string
  level: string
  pct: number
}

export interface SocialLink {
  icon: 'github' | 'linkedin' | 'email'
  label: string
  href: string
}
