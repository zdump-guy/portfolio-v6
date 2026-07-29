'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Briefcase, User, Mail, Sun, Moon, LayoutGrid, Award, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
const navLinks = [
  { id: 'projects', label: 'Work', href: '#projects', Icon: LayoutGrid },
  { id: 'certificates', label: 'Certificates', href: '#certificates', Icon: Award },
  { id: 'experience', label: 'Experience', href: '#experience', Icon: Briefcase },
  { id: 'about', label: 'About', href: '#about', Icon: User },
  { id: 'contact', label: 'Contact', href: '#contact', Icon: Mail },
]

export function Navbar() {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState('')
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const isManualScroll = useRef(false)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Intersection observer for active section highlight
  useEffect(() => {
    const sections = ['projects', 'certificates', 'experience', 'about', 'contact']
    const observers: IntersectionObserver[] = []

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { 
          if (entry.isIntersecting && !isManualScroll.current) {
            setActiveSection(id)
          }
        },
        { threshold: 0.4 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  // Clear active section when scrolled to the very top
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 100 && !isManualScroll.current) {
        setActiveSection('')
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    const id = href.replace('#', '')
    setActiveSection(id)
    isManualScroll.current = true
    
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current)

    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })

    scrollTimeout.current = setTimeout(() => {
      isManualScroll.current = false
    }, 1000)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (pathname !== '/') {
    return null
  }

  return (
    <motion.header
      initial={{ y: 50, opacity: 0, x: '-50%' }}
      animate={{ y: 0, opacity: 1, x: '-50%' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-1/2 z-50 bottom-6 md:bottom-auto md:top-6"
    >
      <nav className="flex items-center p-1.5 sm:p-2 rounded-full glass shadow-lg">
        <ul className="flex items-center gap-0.5 sm:gap-1">
          {navLinks.map(({ id, label, href, Icon }) => {
            const isActive = activeSection === id
            return (
              <motion.li key={href} layout>
                <button
                  onClick={() => handleNavClick(href)}
                  className={cn(
                    'relative flex items-center justify-center rounded-full transition-colors duration-300',
                    isActive 
                      ? 'px-3 py-1.5 sm:px-4 sm:py-2 text-bg-primary'
                      : 'w-9 h-9 sm:w-10 sm:h-10 text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5'
                  )}
                  aria-label={label}
                  title={label}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-text-primary rounded-full shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                    <Icon className="w-4 h-4 sm:w-4 sm:h-4" />
                    {isActive && <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{label}</span>}
                  </span>
                </button>
              </motion.li>
            )
          })}
        </ul>

        {/* Separator */}
        <div className="w-px h-6 bg-border-color mx-2 hidden sm:block" />

        <div className="flex items-center gap-1">
          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Scroll to top"
            title="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {mounted && (
              theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </nav>
    </motion.header>
  )
}
