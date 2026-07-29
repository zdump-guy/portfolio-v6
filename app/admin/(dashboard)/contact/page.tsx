import { createClient } from '@/lib/supabase/server'
import { ContactAdminClient } from './client'

export default async function ContactAdminPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('settings').select('*').single()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Contact & Footer Settings</h1>
      <ContactAdminClient initialSettings={settings} />
    </div>
  )
}
