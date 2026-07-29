import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  PlusCircle, Folder, Award, Briefcase, Sparkles, UserCircle,
  Mail, ArrowRight, Star, TrendingUp, Users, Settings2
} from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { data: projects },
    { data: certificates },
    { data: experiences },
    { data: settings },
  ] = await Promise.all([
    supabase.from('projects').select('id, title, slug, role, featured, created_at').order('created_at', { ascending: false }),
    supabase.from('certificates').select('id, title, issuer, featured, created_at').order('created_at', { ascending: false }),
    supabase.from('experiences').select('id, role, company, type, highlight').order('sort_order', { ascending: true }),
    supabase.from('settings').select('hero_name, hero_headline, hero_role_chip, social_github, social_linkedin, social_email').limit(1).single(),
  ])

  const totalProjects = projects?.length ?? 0
  const featuredProjects = projects?.filter(p => p.featured).length ?? 0
  const totalCerts = certificates?.length ?? 0
  const featuredCerts = certificates?.filter(c => c.featured).length ?? 0
  const totalExp = experiences?.length ?? 0
  const settingsConfigured = !!(settings?.hero_headline && settings?.social_github)

  const recentProjects = projects?.slice(0, 5) ?? []

  const stats = [
    { label: 'Projects', value: totalProjects, sub: `${featuredProjects} featured`, icon: Folder, href: '/admin/projects', color: 'bg-blue-500/10 text-blue-400' },
    { label: 'Certificates', value: totalCerts, sub: `${featuredCerts} featured`, icon: Award, href: '/admin/certificates', color: 'bg-yellow-500/10 text-yellow-400' },
    { label: 'Experiences', value: totalExp, sub: 'in timeline', icon: Briefcase, href: '/admin/experience', color: 'bg-purple-500/10 text-purple-400' },
    { label: 'Site Settings', value: settingsConfigured ? '✓ Set' : '⚠ Pending', sub: settingsConfigured ? 'All configured' : 'Needs attention', icon: Settings2, href: '/admin/hero', color: settingsConfigured ? 'bg-teal/10 text-teal' : 'bg-orange-500/10 text-orange-400' },
  ]

  const quickActions = [
    { label: 'New Project', href: '/admin/projects/new', icon: PlusCircle, desc: 'Add a project to your portfolio' },
    { label: 'New Certificate', href: '/admin/certificates/new', icon: Award, desc: 'Add a new certification' },
    { label: 'New Experience', href: '/admin/experience/new', icon: Briefcase, desc: 'Add a role to your timeline' },
  ]

  const sectionLinks = [
    { label: 'Hero Section', href: '/admin/hero', icon: Sparkles, desc: 'Name, headline, stats, CV URL' },
    { label: 'Experience', href: '/admin/experience', icon: Briefcase, desc: 'Timeline, popup details, related projects' },
    { label: 'About', href: '/admin/about', icon: UserCircle, desc: 'About me, languages, skills' },
    { label: 'Contact & Footer', href: '/admin/contact', icon: Mail, desc: 'Social links, contact text' },
  ]

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary text-sm mt-1.5">
          {settings?.hero_name ? `Welcome back, ${settings.hero_name.replace("Hi, I'm", '').trim() || 'Admin'}` : 'Welcome back'} · Your portfolio at a glance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, sub, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="group bg-bg-surface rounded-2xl p-5 border border-border-color shadow-sm hover:border-teal/30 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-xl ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
            </div>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
            <p className="text-xs font-medium text-text-secondary mt-0.5">{label}</p>
            <p className="text-xs text-text-secondary/60 mt-0.5">{sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Quick Actions */}
        <div className="bg-bg-surface rounded-2xl border border-border-color shadow-sm p-6">
          <h2 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal" />
            Quick Actions
          </h2>
          <div className="space-y-2">
            {quickActions.map(({ label, href, icon: Icon, desc }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 p-3 rounded-xl hover:bg-teal/5 border border-transparent hover:border-teal/20 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center shrink-0 group-hover:bg-teal/20 transition-colors">
                  <Icon className="w-4 h-4 text-teal" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary">{label}</p>
                  <p className="text-xs text-text-secondary truncate">{desc}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-text-secondary ml-auto opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>

        {/* Site Sections */}
        <div className="bg-bg-surface rounded-2xl border border-border-color shadow-sm p-6 lg:col-span-2">
          <h2 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-teal" />
            Site Sections
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sectionLinks.map(({ label, href, icon: Icon, desc }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 p-3 rounded-xl hover:bg-teal/5 border border-border-color hover:border-teal/20 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-teal/10 transition-colors">
                  <Icon className="w-4 h-4 text-text-secondary group-hover:text-teal transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary">{label}</p>
                  <p className="text-xs text-text-secondary truncate">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Projects */}
      <div className="bg-bg-surface rounded-2xl border border-border-color shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-border-color flex items-center justify-between">
          <h2 className="font-semibold text-text-primary flex items-center gap-2">
            <Star className="w-4 h-4 text-teal" />
            Recent Projects
          </h2>
          <Link href="/admin/projects" className="text-xs text-teal hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-border-color">
          {recentProjects.length === 0 ? (
            <div className="px-6 py-8 text-center text-text-secondary text-sm">
              No projects yet.{' '}
              <Link href="/admin/projects/new" className="text-teal hover:underline">Add your first project →</Link>
            </div>
          ) : (
            recentProjects.map((p) => (
              <div key={p.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  {p.featured && (
                    <span className="shrink-0 text-[10px] font-semibold bg-teal/10 text-teal px-2 py-0.5 rounded-full">
                      Featured
                    </span>
                  )}
                  <span className="text-sm text-text-primary font-medium truncate">{p.title}</span>
                  {p.role && <span className="text-xs text-text-secondary shrink-0 hidden sm:block">{p.role}</span>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-text-secondary hidden sm:block">
                    {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <Link
                    href={`/admin/projects/${p.id}/edit`}
                    className="text-xs text-teal hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Experiences snapshot */}
      {experiences && experiences.length > 0 && (
        <div className="bg-bg-surface rounded-2xl border border-border-color shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border-color flex items-center justify-between">
            <h2 className="font-semibold text-text-primary flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-teal" />
              Experience Timeline
            </h2>
            <Link href="/admin/experience" className="text-xs text-teal hover:underline">Manage</Link>
          </div>
          <div className="divide-y divide-border-color">
            {experiences.slice(0, 4).map((exp) => (
              <div key={exp.id} className="px-6 py-3 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  {exp.highlight && (
                    <span className="text-[10px] font-semibold bg-teal/10 text-teal px-2 py-0.5 rounded-full shrink-0">
                      ★ Featured
                    </span>
                  )}
                  <span className="text-sm text-text-primary font-medium">{exp.role}</span>
                  <span className="text-xs text-text-secondary">{exp.company}</span>
                </div>
                {exp.type && (
                  <span className="text-xs text-text-secondary border border-border-color px-2 py-0.5 rounded-full hidden sm:block">
                    {exp.type}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
