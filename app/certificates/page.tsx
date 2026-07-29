import { createClient } from '@/lib/supabase/server'
import { CertificatesPageClient } from './client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Certifications — Portfolio',
  description: 'A full collection of my professional certifications and achievements.',
}

export const revalidate = 60

export default async function CertificatesPage() {
  const supabase = await createClient()

  const { data: certificates } = await supabase
    .from('certificates')
    .select('*')
    .order('created_at', { ascending: false })

  return <CertificatesPageClient certificates={certificates ?? []} />
}
