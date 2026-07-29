'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Settings } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

export default function HeroAdminClient({ settings }: { settings: Settings }) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus(null)

    const formData = new FormData(e.currentTarget)
    
    const updates = {
      hero_name: formData.get('hero_name') as string,
      hero_role_chip: formData.get('hero_role_chip') as string,
      hero_headline: formData.get('hero_headline') as string,
      hero_sub_tagline: formData.get('hero_sub_tagline') as string,
      stat_years_experience: Number(formData.get('stat_years_experience')) || null,
      stat_projects_count: Number(formData.get('stat_projects_count')) || null,
      resume_url: formData.get('resume_url') as string,
    }

    const supabase = createClient()
    const { error } = await supabase
      .from('settings')
      .update(updates)
      .eq('id', settings.id)

    setIsLoading(false)

    if (error) {
      setStatus({ type: 'error', message: error.message })
    } else {
      setStatus({ type: 'success', message: 'Hero settings updated successfully!' })
      setTimeout(() => setStatus(null), 3000)
    }
  }

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all duration-200'
  const labelClass = 'block text-sm font-medium text-white/60 mb-1.5'

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Hero Settings</h1>
        <p className="text-white/60 text-sm">Manage the landing page hero section.</p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={onSubmit}
        className="space-y-6 bg-black/20 rounded-2xl border border-white/10 shadow-sm p-8"
      >
        <div>
          <label htmlFor="hero_name" className={labelClass}>Name/Greeting</label>
          <input
            id="hero_name"
            name="hero_name"
            type="text"
            defaultValue={settings.hero_name || ''}
            className={inputClass}
            placeholder="Hi, I'm"
          />
        </div>

        <div>
          <label htmlFor="hero_role_chip" className={labelClass}>Role Chip Text</label>
          <input
            id="hero_role_chip"
            name="hero_role_chip"
            type="text"
            defaultValue={settings.hero_role_chip || ''}
            className={inputClass}
            placeholder="Available for work"
          />
        </div>

        <div>
          <label htmlFor="hero_headline" className={labelClass}>Main Headline</label>
          <input
            id="hero_headline"
            name="hero_headline"
            type="text"
            defaultValue={settings.hero_headline || ''}
            className={inputClass}
            placeholder="UI/UX Designer & Dev."
          />
        </div>

        <div>
          <label htmlFor="hero_sub_tagline" className={labelClass}>Sub-tagline</label>
          <textarea
            id="hero_sub_tagline"
            name="hero_sub_tagline"
            rows={4}
            defaultValue={settings.hero_sub_tagline || ''}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="stat_years_experience" className={labelClass}>Years of Experience</label>
            <input
              id="stat_years_experience"
              name="stat_years_experience"
              type="number"
              defaultValue={settings.stat_years_experience || ''}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="stat_projects_count" className={labelClass}>Projects Count</label>
            <input
              id="stat_projects_count"
              name="stat_projects_count"
              type="number"
              defaultValue={settings.stat_projects_count || ''}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="resume_url" className={labelClass}>CV URL</label>
          <input
            id="resume_url"
            name="resume_url"
            type="text"
            defaultValue={settings.resume_url || ''}
            className={inputClass}
          />
        </div>

        {status && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-sm px-4 py-3 rounded-xl border ${
              status.type === 'error'
                ? 'text-red-400 bg-red-400/10 border-red-400/20'
                : 'text-teal-400 bg-teal-400/10 border-teal-400/20'
            }`}
          >
            {status.message}
          </motion.div>
        )}

        <div className="pt-2">
          <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </motion.form>
    </div>
  )
}
