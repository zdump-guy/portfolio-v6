'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Edit, Trash2, Star, StarOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

interface CertificateRow {
  id: string
  title: string
  issuer: string
  date: string
  featured: boolean
  created_at: string
}

export function AdminCertificatesTable({ certificates: initialCertificates }: { certificates: CertificateRow[] }) {
  const [certificates, setCertificates] = useState(initialCertificates)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return
    setDeletingId(id)
    const supabase = createClient()
    await supabase.from('certificates').delete().eq('id', id)
    setCertificates((prev) => prev.filter((c) => c.id !== id))
    setDeletingId(null)
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    const supabase = createClient()
    await supabase.from('certificates').update({ featured: !current }).eq('id', id)
    setCertificates((prev) => prev.map((c) => c.id === id ? { ...c, featured: !current } : c))
  }

  if (certificates.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-text-secondary text-sm">No certificates yet.</p>
        <Link href="/admin/certificates/new" className="text-teal text-sm hover:underline mt-2 inline-block">
          Add your first certificate →
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider border-b border-border-color">
            <th className="px-6 py-3">Title</th>
            <th className="px-6 py-3 hidden sm:table-cell">Issuer</th>
            <th className="px-6 py-3 hidden md:table-cell">Date</th>
            <th className="px-6 py-3">Featured</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-color">
          {certificates.map((cert, i) => (
            <motion.tr
              key={cert.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-150"
            >
              <td className="px-6 py-4">
                <p className="font-medium text-text-primary">{cert.title}</p>
              </td>
              <td className="px-6 py-4 hidden sm:table-cell text-text-secondary">
                {cert.issuer}
              </td>
              <td className="px-6 py-4 hidden md:table-cell text-text-secondary">
                {cert.date}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => toggleFeatured(cert.id, cert.featured)}
                  className="text-text-secondary/50 hover:text-teal transition-colors duration-200"
                >
                  {cert.featured ? <Star className="w-4 h-4 fill-teal text-teal" /> : <StarOff className="w-4 h-4" />}
                </button>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/certificates/${cert.id}/edit`} className="p-1.5 text-text-secondary/50 hover:text-text-primary">
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button onClick={() => handleDelete(cert.id)} disabled={deletingId === cert.id} className="p-1.5 text-text-secondary/50 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
