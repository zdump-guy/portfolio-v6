'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Project } from '@/lib/types'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProjectsPageClientProps {
  projects: Project[]
}

export function ProjectsPageClient({ projects }: ProjectsPageClientProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  // Collect all unique tech tags
  const allTags = Array.from(
    new Set(projects.flatMap((p) => p.tech_stack ?? []))
  ).sort()

  const filtered = activeTag
    ? projects.filter((p) => p.tech_stack?.includes(activeTag))
    : projects

  const displayProjects: Project[] = filtered

  // Split into two columns for masonry
  const leftColumn = displayProjects.filter((_, i) => i % 2 === 0)
  const rightColumn = displayProjects.filter((_, i) => i % 2 === 1)

  const MasonryCard = ({ project, index, isRight }: { project: Project, index: number, isRight: boolean }) => {
    // Alternate heights to create the masonry asymmetry if images don't load/have fixed heights
    // Since we're mimicking editorial masonry, having different heights is key
    const heights = ['h-[400px]', 'h-[550px]', 'h-[700px]', 'h-[450px]']
    const heightClass = heights[(index + (isRight ? 1 : 0)) % heights.length]

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
        className={cn("group relative w-full rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5", heightClass)}
      >
        <Link href={`/projects/${project.slug}`} className="block w-full h-full">
          {/* Image */}
          {project.image_url ? (
            <img 
              src={project.image_url} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-secondary/50 font-mono text-sm">
              [No Image]
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
            >
              <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
              {project.role && (
                <p className="text-white/70 text-sm font-medium">{project.role}</p>
              )}
            </motion.div>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-teal transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-teal tracking-widest uppercase mb-3">
            <span className="block w-5 h-px bg-teal" />
            All Work
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold text-text-primary leading-tight">
            Project
            <br />
            <span className="text-text-secondary">Archive</span>
          </h1>
          <p className="text-text-secondary mt-4 max-w-lg">
            A full collection of UI/UX case studies, web applications, and engineering projects.
          </p>
        </motion.div>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 mb-12"
          >
            <button
              onClick={() => setActiveTag(null)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
                !activeTag
                  ? 'bg-teal text-white shadow-sm'
                  : 'bg-glass-bg border border-border-color text-text-secondary hover:border-teal hover:text-teal'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
                  activeTag === tag
                    ? 'bg-teal text-white shadow-sm'
                    : 'bg-glass-bg border border-border-color text-text-secondary hover:border-teal hover:text-teal'
                }`}
              >
                {tag}
              </button>
            ))}
          </motion.div>
        )}

        {/* Masonry Grid or Empty State */}
        {displayProjects.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-border-color rounded-2xl bg-black/5 dark:bg-white/5">
            <p className="text-text-secondary">No projects in the archive yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
            <div className="flex flex-col gap-6 lg:gap-8">
              {leftColumn.map((project, i) => (
                <MasonryCard key={project.id} project={project} index={i} isRight={false} />
              ))}
            </div>
            <div className="flex flex-col gap-6 lg:gap-8 md:mt-16">
              {rightColumn.map((project, i) => (
                <MasonryCard key={project.id} project={project} index={i} isRight={true} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
