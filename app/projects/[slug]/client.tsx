'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Calendar, Tag, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { TechIcon, getTechHex } from '@/components/ui/Icons'
import { Project } from '@/lib/types'

interface CaseStudyClientProps {
  project: Project
}

export function CaseStudyClient({ project }: CaseStudyClientProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!project.gallery) return
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % project.gallery!.length : null))
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!project.gallery) return
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + project.gallery!.length) % project.gallery!.length : null))
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-teal transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            All projects
          </Link>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          {/* Role chip */}
          {project.role && (
            <span className="inline-block text-xs font-semibold text-teal bg-teal/10 rounded-full px-3 py-1 mb-5">
              {project.role}
            </span>
          )}

          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary leading-tight mb-6">
            {project.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-text-secondary">
            {project.created_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(project.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long',
                })}
              </span>
            )}
            {project.live_link && (
              <a
                href={project.live_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-teal hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                Live site
              </a>
            )}
          </div>
        </motion.div>

        {/* Cover image */}
        {project.image_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative aspect-[16/9] min-h-[200px] sm:min-h-[300px] max-h-[500px] rounded-3xl overflow-hidden mb-12 shadow-lg"
          >
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        )}

        {/* Description */}
        {project.content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mb-14 max-w-4xl"
          >
            <p className="text-text-secondary/90 leading-relaxed whitespace-pre-wrap text-base">
              {project.content}
            </p>
          </motion.div>
        )}

        {/* Gallery and Tech Stack Split */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_250px] gap-12 md:gap-16">
          
          {/* Gallery (Left side) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {project.gallery && project.gallery.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {project.gallery.map((imgSrc, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => openLightbox(idx)}
                    className="relative aspect-[4/3] min-h-[150px] sm:min-h-[200px] max-h-[350px] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <Image
                      src={imgSrc}
                      alt={`${project.title} gallery image ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Tech Stack (Right side) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            {project.tech_stack && project.tech_stack.length > 0 && (
              <div className="sticky top-24">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-widest mb-6 border-b border-border-color pb-4">
                  <Tag className="w-3.5 h-3.5" />
                  Tech Stack
                </span>
                <div className="flex flex-col gap-4">
                  {project.tech_stack.map((tech) => (
                    <div
                      key={tech}
                      className="group flex items-center gap-4 p-3 rounded-2xl border border-transparent hover:border-border-color hover:bg-white/5 transition-all duration-300 cursor-default hover:translate-x-1"
                      style={{ '--hover-color': getTechHex(tech) || '#14b8a6' } as React.CSSProperties}
                    >
                      <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-black/5 dark:bg-white/5 group-hover:bg-transparent transition-colors duration-300">
                        <TechIcon 
                          name={tech} 
                          className="w-8 h-8 text-text-secondary transition-colors duration-300 group-hover:text-[var(--hover-color)]" 
                        />
                      </div>
                      <span className="text-sm font-semibold text-text-secondary group-hover:text-text-primary transition-colors duration-300">
                        {tech}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && project.gallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="relative w-full h-full flex items-center justify-center px-4 md:px-20">
              <button
                onClick={prevImage}
                className="absolute left-4 md:left-8 p-3 text-white/70 hover:text-white bg-white/10 rounded-full hover:bg-white/20 transition-all hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-5xl aspect-video rounded-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={project.gallery[lightboxIndex]}
                  alt={`Lightbox image ${lightboxIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </motion.div>

              <button
                onClick={nextImage}
                className="absolute right-4 md:right-8 p-3 text-white/70 hover:text-white bg-white/10 rounded-full hover:bg-white/20 transition-all hover:scale-110"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/50 px-4 py-1.5 rounded-full">
              {lightboxIndex + 1} / {project.gallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
