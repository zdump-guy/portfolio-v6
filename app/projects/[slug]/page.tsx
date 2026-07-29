import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'
import { CaseStudyClient } from './client'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('projects')
    .select('title, role')
    .eq('slug', slug)
    .single()

  return {
    title: data ? `${data.title} — Portfolio` : 'Project — Portfolio',
    description: data?.role ? `Case study: ${data.title} — ${data.role}` : undefined,
  }
}



export const revalidate = 60

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!project) notFound()

  return <CaseStudyClient project={project} />
}
