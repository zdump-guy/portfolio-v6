'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { Briefcase, Code, Users, ChevronRight, X, ChevronLeft, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { Experience, Project } from '@/lib/types'

// Fallback icon map
function getIcon(type: string | null) {
  switch (type?.toLowerCase()) {
    case 'startup': return Code
    case 'leadership': return Users
    default: return Briefcase
  }
}

interface ExperienceModalProps {
  exp: Experience
  relatedProjects: Project[]
  onClose: () => void
}

function ExperienceModal({ exp, relatedProjects, onClose }: ExperienceModalProps) {
  const [imgIndex, setImgIndex] = useState(0)
  const images = exp.popup_images ?? []

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation()
    setImgIndex((i) => (i + 1) % images.length)
  }
  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation()
    setImgIndex((i) => (i - 1 + images.length) % images.length)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-3xl p-5 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          {exp.type && (
            <span className="inline-block text-xs font-semibold text-teal bg-teal/10 rounded-full px-3 py-1 mb-3">
              {exp.type}
            </span>
          )}
          <h3 className="text-2xl font-bold text-text-primary">{exp.role}</h3>
          <p className="text-teal font-medium mt-1">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
          <p className="text-sm text-text-secondary font-mono mt-1">{exp.date}</p>
        </div>

        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="relative mb-6 aspect-video rounded-2xl overflow-hidden bg-black/10">
            <Image
              src={images[imgIndex]}
              alt={`${exp.company} image ${imgIndex + 1}`}
              fill
              className="object-cover"
            />
            {images.length > 1 && (
              <>
                <button onClick={prevImg} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={nextImg} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white/70 bg-black/50 px-3 py-1 rounded-full">
                  {imgIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        )}

        {/* Popup Description */}
        {exp.popup_description && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-widest mb-2">Overview</h4>
            <p className="text-text-secondary leading-relaxed text-sm whitespace-pre-wrap">{exp.popup_description}</p>
          </div>
        )}

        {/* What I Did */}
        {exp.popup_what_i_did && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-widest mb-2">What I Did</h4>
            <p className="text-text-secondary leading-relaxed text-sm whitespace-pre-wrap">{exp.popup_what_i_did}</p>
          </div>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-widest mb-3">Related Projects</h4>
            <div className="flex flex-wrap gap-2">
              {relatedProjects.map((p) => (
                <a
                  key={p.id}
                  href={`/projects/${p.slug}`}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-teal/10 border border-teal/20 text-teal rounded-xl hover:bg-teal/20 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  {p.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

const FALLBACK_EXPERIENCES: Experience[] = [
  {
    id: '1',
    date: '2024 — Present',
    role: 'Founder & CEO',
    company: 'One Voxel',
    location: 'Remote',
    type: 'Startup',
    description: 'Founded and lead One Voxel, a software startup focused on delivering premium web solutions. Oversee product strategy, client relations, technical architecture, and a distributed team of developers and designers.',
    tags: ['Next.js', 'Supabase', 'Figma', 'Product Strategy'],
    highlight: true,
    popup_description: null,
    popup_what_i_did: null,
    popup_images: null,
    related_project_ids: null,
    sort_order: 0,
    created_at: '',
  },
  {
    id: '2',
    date: '2024',
    role: 'Computing Intern',
    company: 'ESIIC Headquarters',
    location: 'On-site',
    type: 'Internship',
    description: 'Completed a technical computing internship at ESIIC HQ, gaining hands-on exposure to enterprise systems, server administration, and internal tooling development.',
    tags: ['System Administration', 'Networking', 'Internal Tools'],
    highlight: false,
    popup_description: null,
    popup_what_i_did: null,
    popup_images: null,
    related_project_ids: null,
    sort_order: 1,
    created_at: '',
  },
  {
    id: '3',
    date: '2023 — Present',
    role: 'Technical Lead & Committee Member',
    company: 'IEEE / GDG / Enactus',
    location: 'MNU Campus',
    type: 'Leadership',
    description: 'Serve in technical leadership and committee roles across IEEE, Google Developer Groups, and Enactus at MNU. Organize hackathons, workshops, and community-building events.',
    tags: ['Leadership', 'Community Building', 'Mentoring', 'Event Management'],
    highlight: false,
    popup_description: null,
    popup_what_i_did: null,
    popup_images: null,
    related_project_ids: null,
    sort_order: 2,
    created_at: '',
  },
]

interface ExperienceSectionProps {
  experiences?: Experience[] | null
  allProjects?: Project[] | null
}

export function ExperienceSection({ experiences, allProjects }: ExperienceSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null)

  const displayExperiences = (experiences && experiences.length > 0) ? experiences : FALLBACK_EXPERIENCES
  const projects = allProjects ?? []

  const getRelatedProjects = (exp: Experience) => {
    if (!exp.related_project_ids || exp.related_project_ids.length === 0) return []
    return projects.filter((p) => exp.related_project_ids!.includes(p.id))
  }

  return (
    <section id="experience" className="section-padding relative overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 48px, #475B63 48px, #475B63 49px)',
        }}
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
            Experience
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary leading-tight">
            Professional
            <br />
            <span className="text-text-secondary">Journey</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div ref={ref} className="relative">
          {/* Vertical line */}
          <motion.div
            className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-teal/40 via-slate/20 to-transparent"
            initial={{ scaleY: 0, originY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />

          <div className="space-y-10 pl-16">
            {displayExperiences.map((exp, index) => {
              const Icon = getIcon(exp.type)
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 0.65,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-[2.65rem] top-6 flex items-center justify-center">
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                        exp.highlight
                          ? 'bg-teal text-white'
                          : 'bg-bg-surface border border-border-color text-teal'
                      }`}
                      whileHover={{ scale: 1.15 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.div>
                  </div>

                  {/* Card */}
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    className={`bg-glass-bg border border-border-color backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-sm ${
                      exp.highlight ? 'border-teal/40 bg-teal/10' : ''
                    }`}
                  >
                    {/* Date + type badge */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <time className="text-sm text-text-secondary font-mono">{exp.date}</time>
                      {exp.type && (
                        <span
                          className={`text-xs font-medium px-3 py-1 rounded-full ${
                            exp.highlight
                              ? 'bg-teal/15 text-teal'
                              : 'bg-slate/10 text-text-secondary'
                          }`}
                        >
                          {exp.type}
                        </span>
                      )}
                    </div>

                    {/* Role + company */}
                    <h3 className="text-xl font-semibold text-text-primary mb-1">{exp.role}</h3>
                    <p className="text-sm text-teal font-medium mb-3">
                      {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                    </p>

                    {/* Description */}
                    {exp.description && (
                      <p className="text-text-secondary text-sm leading-relaxed mb-4">{exp.description}</p>
                    )}

                    {/* Tags */}
                    {exp.tags && exp.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {exp.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2.5 py-1 bg-black/5 dark:bg-white/5 border border-border-color text-text-secondary rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* View Details Button */}
                    <button
                      onClick={() => setSelectedExp(exp)}
                      className="inline-flex items-center gap-2 text-sm font-medium text-teal hover:text-text-primary border border-teal/30 hover:border-teal/70 px-4 py-2 rounded-xl transition-all duration-200 hover:bg-teal/5"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedExp && (
          <ExperienceModal
            exp={selectedExp}
            relatedProjects={getRelatedProjects(selectedExp)}
            onClose={() => setSelectedExp(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
