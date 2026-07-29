'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Certificate } from '@/lib/types'

interface CertFormData {
  title: string
  issuer: string
  date: string
  linkedin_url: string
  featured: boolean
}

export function EditCertificateClient({ certificate }: { certificate: Certificate }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(certificate.image_url)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<CertFormData>({
    defaultValues: {
      title: certificate.title,
      issuer: certificate.issuer,
      date: certificate.date,
      linkedin_url: certificate.linkedin_url || '',
      featured: certificate.featured
    }
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const onSubmit = async (data: CertFormData) => {
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    let imageUrl = certificate.image_url

    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const filename = `cert-${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
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

    const { error: updateError } = await supabase.from('certificates').update({
      title: data.title,
      issuer: data.issuer,
      date: data.date,
      linkedin_url: data.linkedin_url || null,
      featured: data.featured,
      image_url: imageUrl,
    }).eq('id', certificate.id)

    if (updateError) {
      setError(updateError.message)
      setIsLoading(false)
      return
    }

    router.push('/admin/certificates')
    router.refresh()
  }

  const inputClass =
    'w-full bg-white dark:bg-bg-surface border border-border-color rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all duration-200'
  const labelClass = 'block text-sm font-medium text-text-primary mb-1.5'
  const errorClass = 'text-red-500 text-xs mt-1'

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/certificates" className="text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Edit Certificate</h1>
          <p className="text-text-secondary text-sm">Update achievement details</p>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white dark:bg-bg-surface rounded-2xl border border-border-color shadow-sm p-8"
      >
        <div>
          <label className={labelClass}>Certificate Title *</label>
          <input type="text" className={inputClass} {...register('title', { required: 'Required' })} />
          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Issuer *</label>
          <input type="text" className={inputClass} {...register('issuer', { required: 'Required' })} />
        </div>

        <div>
          <label className={labelClass}>Date *</label>
          <input type="text" className={inputClass} {...register('date', { required: 'Required' })} />
        </div>

        <div>
          <label className={labelClass}>LinkedIn Post URL</label>
          <input type="url" className={inputClass} {...register('linkedin_url')} />
        </div>

        <div>
          <label className={labelClass}>Certificate Image</label>
          <div className="relative">
            <input id="edit-image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            <label htmlFor="edit-image" className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-border-color rounded-xl cursor-pointer hover:border-teal/40 transition-colors bg-black/5 dark:bg-white/5">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full w-full object-contain" />
              ) : (
                <div className="text-center">
                  <Upload className="w-6 h-6 text-text-secondary/50 mx-auto mb-2" />
                  <p className="text-sm text-text-secondary">Upload image</p>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" className="w-4 h-4 rounded accent-teal" {...register('featured')} />
          <label className="text-sm font-medium text-text-primary">Feature on home page</label>
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</div>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
            <CheckCircle className="w-4 h-4" /> Save
          </Button>
          <Link href="/admin/certificates"><Button type="button" variant="secondary" size="lg">Cancel</Button></Link>
        </div>
      </motion.form>
    </div>
  )
}
