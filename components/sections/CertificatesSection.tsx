'use client'

import { motion } from 'framer-motion'
import { Certificate } from '@/lib/types'
import { useState } from 'react'
import { CertificateModal } from '@/components/ui/CertificateModal'
import { Award, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface CertificatesSectionProps {
  certificates: Certificate[]
}

export function CertificatesSection({ certificates }: CertificatesSectionProps) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)

  if (!certificates || certificates.length === 0) {
    return null
  }

  return (
    <section id="certificates" className="section-padding relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-teal tracking-widest uppercase mb-3">
              <span className="block w-5 h-px bg-teal" />
              Achievements
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
              Certifications
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <Link
              href="/certificates"
              className="group inline-flex items-center gap-2 text-sm font-medium text-teal hover:text-text-primary transition-colors duration-200 whitespace-nowrap"
            >
              View all certificates
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <button
                onClick={() => setSelectedCert(cert)}
                className="group w-full text-left bg-glass-bg border border-border-color rounded-2xl overflow-hidden hover:border-teal/40 transition-all duration-300 shadow-sm"
              >
                {/* Thumbnail */}
                <div className="aspect-[4/3] w-full bg-black/5 dark:bg-white/5 overflow-hidden relative">
                  {cert.image_url ? (
                    <Image
                      src={cert.image_url}
                      alt={cert.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-secondary opacity-30">
                      <Award className="w-12 h-12" />
                    </div>
                  )}
                  {/* Hover overlay hint */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
                      View Certificate
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-text-primary mb-3 line-clamp-2 leading-snug">
                    {cert.title}
                  </h3>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <Award className="w-3.5 h-3.5 text-teal" />
                      <span className="truncate">{cert.issuer}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <Calendar className="w-3.5 h-3.5 text-teal" />
                      <span>{cert.date}</span>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </section>
  )
}
