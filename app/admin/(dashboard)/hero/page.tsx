import { createClient } from '@/lib/supabase/server'
import HeroAdminClient from './client'
import { Settings } from '@/lib/types'

export default async function HeroAdminPage() {
  const supabase = await createClient()
  const { data: settings, error } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .single()

  if (error || !settings) {
    return <div>Error loading settings or no settings found.</div>
  }

  return <HeroAdminClient settings={settings as Settings} />
}
