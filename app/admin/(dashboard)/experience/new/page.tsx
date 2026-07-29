'use client'

import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, Upload } from 'lucide-react'
import Link from 'next/link'
import { Project } from '@/lib/types'

interface ExperienceFormData {
  date: string
  role: string
  company: string
  location: string
  type: string
  description: string
  tags: string
  sort_order: number
  highlight: boolean
  popup_description: string
  popup_what_i_did: string
}

export default function NewExperiencePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const { register, handleSubmit, formState: { errors } } = useForm<ExperienceFormData>({
    defaultValues: { highlight: false, sort_order: 0 }
  })

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
      if (data) setProjects(data as Project[])
    }
    fetchProjects()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setImageFiles(prev => [...prev, ...files])
    
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const toggleProject = (id: string) => {
    setSelectedProjects(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const onSubmit = async (data: ExperienceFormData) => {
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    let popup_images: string[] = []

    if (imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i]
        const ext = file.name.split('.').pop()
        const filename = `experience-images/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9]/g, '')}.${ext}`
        
        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filename, file, { upsert: true })

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('project-images')
            .getPublicUrl(filename)
          popup_images.push(urlData.publicUrl)
        } else {
          console.error("Upload error", uploadError)
        }
      }
    }

    const tagsArray = data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : null

    const { error: insertError } = await supabase.from('experiences').insert({
      date: data.date,
      role: data.role,
      company: data.company,
      location: data.location || null,
      type: data.type || null,
      description: data.description || null,
      tags: tagsArray,
      sort_order: data.sort_order,
      highlight: data.highlight,
      popup_description: data.popup_description || null,
      popup_what_i_did: data.popup_what_i_did || null,
      popup_images: popup_images.length > 0 ? popup_images : null,
      related_project_ids: selectedProjects.length > 0 ? selectedProjects : null,
    })

    if (insertError) {
      setError(insertError.message)
      setIsLoading(false)
      return
    }

    router.push('/admin/experience')
    router.refresh()
  }

  const inputClass =
    'w-full bg-white dark:bg-bg-surface border border-border-color rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all duration-200'
  const labelClass = 'block text-sm font-medium text-text-primary mb-1.5'

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/experience" className="text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">New Experience</h1>
          <p className="text-text-secondary text-sm">Add a new work experience or role</p>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="space-y-6 bg-bg-surface rounded-2xl border border-border-color shadow-sm p-8">
          <h2 className="text-lg font-semibold text-text-primary border-b border-border-color pb-2 mb-4">Basic Details</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Role *</label>
              <input type="text" className={inputClass} {...register('role', { required: 'Role is required' })} />
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Company *</label>
              <input type="text" className={inputClass} {...register('company', { required: 'Company is required' })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Date</label>
              <input type="text" placeholder="2024 — Present" className={inputClass} {...register('date', { required: 'Date is required' })} />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input type="text" className={inputClass} {...register('location')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Type</label>
              <input type="text" placeholder="Startup / Internship / Leadership" className={inputClass} {...register('type')} />
            </div>
            <div>
              <label className={labelClass}>Sort Order</label>
              <input type="number" className={inputClass} {...register('sort_order', { valueAsNumber: true })} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea rows={3} className={inputClass} {...register('description')} />
          </div>

          <div>
            <label className={labelClass}>Tags</label>
            <input type="text" placeholder="comma-separated, e.g. React, Figma" className={inputClass} {...register('tags')} />
          </div>

          <div className="flex items-center gap-3">
            <input id="highlight" type="checkbox" className="w-4 h-4 accent-teal" {...register('highlight')} />
            <label htmlFor="highlight" className="text-sm font-medium text-text-primary">Highlight this experience</label>
          </div>
        </div>

        <div className="space-y-6 bg-bg-surface rounded-2xl border border-border-color shadow-sm p-8">
          <h2 className="text-lg font-semibold text-text-primary border-b border-border-color pb-2 mb-4">Popup Details</h2>
          
          <div>
            <label className={labelClass}>Popup Description</label>
            <textarea rows={4} className={inputClass} {...register('popup_description')} />
          </div>

          <div>
            <label className={labelClass}>What I Did</label>
            <textarea rows={4} className={inputClass} {...register('popup_what_i_did')} />
          </div>

          <div>
            <label className={labelClass}>Popup Images</label>
            <div className="relative">
              <input id="popup-images" type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
              <label htmlFor="popup-images" className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border-color rounded-xl cursor-pointer hover:border-teal/40 transition-colors duration-200 bg-black/5 dark:bg-white/5 mb-4">
                <div className="text-center flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4 text-text-secondary/40" />
                  <p className="text-sm text-text-secondary">Click to add images</p>
                </div>
              </label>
              
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg border border-border-color overflow-hidden group">
                      <img src={src} alt="Preview" className="object-cover w-full h-full" />
                      <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className={labelClass}>Related Projects</label>
            {projects.length === 0 ? (
              <p className="text-sm text-text-secondary">No projects available.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto p-2 border border-border-color rounded-xl">
                {projects.map(project => (
                  <div key={project.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`project-${project.id}`}
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => toggleProject(project.id)}
                      className="accent-teal"
                    />
                    <label htmlFor={`project-${project.id}`} className="text-sm text-text-primary cursor-pointer">{project.title}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Create Experience
          </Button>
          <Link href="/admin/experience">
            <Button type="button" variant="secondary" size="lg">Cancel</Button>
          </Link>
        </div>
      </motion.form>
    </div>
  )
}
