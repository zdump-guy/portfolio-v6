import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { AdminProjectsTable } from '@/components/admin/AdminProjectsTable'

export const revalidate = 0

export default async function AdminProjectsPage() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, slug, role, featured, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Projects</h1>
          <p className="text-text-secondary text-sm mt-1">Manage your case studies and work</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 bg-teal text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-teal/90 transition-colors duration-200 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Projects table */}
      <div className="bg-bg-surface rounded-2xl border border-border-color shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border-color">
          <h2 className="font-semibold text-text-primary">All Projects</h2>
        </div>
        <AdminProjectsTable projects={projects ?? []} />
      </div>
    </div>
  )
}
