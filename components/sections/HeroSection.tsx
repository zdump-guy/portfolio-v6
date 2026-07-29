'use client'

import type { Variants } from 'framer-motion'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowDown, Download } from 'lucide-react'

interface HeroSectionProps {
  name?: string | null
  roleChip?: string | null
  headline?: string | null
  subTagline?: string | null
  yearsExp?: number | null
  projectsCount?: number | null
  resumeUrl?: string | null
  // Legacy prop kept for backwards compat
  greeting?: string | null
}

export function HeroSection({
  name,
  roleChip,
  headline,
  subTagline,
  yearsExp,
  projectsCount,
  resumeUrl,
  greeting,
}: HeroSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const y = useTransform(scrollYProgress, [0, 1], [0, 160])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94])

  const springY = useSpring(y, { stiffness: 80, damping: 20 })

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  }

  const item: Variants = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  }

  // Resolve display values with fallbacks
  const displayRoleChip = roleChip ?? 'Available for work'
  const displayName = name ?? (greeting ? greeting.split(' ').slice(0, 3).join(' ') : "Hi, I'm")
  const displayHeadline = headline ?? 'UI/UX Designer & Dev.'
  const displaySubTagline = subTagline ?? 'Blending product thinking with engineering precision to craft digital experiences that feel both inevitable and delightful.'
  const displayYears = yearsExp ?? 3
  const displayProjects = projectsCount ?? 20
  const displayResumeUrl = resumeUrl ?? '/cv.pdf'

  const stats = [
    { value: `${displayYears}+`, label: 'Years of Experience' },
    { value: `${displayProjects}+`, label: 'Projects Delivered' },
  ]

  return (
    <motion.section
      ref={ref}
      style={{ opacity, scale }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      id="hero"
    >
      {/* Background Blobs */}
      <motion.div
        style={{ y: springY }}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <motion.div
          className="blob absolute top-[-10%] right-[-5%] w-[520px] h-[520px] bg-teal/12 rounded-full"
          animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="blob-2 absolute bottom-[5%] left-[-8%] w-[420px] h-[420px] bg-slate/8 rounded-full"
          animate={{ x: [0, -20, 30, 0], y: [0, 30, -20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(#475B63 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32">
        <motion.div variants={container} initial="hidden" animate="show">
          {/* Role chip */}
          <motion.div variants={item} className="flex items-center gap-3 mb-8">
            <span className="block w-8 h-px bg-teal" />
            <span className="text-sm font-medium text-teal tracking-widest uppercase">
              {displayRoleChip}
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={item}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-text-primary leading-[1.05] tracking-tight mb-6"
          >
            {displayName}
            <br />
            <motion.span
              className="text-teal inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              {displayHeadline}
            </motion.span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={item}
            className="text-lg text-text-secondary max-w-xl leading-relaxed mb-10"
          >
            {displaySubTagline}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-wrap items-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={scrollToProjects}
              className="group"
            >
              View Work
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-200" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => window.open(displayResumeUrl, '_blank')}
            >
              <Download className="w-4 h-4" />
              Download CV
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={item}
            className="flex flex-wrap gap-10 mt-16 pt-10 border-t border-slate/15"
          >
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-bold text-text-primary">{value}</p>
                <p className="text-sm text-text-secondary mt-1">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-secondary/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-slate/40 to-transparent"
          animate={{ scaleY: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.section>
  )
}
