import React from 'react'

import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { HiEnvelope } from 'react-icons/hi2'

export function GithubIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return <FaGithub className={className} />
}

export function LinkedinIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return <FaLinkedin className={className} />
}

export function MailIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return <HiEnvelope className={className} />
}

import {
  SiReact, SiNextdotjs, SiTailwindcss, SiTypescript, SiSupabase, SiFigma,
  SiNodedotjs, SiHtml5, SiCss, SiJavascript
} from 'react-icons/si'
import { FaCode } from 'react-icons/fa'

export function TechIcon({ name, className = 'w-4 h-4' }: { name: string; className?: string }) {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '')
  
  switch (normalized) {
    case 'react':
    case 'reactjs': return <SiReact className={className} />
    case 'nextjs':
    case 'next': return <SiNextdotjs className={className} />
    case 'tailwind':
    case 'tailwindcss': return <SiTailwindcss className={className} />
    case 'typescript':
    case 'ts': return <SiTypescript className={className} />
    case 'nodejs':
    case 'node': return <SiNodedotjs className={className} />
    case 'supabase': return <SiSupabase className={className} />
    case 'figma': return <SiFigma className={className} />
    case 'html':
    case 'html5': return <SiHtml5 className={className} />
    case 'css':
    case 'css3': return <SiCss className={className} />
    case 'js':
    case 'javascript': return <SiJavascript className={className} />
    default: return <FaCode className={className} />
  }
}

export function getTechHex(name: string): string | undefined {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '')
  switch (normalized) {
    case 'react':
    case 'reactjs': return '#61DAFB'
    case 'nextjs':
    case 'next': return 'currentColor'
    case 'tailwind':
    case 'tailwindcss': return '#06B6D4'
    case 'typescript':
    case 'ts': return '#3178C6'
    case 'nodejs':
    case 'node': return '#339933'
    case 'supabase': return '#3ECF8E'
    case 'figma': return '#F24E1E'
    case 'html':
    case 'html5': return '#E34F26'
    case 'css':
    case 'css3': return '#1572B6'
    case 'js':
    case 'javascript': return '#F7DF1E'
    default: return undefined
  }
}
