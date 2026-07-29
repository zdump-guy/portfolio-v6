import { createClient } from '@/lib/supabase/server'
import { Footer } from './Footer'

export async function FooterWrapper() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('settings').select('*').single()

  return (
    <Footer
      github={settings?.social_github}
      linkedin={settings?.social_linkedin}
      email={settings?.social_email}
      githubLabel={settings?.social_github_label}
      linkedinLabel={settings?.social_linkedin_label}
      emailLabel={settings?.social_email_label}
    />
  )
}
