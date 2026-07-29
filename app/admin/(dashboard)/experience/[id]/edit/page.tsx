import { createClient } from '@/lib/supabase/server'
import ExperienceEditClient from './client'
import { Experience, Project } from '@/lib/types'
import { notFound } from 'next/navigation'

export default async function ExperienceEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: experience, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !experience) {
    notFound()
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return <ExperienceEditClient experience={experience as Experience} projects={(projects || []) as Project[]} />
}
