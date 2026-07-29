'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Settings } from '@/lib/types'

interface Props {
  initialSettings: Settings | null
}

export function ContactAdminClient({ initialSettings }: Props) {
  const supabase = createClient()
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  const [formData, setFormData] = useState({
    contact_headline: initialSettings?.contact_headline || '',
    contact_sub: initialSettings?.contact_sub || '',
    social_github: initialSettings?.social_github || '',
    social_github_label: initialSettings?.social_github_label || '',
    social_linkedin: initialSettings?.social_linkedin || '',
    social_linkedin_label: initialSettings?.social_linkedin_label || '',
    social_email: initialSettings?.social_email || '',
    social_email_label: initialSettings?.social_email_label || ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async () => {
    setStatus('saving')
    try {
      if (initialSettings?.id) {
        const { error } = await supabase
          .from('settings')
          .update(formData)
          .eq('id', initialSettings.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('settings')
          .insert([formData])
        if (error) throw error
      }

      setStatus('success')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (e) {
      console.error(e)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-all"
  const labelClass = "text-sm text-white/60 mb-2 block"

  return (
    <div className="space-y-8 bg-glass-bg border border-glass-border p-6 rounded-2xl backdrop-blur-xl">
      
      <div className="bg-teal/10 border border-teal/20 text-teal/90 rounded-xl p-4 flex items-start gap-3 text-sm">
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <p>These settings apply to both the Contact section and the Footer.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Contact Section Text</h2>
        
        <div>
          <label className={labelClass}>Contact Headline</label>
          <input
            name="contact_headline"
            value={formData.contact_headline}
            onChange={handleChange}
            placeholder="Let's Build\nSomething Great"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Contact Sub text</label>
          <textarea
            name="contact_sub"
            value={formData.contact_sub}
            onChange={handleChange}
            rows={3}
            className={`${inputClass} resize-none`}
            placeholder="Whether you have a project in mind..."
          />
        </div>
      </div>

      <hr className="border-white/10 my-8" />

      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-white">Social Links</h2>
        
        {/* GitHub */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
          <h3 className="text-white font-medium">GitHub</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>URL</label>
              <input
                name="social_github"
                value={formData.social_github}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Label</label>
              <input
                name="social_github_label"
                value={formData.social_github_label}
                onChange={handleChange}
                placeholder="GitHub"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* LinkedIn */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
          <h3 className="text-white font-medium">LinkedIn</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>URL</label>
              <input
                name="social_linkedin"
                value={formData.social_linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Label</label>
              <input
                name="social_linkedin_label"
                value={formData.social_linkedin_label}
                onChange={handleChange}
                placeholder="LinkedIn"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
          <h3 className="text-white font-medium">Email</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>URL (mailto:...)</label>
              <input
                name="social_email"
                value={formData.social_email}
                onChange={handleChange}
                placeholder="mailto:hello@example.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Label</label>
              <input
                name="social_email_label"
                value={formData.social_email_label}
                onChange={handleChange}
                placeholder="hello@example.com"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {status === 'success' && <span className="text-teal text-sm flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Saved</span>}
          {status === 'error' && <span className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Error saving</span>}
        </div>
        <Button variant="primary" onClick={handleSave} disabled={status === 'saving'}>
          <Save className="w-4 h-4 mr-2" />
          {status === 'saving' ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

    </div>
  )
}
