import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EditProjectClient } from './client'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (!project) notFound()

  return <EditProjectClient project={project} />
}
