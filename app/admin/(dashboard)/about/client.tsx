'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, X, Image as ImageIcon, Type, Save, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Settings, SkillGroup, Language } from '@/lib/types'

interface Props {
  initialSettings: Settings | null
}

export function AboutAdminClient({ initialSettings }: Props) {
  const supabase = createClient()
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  const [aboutText, setAboutText] = useState(initialSettings?.about_text || '')
  
  const [languages, setLanguages] = useState<Language[]>(
    initialSettings?.languages || []
  )
  
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(
    initialSettings?.skills || []
  )

  const handleSave = async () => {
    setStatus('saving')
    try {
      const payload = {
        about_text: aboutText,
        languages,
        skills: skillGroups
      }

      if (initialSettings?.id) {
        const { error } = await supabase
          .from('settings')
          .update(payload)
          .eq('id', initialSettings.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('settings')
          .insert([payload])
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

  return (
    <div className="space-y-8 bg-glass-bg border border-glass-border p-6 rounded-2xl backdrop-blur-xl">
      
      {/* SECTION 1: About Me */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">About Me</h2>
        <div className="space-y-2">
          <label className="text-sm text-white/60">Narrative Text</label>
          <textarea
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            rows={5}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal resize-none"
            placeholder="I'm a Computer Science & AI student..."
          />
        </div>
      </div>

      <hr className="border-white/10 my-8" />

      {/* SECTION 2: Languages */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Languages</h2>
        
        <div className="space-y-3">
          {languages.map((lang, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <input
                type="text"
                value={lang.lang}
                onChange={(e) => {
                  const newLangs = [...languages]
                  newLangs[idx].lang = e.target.value
                  setLanguages(newLangs)
                }}
                placeholder="Language (e.g. English)"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-teal outline-none"
              />
              <input
                type="text"
                value={lang.level}
                onChange={(e) => {
                  const newLangs = [...languages]
                  newLangs[idx].level = e.target.value
                  setLanguages(newLangs)
                }}
                placeholder="Level (e.g. Native)"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-teal outline-none"
              />
              <input
                type="number"
                value={lang.pct}
                min={0}
                max={100}
                onChange={(e) => {
                  const newLangs = [...languages]
                  newLangs[idx].pct = Number(e.target.value)
                  setLanguages(newLangs)
                }}
                placeholder="%"
                className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-teal outline-none"
              />
              <button
                onClick={() => setLanguages(languages.filter((_, i) => i !== idx))}
                className="p-2 text-white/40 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setLanguages([...languages, { lang: '', level: '', pct: 50 }])}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Language
        </Button>
      </div>

      <hr className="border-white/10 my-8" />

      {/* SECTION 3: Skills */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-white">Skills</h2>
        
        <div className="space-y-6">
          {skillGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={group.category}
                  onChange={(e) => {
                    const newGroups = [...skillGroups]
                    newGroups[groupIdx].category = e.target.value
                    setSkillGroups(newGroups)
                  }}
                  placeholder="Category Name (e.g. Front-End)"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm font-medium text-teal focus:border-teal outline-none"
                />
                <button
                  onClick={() => setSkillGroups(skillGroups.filter((_, i) => i !== groupIdx))}
                  className="p-2 text-white/40 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 pl-4 border-l border-white/10">
                {group.skills.map((skill, skillIdx) => (
                  <div key={skillIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => {
                        const newGroups = [...skillGroups]
                        newGroups[groupIdx].skills[skillIdx].name = e.target.value
                        setSkillGroups(newGroups)
                      }}
                      placeholder="Skill Name"
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-teal outline-none"
                    />
                    <button
                      title={skill.useIcon ? 'Using Icon Mode' : 'Using Text Mode'}
                      onClick={() => {
                        const newGroups = [...skillGroups]
                        newGroups[groupIdx].skills[skillIdx].useIcon = !skill.useIcon
                        setSkillGroups(newGroups)
                      }}
                      className={`p-1.5 rounded-md border ${skill.useIcon ? 'bg-teal/20 border-teal/40 text-teal' : 'bg-white/5 border-white/10 text-white/60'} hover:bg-white/10 transition-colors`}
                    >
                      {skill.useIcon ? <ImageIcon className="w-4 h-4" /> : <Type className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => {
                        const newGroups = [...skillGroups]
                        newGroups[groupIdx].skills = newGroups[groupIdx].skills.filter((_, i) => i !== skillIdx)
                        setSkillGroups(newGroups)
                      }}
                      className="p-1.5 text-white/40 hover:text-red-400 hover:bg-white/5 rounded-md transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-xs text-white/60 hover:text-white"
                  onClick={() => {
                    const newGroups = [...skillGroups]
                    newGroups[groupIdx].skills.push({ name: '', useIcon: false })
                    setSkillGroups(newGroups)
                  }}
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Skill
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setSkillGroups([...skillGroups, { category: '', skills: [] }])}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Skill Group
        </Button>
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
