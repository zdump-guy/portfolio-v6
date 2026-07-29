import { HeroSection } from '@/components/sections/HeroSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Lazy-load everything below the fold
const CertificatesSection = dynamic(
  () => import('@/components/sections/CertificatesSection').then(m => ({ default: m.CertificatesSection })),
  { ssr: true }
)
const ExperienceSection = dynamic(
  () => import('@/components/sections/ExperienceSection').then(m => ({ default: m.ExperienceSection })),
  { ssr: true }
)
const AboutSection = dynamic(
  () => import('@/components/sections/AboutSection').then(m => ({ default: m.AboutSection })),
  { ssr: true }
)
const ContactSection = dynamic(
  () => import('@/components/sections/ContactSection').then(m => ({ default: m.ContactSection })),
  { ssr: true }
)

function SectionSkeleton() {
  return <div className="section-padding animate-pulse" aria-hidden="true" />
}

export const metadata: Metadata = {
  title: 'Portfolio — UI/UX Designer & Front-End Developer',
  description:
    'Crafting premium digital experiences at the intersection of design and engineering. UI/UX Designer and Front-End Developer specializing in React, Next.js, and Figma.',
  keywords: ['UI/UX Design', 'Front-End Development', 'React', 'Next.js', 'Figma', 'Portfolio'],
  openGraph: {
    title: 'Portfolio — UI/UX Designer & Front-End Developer',
    description:
      'Crafting premium digital experiences at the intersection of design and engineering.',
    type: 'website',
  },
}

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()

  // Run all fetches in parallel
  const [
    { data: settings },
    { data: featuredProjects },
    { data: allProjects },
    { data: featuredCertificates },
    { data: experiences },
  ] = await Promise.all([
    supabase.from('settings').select('*').limit(1).single(),
    supabase.from('projects').select('*').eq('featured', true).order('created_at', { ascending: false }).limit(6),
    supabase.from('projects').select('id, title, slug, role, image_url').order('created_at', { ascending: false }),
    supabase.from('certificates').select('*').eq('featured', true).order('created_at', { ascending: false }).limit(10),
    supabase.from('experiences').select('*').order('sort_order', { ascending: true }),
  ])

  return (
    <>
      {/* Hero + Projects are above the fold — no lazy loading */}
      <HeroSection
        name={settings?.hero_name}
        roleChip={settings?.hero_role_chip}
        headline={settings?.hero_headline}
        subTagline={settings?.hero_sub_tagline}
        yearsExp={settings?.stat_years_experience}
        projectsCount={settings?.stat_projects_count}
        resumeUrl={settings?.resume_url}
      />
      <ProjectsSection projects={featuredProjects ?? []} />

      {/* Below-fold sections — lazy loaded */}
      <Suspense fallback={<SectionSkeleton />}>
        <CertificatesSection certificates={featuredCertificates ?? []} />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <ExperienceSection
          experiences={experiences}
          allProjects={allProjects as any}
        />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <AboutSection
          aboutText={settings?.about_text ?? ''}
          skills={settings?.skills}
          languages={settings?.languages}
        />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <ContactSection
          headline={settings?.contact_headline}
          sub={settings?.contact_sub}
          github={settings?.social_github}
          linkedin={settings?.social_linkedin}
          email={settings?.social_email}
          githubLabel={settings?.social_github_label}
          linkedinLabel={settings?.social_linkedin_label}
          emailLabel={settings?.social_email_label}
        />
      </Suspense>
    </>
  )
}
