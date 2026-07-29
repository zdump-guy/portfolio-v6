import { createClient } from '@/lib/supabase/server'
import { ProjectCard } from '@/components/ui/ProjectCard'
import type { Metadata } from 'next'
import { motion } from 'framer-motion'
import { ProjectsPageClient } from './client'

export const metadata: Metadata = {
  title: 'Projects — Portfolio',
  description:
    'Explore all projects — premium web development solutions and UI/UX case studies built under One Voxel and as a freelancer.',
}

export const revalidate = 60

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return <ProjectsPageClient projects={projects ?? []} />
}
