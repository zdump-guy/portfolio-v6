import { createClient } from '@/lib/supabase/server'
import AdminExperienceTable from '@/components/admin/AdminExperienceTable'
import { Experience } from '@/lib/types'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'

export default async function ExperienceAdminPage() {
  const supabase = await createClient()
  const { data: experiences, error } = await supabase
    .from('experiences')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    return <div>Error loading experiences: {error.message}</div>
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Experiences</h1>
          <p className="text-text-secondary text-sm">Manage your work history and roles.</p>
        </div>
        <Link href="/admin/experience/new">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            New Experience
          </Button>
        </Link>
      </div>

      <AdminExperienceTable experiences={experiences as Experience[]} />
    </div>
  )
}
