import { createClient } from '@/lib/supabase/server'
import { AboutAdminClient } from './client'

export default async function AboutAdminPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('settings').select('*').single()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">About Settings</h1>
      <AboutAdminClient initialSettings={settings} />
    </div>
  )
}
