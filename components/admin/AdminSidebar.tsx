'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, FolderOpen, PlusCircle, LogOut, User, Sparkles, Briefcase, UserCircle, Mail, Award } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Projects', href: '/admin/projects', icon: FolderOpen, exact: false },
  { label: 'New Project', href: '/admin/projects/new', icon: PlusCircle, exact: true },
  { label: 'Certificates', href: '/admin/certificates', icon: Award, exact: false },
  { label: 'New Certificate', href: '/admin/certificates/new', icon: PlusCircle, exact: true },
]

const contentItems = [
  { label: 'Hero Section', href: '/admin/hero', icon: Sparkles, exact: true },
  { label: 'Experience', href: '/admin/experience', icon: Briefcase, exact: false },
  { label: 'About', href: '/admin/about', icon: UserCircle, exact: true },
  { label: 'Contact & Footer', href: '/admin/contact', icon: Mail, exact: true },
]

interface AdminSidebarProps {
  userEmail: string
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <motion.aside
      initial={{ x: -240, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-60 min-h-screen bg-charcoal text-white flex flex-col shrink-0"
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/5">
        <Link href="/" className="text-white font-bold text-lg">
          Portfolio
        </Link>
        <p className="text-white/40 text-xs mt-0.5">Admin Console</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-1">Content</p>
          {navItems.map(({ label, href, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'bg-teal text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            )
          })}
        </div>

        <div className="space-y-1">
          <p className="px-3 text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-1">Site Sections</p>
          {contentItems.map(({ label, href, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'bg-teal text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-white/5 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-7 h-7 rounded-full bg-teal/20 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-teal" />
          </div>
          <p className="text-xs text-white/50 truncate">{userEmail}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </motion.aside>
  )
}
