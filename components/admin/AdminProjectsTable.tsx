'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Edit, Trash2, Star, StarOff, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

interface ProjectRow {
  id: string
  title: string
  slug: string
  role: string | null
  featured: boolean
  created_at: string
}

interface AdminProjectsTableProps {
  projects: ProjectRow[]
}

export function AdminProjectsTable({ projects: initialProjects }: AdminProjectsTableProps) {
  const router = useRouter()
  const [projects, setProjects] = useState(initialProjects)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) return
    setDeletingId(id)
    const supabase = createClient()
    await supabase.from('projects').delete().eq('id', id)
    setProjects((prev) => prev.filter((p) => p.id !== id))
    setDeletingId(null)
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    const supabase = createClient()
    await supabase.from('projects').update({ featured: !current }).eq('id', id)
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, featured: !current } : p))
  }

  if (projects.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-text-secondary text-sm">No projects yet.</p>
        <Link href="/admin/projects/new" className="text-teal text-sm hover:underline mt-2 inline-block">
          Create your first project →
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
            <th className="px-6 py-3 hidden sm:table-cell">Role</th>
            <th className="px-6 py-3 hidden md:table-cell">Date</th>
            <th className="px-6 py-3">Featured</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-color">
          {projects.map((project, i) => (
            <motion.tr
              key={project.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-150"
            >
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-text-primary">{project.title}</p>
                  <p className="text-xs text-text-secondary font-mono mt-0.5">/projects/{project.slug}</p>
                </div>
              </td>
              <td className="px-6 py-4 hidden sm:table-cell text-text-secondary">
                {project.role ?? '—'}
              </td>
              <td className="px-6 py-4 hidden md:table-cell text-text-secondary" suppressHydrationWarning>
                {project.created_at ? new Date(project.created_at).toLocaleDateString('en-US') : '—'}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => toggleFeatured(project.id, project.featured)}
                  className="text-text-secondary/50 hover:text-teal transition-colors duration-200"
                  title={project.featured ? 'Unfeature' : 'Feature'}
                >
                  {project.featured ? (
                    <Star className="w-4 h-4 fill-teal text-teal" />
                  ) : (
                    <StarOff className="w-4 h-4" />
                  )}
                </button>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/projects/${project.slug}`}
                    target="_blank"
                    className="p-1.5 text-text-secondary/50 hover:text-teal transition-colors"
                    title="View live"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="p-1.5 text-text-secondary/50 hover:text-text-primary transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={deletingId === project.id}
                    className="p-1.5 text-text-secondary/50 hover:text-red-500 transition-colors disabled:opacity-40"
                    title="Delete"
                  >
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
