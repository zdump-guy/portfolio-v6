'use client'

import { Experience } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Edit2, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function AdminExperienceTable({ experiences }: { experiences: Experience[] }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return

    setIsDeleting(id)
    const supabase = createClient()
    await supabase.from('experiences').delete().eq('id', id)
    setIsDeleting(null)
    router.refresh()
  }

  return (
    <div className="bg-bg-surface border border-border-color rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-secondary uppercase bg-black/5 dark:bg-white/5 border-b border-border-color">
            <tr>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Company</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Highlight</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {experiences.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-text-secondary">
                  No experiences found. Add your first one!
                </td>
              </tr>
            ) : (
              experiences.map((exp) => (
                <tr key={exp.id} className="border-b border-border-color last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-text-primary">{exp.role}</td>
                  <td className="px-6 py-4 text-text-secondary">{exp.company}</td>
                  <td className="px-6 py-4 text-text-secondary">{exp.date}</td>
                  <td className="px-6 py-4 text-text-secondary">{exp.type}</td>
                  <td className="px-6 py-4">
                    {exp.highlight ? (
                      <span className="px-2 py-1 text-xs font-medium bg-teal/10 text-teal rounded-full">
                        Highlighted
                      </span>
                    ) : (
                      <span className="text-text-secondary">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/experience/${exp.id}/edit`}
                      className="text-text-secondary hover:text-teal transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      disabled={isDeleting === exp.id}
                      className="text-text-secondary hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
