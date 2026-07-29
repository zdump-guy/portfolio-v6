'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface ProjectFormData {
  title: string
  slug: string
  role: string
  tech_stack: string
  content: string
  live_link: string
  featured: boolean
}

export default function NewProjectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProjectFormData>({
    defaultValues: { featured: false }
  })

  const titleValue = watch('title')

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('title', e.target.value)
    setValue('slug', generateSlug(e.target.value))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setGalleryFiles(prev => [...prev, ...files])
    
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setGalleryPreviews(prev => [...prev, ...newPreviews])
  }

  const removeGalleryImage = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index))
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ProjectFormData) => {
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    let imageUrl: string | null = null

    // Upload image to Supabase Storage
    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const filename = `${data.slug}-${Date.now()}.${ext}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filename, imageFile, { upsert: true })

      if (uploadError) {
        setError(`Image upload failed: ${uploadError.message}`)
        setIsLoading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('project-images')
        .getPublicUrl(filename)
      imageUrl = urlData.publicUrl
    }

    let galleryUrls: string[] = []
    if (galleryFiles.length > 0) {
      for (let i = 0; i < galleryFiles.length; i++) {
        const file = galleryFiles[i]
        const ext = file.name.split('.').pop()
        const filename = `${data.slug}-gallery-${i}-${Date.now()}.${ext}`
        
        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filename, file, { upsert: true })

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('project-images')
            .getPublicUrl(filename)
          galleryUrls.push(urlData.publicUrl)
        }
      }
    }

    // Parse tech stack from comma-separated string
    const techStack = data.tech_stack
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const { error: insertError } = await supabase.from('projects').insert({
      title: data.title,
      slug: data.slug,
      role: data.role || null,
      tech_stack: techStack.length > 0 ? techStack : null,
      content: data.content || null,
      live_link: data.live_link || null,
      featured: data.featured,
      image_url: imageUrl,
      gallery: galleryUrls.length > 0 ? galleryUrls : null,
    })

    if (insertError) {
      setError(insertError.message)
      setIsLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  const inputClass =
    'w-full bg-white dark:bg-bg-surface border border-border-color rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all duration-200'

  const labelClass = 'block text-sm font-medium text-text-primary mb-1.5'
  const errorClass = 'text-red-500 text-xs mt-1'

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin"
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">New Project</h1>
          <p className="text-text-secondary text-sm">Add a new case study to your portfolio</p>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-bg-surface rounded-2xl border border-border-color shadow-sm p-8"
      >
        {/* Title */}
        <div>
          <label htmlFor="project-title" className={labelClass}>Project Title *</label>
          <input
            id="project-title"
            type="text"
            placeholder="e.g. One Voxel Platform"
            className={inputClass}
            {...register('title', { required: 'Title is required' })}
            onChange={onTitleChange}
          />
          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="project-slug" className={labelClass}>Slug (URL) *</label>
          <input
            id="project-slug"
            type="text"
            placeholder="one-voxel-platform"
            className={inputClass}
            {...register('slug', { required: 'Slug is required' })}
          />
          {errors.slug && <p className={errorClass}>{errors.slug.message}</p>}
        </div>

        {/* Role */}
        <div>
          <label htmlFor="project-role" className={labelClass}>Role / Position</label>
          <input
            id="project-role"
            type="text"
            placeholder="e.g. Founder & Lead Developer"
            className={inputClass}
            {...register('role')}
          />
        </div>

        {/* Tech stack */}
        <div>
          <label htmlFor="project-tech" className={labelClass}>Tech Stack</label>
          <input
            id="project-tech"
            type="text"
            placeholder="Next.js, Tailwind, Supabase (comma separated)"
            className={inputClass}
            {...register('tech_stack')}
          />
          <p className="text-xs text-text-secondary mt-1">Separate technologies with commas</p>
        </div>

        {/* Live link */}
        <div>
          <label htmlFor="project-link" className={labelClass}>Live URL</label>
          <input
            id="project-link"
            type="url"
            placeholder="https://example.com"
            className={inputClass}
            {...register('live_link')}
          />
        </div>

        {/* Image upload */}
        <div>
          <label className={labelClass}>Cover Image</label>
          <div className="relative mb-6">
            <input
              id="project-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="project-image"
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-border-color rounded-xl cursor-pointer hover:border-teal/40 transition-colors duration-200 bg-black/5 dark:bg-white/5 overflow-hidden"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="text-center">
                  <Upload className="w-6 h-6 text-text-secondary/40 mx-auto mb-2" />
                  <p className="text-sm text-text-secondary">Click to upload cover image</p>
                </div>
              )}
            </label>
          </div>

          <label className={labelClass}>Project Gallery (Multiple Images)</label>
          <div className="relative">
            <input
              id="project-gallery"
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryChange}
              className="hidden"
            />
            <label
              htmlFor="project-gallery"
              className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border-color rounded-xl cursor-pointer hover:border-teal/40 transition-colors duration-200 bg-black/5 dark:bg-white/5 mb-4"
            >
              <div className="text-center flex items-center justify-center gap-2">
                <Upload className="w-4 h-4 text-text-secondary/40" />
                <p className="text-sm text-text-secondary">Click to add gallery images</p>
              </div>
            </label>
            
            {galleryPreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
                {galleryPreviews.map((src, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg border border-border-color overflow-hidden group">
                    <img src={src} alt="Gallery item" className="object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3">
          <input
            id="project-featured"
            type="checkbox"
            className="w-4 h-4 rounded accent-teal"
            {...register('featured')}
          />
          <label htmlFor="project-featured" className="text-sm font-medium text-text-primary">
            Feature on home page
          </label>
        </div>

        {/* Plain Text Description */}
        <div>
          <label htmlFor="project-content" className={labelClass}>
            Project Description
          </label>
          <textarea
            id="project-content"
            rows={6}
            placeholder={`Describe the project...`}
            className={`${inputClass} resize-y leading-relaxed`}
            {...register('content')}
          />
          <p className="text-xs text-text-secondary mt-1">Simple text description of the project.</p>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
          >
            {error}
          </motion.div>
        )}

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
            <CheckCircle className="w-4 h-4" />
            Create Project
          </Button>
          <Link href="/admin">
            <Button type="button" variant="secondary" size="lg">
              Cancel
            </Button>
          </Link>
        </div>
      </motion.form>
    </div>
  )
}
