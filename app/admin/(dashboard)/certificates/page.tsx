import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { AdminCertificatesTable } from '@/components/admin/AdminCertificatesTable'

export default async function AdminCertificatesPage() {
  const supabase = await createClient()

  const { data: certificates } = await supabase
    .from('certificates')
    .select('id, title, issuer, date, featured, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary">Certificates</h1>
          <p className="text-text-secondary text-sm mt-1">Manage your professional certifications</p>
        </div>
        <Link
          href="/admin/certificates/new"
          className="inline-flex items-center gap-2 bg-teal text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-teal/90 transition-colors duration-200 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          New Certificate
        </Link>
      </div>

      {/* Certificates table */}
      <div className="bg-white dark:bg-bg-surface rounded-2xl border border-border-color shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border-color">
          <h2 className="font-semibold text-text-primary dark:text-text-primary">All Certificates</h2>
        </div>
        <AdminCertificatesTable certificates={certificates ?? []} />
      </div>
    </div>
  )
}
