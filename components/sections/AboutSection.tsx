'use client'

import { motion } from 'framer-motion'
import { TechIcon, getTechHex } from '@/components/ui/Icons'

const defaultSkillGroups = [
  {
    category: 'Front-End',
    skills: [
      { name: 'React', useIcon: false },
      { name: 'Next.js', useIcon: false },
      { name: 'TypeScript', useIcon: false },
      { name: 'Tailwind CSS', useIcon: false },
      { name: 'Framer Motion', useIcon: false }
    ],
  },
  {
    category: 'Design',
    skills: [
      { name: 'Figma', useIcon: false },
      { name: 'UI/UX Principles', useIcon: false },
      { name: 'Design Systems', useIcon: false },
      { name: 'Prototyping', useIcon: false },
      { name: 'User Research', useIcon: false }
    ],
  },
  {
    category: 'Back-End & Infra',
    skills: [
      { name: 'Node.js', useIcon: false },
      { name: 'Supabase', useIcon: false },
      { name: 'PostgreSQL', useIcon: false },
      { name: 'REST APIs', useIcon: false },
      { name: 'Server Administration', useIcon: false }
    ],
  },
  {
    category: 'Hardware & Systems',
    skills: [
      { name: 'Networking', useIcon: false },
      { name: 'Linux Admin', useIcon: false },
      { name: 'Hardware Deployment', useIcon: false },
      { name: 'Computer Architecture', useIcon: false }
    ],
  },
]

const defaultLanguages = [
  { lang: 'Arabic', level: 'Native', pct: 100 },
  { lang: 'English', level: 'C2 Proficient', pct: 97 },
  { lang: 'French', level: 'Intermediate', pct: 55 },
]

interface AboutSectionProps {
  aboutText?: string | null
  skills?: import('@/lib/types').SkillGroup[] | null
  languages?: import('@/lib/types').Language[] | null
}

export function AboutSection({ aboutText, skills, languages }: AboutSectionProps) {
  const narrativeText =
    aboutText ||
    "I'm a Computer Science & AI student at MNU, where I balance a rigorous academic schedule with running One Voxel — a software startup I founded — and an active freelancing practice. I believe the best products are born at the intersection of clear design thinking and solid engineering. My experience spans everything from pixel-perfect Figma prototypes to configuring bare-metal servers, giving me a rare end-to-end perspective."
  
  const displaySkills = skills || defaultSkillGroups
  const displayLanguages = languages || defaultLanguages

  return (
    <section id="about" className="section-padding bg-bg-primary relative overflow-hidden">
      {/* Background accent */}
      <motion.div
        className="blob absolute -top-20 -right-20 w-80 h-80 bg-teal/6 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-teal tracking-widest uppercase mb-3">
            <span className="block w-5 h-px bg-teal" />
            About
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary leading-tight">
            The Person
            <br />
            <span className="text-text-secondary">Behind the Work</span>
          </h2>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left — Narrative */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-lg text-text-secondary leading-relaxed mb-8">{narrativeText}</p>

            {/* Language competencies */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-widest">
                Language Proficiency
              </h3>
              {displayLanguages.map(({ lang, level, pct }, i) => (
                <div key={lang}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-text-primary">{lang}</span>
                    <span className="text-xs text-text-secondary">{level}</span>
                  </div>
                  <div className="h-1.5 bg-slate/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-teal to-teal/60 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Skills Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            {displaySkills.map(({ category, skills }, groupIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: groupIndex * 0.08 }}
                className="glass rounded-2xl p-5"
              >
                <h3 className="text-xs font-semibold text-teal uppercase tracking-widest mb-3">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, skillIndex) => (
                    skill.useIcon ? (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: groupIndex * 0.08 + skillIndex * 0.04 }}
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border-color hover:border-[var(--hover-color)] transition-colors group cursor-default min-w-[72px]"
                        style={{ '--hover-color': getTechHex(skill.name) || '#14b8a6' } as React.CSSProperties}
                      >
                        <TechIcon name={skill.name} className="w-5 h-5 text-text-secondary transition-colors duration-300 group-hover:text-[var(--hover-color)]" />
                        <span className="text-[10px] font-medium text-text-secondary text-center leading-tight max-w-full truncate group-hover:text-text-primary transition-colors">
                          {skill.name}
                        </span>
                      </motion.div>
                    ) : (
                      <motion.span
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: groupIndex * 0.08 + skillIndex * 0.04 }}
                        whileHover={{ scale: 1.05 }}
                        className="text-sm px-3.5 py-1.5 bg-black/5 dark:bg-white/5 border border-border-color text-text-primary font-medium rounded-xl cursor-default hover:border-teal/40 transition-colors"
                      >
                        {skill.name}
                      </motion.span>
                    )
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
