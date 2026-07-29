'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GithubIcon, LinkedinIcon, MailIcon } from '@/components/ui/Icons'

interface FooterProps {
  github?: string | null
  linkedin?: string | null
  email?: string | null
  githubLabel?: string | null
  linkedinLabel?: string | null
  emailLabel?: string | null
}

export function Footer({
  github,
  linkedin,
  email,
  githubLabel,
  linkedinLabel,
  emailLabel,
}: FooterProps) {
  const pathname = usePathname()
  const year = new Date().getFullYear()

  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="glass relative z-10 border-t border-border-color">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <p className="text-text-primary font-semibold text-sm">Portfolio</p>
            <p className="text-text-secondary text-xs mt-1">UI/UX Designer & Front-End Developer</p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {[
              { Icon: GithubIcon, href: github || 'https://github.com', label: githubLabel || 'GitHub' },
              { Icon: LinkedinIcon, href: linkedin || 'https://linkedin.com', label: linkedinLabel || 'LinkedIn' },
              { Icon: MailIcon, href: email || 'mailto:hello@portfolio.dev', label: emailLabel || 'Email' },
            ].map(({ Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={label}
                className="text-text-secondary hover:text-teal transition-colors duration-200 p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
              >
                <Icon className="w-4 h-4" />
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs text-text-secondary/60">
            © {year} Portfolio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
