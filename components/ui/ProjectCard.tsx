'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { TechIcon } from '@/components/ui/Icons'
import { Project } from '@/lib/types'

interface ProjectCardProps {
  project: Project
  index?: number
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/projects/${project.slug}`} className="group block h-full">
        <motion.article
          whileHover={{ y: -6 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative h-full rounded-2xl border border-border-color bg-glass-bg backdrop-blur-md shadow-sm overflow-hidden flex flex-col"
        >
          {/* Image */}
          <div className="relative aspect-[16/9] overflow-hidden bg-bg-primary">
            {project.image_url ? (
              <Image
                src={project.image_url}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal/10 to-slate/10">
                <span className="text-4xl font-bold text-teal/30">
                  {project.title.charAt(0)}
                </span>
              </div>
            )}
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-colors duration-300" />
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-6">
            {/* Role chip */}
            {project.role && (
              <span className="inline-block text-xs font-medium text-teal bg-teal/10 rounded-full px-3 py-1 w-fit mb-3">
                {project.role}
              </span>
            )}

            {/* Title */}
            <h3 className="text-lg font-semibold text-text-primary group-hover:text-teal transition-colors duration-200 mb-2 leading-snug">
              {project.title}
            </h3>

            {/* Tech stack */}
            {project.tech_stack && project.tech_stack.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-auto pt-4">
                {project.tech_stack.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="flex items-center gap-1.5 text-xs text-text-secondary border border-border-color rounded-md px-2 py-1 bg-black/5 dark:bg-white/5"
                  >
                    <TechIcon name={tech} className="w-3.5 h-3.5 text-text-secondary group-hover:text-teal transition-colors" />
                    {tech}
                  </span>
                ))}
                {project.tech_stack.length > 4 && (
                  <span className="text-xs text-text-secondary/60 px-2 py-0.5">
                    +{project.tech_stack.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* Arrow icon */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="bg-bg-surface border border-border-color rounded-full p-2 shadow-sm">
                <ArrowUpRight className="w-4 h-4 text-teal" />
              </div>
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  )
}
