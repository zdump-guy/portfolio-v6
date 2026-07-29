'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Certificate } from '@/lib/types'
import { X, ExternalLink, Calendar, Award } from 'lucide-react'
import { useEffect } from 'react'
import Link from 'next/link'

interface CertificateModalProps {
  certificate: Certificate | null
  onClose: () => void
}

export function CertificateModal({ certificate, onClose }: CertificateModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (certificate) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleEsc)
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
      window.removeEventListener('keydown', handleEsc)
    }
  }, [certificate, onClose])

  return (
    <AnimatePresence>
      {certificate && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-3xl max-h-[90vh] bg-bg-surface border border-border-color rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-border-color">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-text-primary">
                    {certificate.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {certificate.issuer}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {certificate.date}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Image Body */}
              <div className="flex-1 overflow-auto bg-black/5 dark:bg-white/5 p-4 md:p-6 flex items-center justify-center min-h-[300px]">
                {certificate.image_url ? (
                  <img
                    src={certificate.image_url}
                    alt={certificate.title}
                    className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-md"
                  />
                ) : (
                  <div className="text-text-secondary flex flex-col items-center">
                    <Award className="w-12 h-12 mb-2 opacity-20" />
                    <p>No image provided</p>
                  </div>
                )}
              </div>

              {/* Footer CTA */}
              {certificate.linkedin_url && (
                <div className="p-4 md:p-6 border-t border-border-color flex justify-end">
                  <Link
                    href={certificate.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white px-5 py-2.5 rounded-xl font-medium transition-colors duration-200"
                  >
                    View LinkedIn Post
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
