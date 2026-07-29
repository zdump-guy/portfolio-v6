'use client'

import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { LogIn, AlertCircle } from 'lucide-react'
import type { Metadata } from 'next'

interface LoginFormData {
  email: string
  password: string
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      setError(authError.message)
      setIsLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  const inputClass =
    'w-full bg-white/60 dark:bg-white/5 border border-border-color rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all duration-200'

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6">
      {/* Background blob */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="blob absolute top-[-10%] right-[-5%] w-96 h-96 bg-teal/10 rounded-full" />
        <div className="blob-2 absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-slate/8 rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-glass-bg border border-glass-border backdrop-blur-xl rounded-3xl p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-teal/10 rounded-2xl mb-4">
              <LogIn className="w-5 h-5 text-teal" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
            <p className="text-sm text-text-secondary mt-1">Sign in to manage your portfolio</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-text-primary mb-1.5">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                placeholder="admin@example.com"
                className={inputClass}
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-text-primary mb-1.5">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                className={inputClass}
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
