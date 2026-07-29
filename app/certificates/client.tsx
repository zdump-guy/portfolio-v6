'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Certificate } from '@/lib/types'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CertificateModal } from '@/components/ui/CertificateModal'
import { cn } from '@/lib/utils'

interface CertificatesPageClientProps {
  certificates: Certificate[]
}

export function CertificatesPageClient({ certificates }: CertificatesPageClientProps) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)

  const displayCertificates: Certificate[] = certificates

  // Split into two columns for masonry
  const leftColumn = displayCertificates.filter((_, i) => i % 2 === 0)
  const rightColumn = displayCertificates.filter((_, i) => i % 2 === 1)

  const MasonryCard = ({ cert, index, isRight }: { cert: Certificate, index: number, isRight: boolean }) => {
    // Alternate heights to create the masonry asymmetry
    const heights = ['h-[350px]', 'h-[450px]', 'h-[500px]', 'h-[400px]']
    const heightClass = heights[(index + (isRight ? 1 : 0)) % heights.length]

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
        className={cn("group relative w-full rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 cursor-pointer", heightClass)}
        onClick={() => setSelectedCert(cert)}
      >
        <div className="block w-full h-full">
          {/* Image */}
          {cert.image_url ? (
            <img 
              src={cert.image_url} 
              alt={cert.title} 
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
              <h3 className="text-2xl font-bold text-white mb-2">{cert.title}</h3>
              <p className="text-white/70 text-sm font-medium">{cert.issuer} • {cert.date}</p>
            </motion.div>
          </div>
        </div>
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
            Achievements
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold text-text-primary leading-tight">
            Certifications
          </h1>
          <p className="text-text-secondary mt-4 max-w-lg">
            A full collection of my professional certifications and achievements.
          </p>
        </motion.div>

        {/* Masonry Grid or Empty State */}
        {displayCertificates.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-border-color rounded-2xl bg-black/5 dark:bg-white/5">
            <p className="text-text-secondary">No certificates in the archive yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
            <div className="flex flex-col gap-6 lg:gap-8">
              {leftColumn.map((cert, i) => (
                <MasonryCard key={cert.id} cert={cert} index={i} isRight={false} />
              ))}
            </div>
            <div className="flex flex-col gap-6 lg:gap-8 md:mt-16">
              {rightColumn.map((cert, i) => (
                <MasonryCard key={cert.id} cert={cert} index={i} isRight={true} />
              ))}
            </div>
          </div>
        )}
      </div>

      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  )
}
