import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EditCertificateClient } from './client'

export default async function EditCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: cert } = await supabase
    .from('certificates')
    .select('*')
    .eq('id', id)
    .single()

  if (!cert) notFound()

  return <EditCertificateClient certificate={cert} />
}
