'use client'

import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { sendContactEmail } from '@/app/actions/contact'
import { GithubIcon, LinkedinIcon, MailIcon } from '@/components/ui/Icons'

interface ContactFormData {
  name: string
  email: string
  message: string
}

interface ContactSectionProps {
  headline?: string | null
  sub?: string | null
  github?: string | null
  linkedin?: string | null
  email?: string | null
  githubLabel?: string | null
  linkedinLabel?: string | null
  emailLabel?: string | null
}

export function ContactSection({
  headline,
  sub,
  github,
  linkedin,
  email,
  githubLabel,
  linkedinLabel,
  emailLabel,
}: ContactSectionProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>()

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const result = await sendContactEmail(data)
      if (result.success) {
        setStatus('success')
        reset()
      } else {
        setStatus('error')
        setErrorMessage(result.error || 'Failed to send message.')
      }
    } catch {
      setStatus('error')
      setErrorMessage('An unexpected error occurred.')
    } finally {
      setIsLoading(false)
      setTimeout(() => setStatus('idle'), 7000)
    }
  }

  const inputClass =
    'w-full bg-white/60 dark:bg-white/5 border border-border-color rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all duration-200 backdrop-blur-sm'

  const errorClass = 'text-red-500 text-xs mt-1'

  const displayHeadline = headline || "Let's Build\nSomething Great"
  const headlineParts = displayHeadline.split('\n')
  const part1 = headlineParts[0] || "Let's Build"
  const part2 = headlineParts.length > 1 ? headlineParts.slice(1).join(' ') : "Something Great"

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="blob absolute bottom-0 right-0 w-96 h-96 bg-teal/8"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="blob-2 absolute top-10 left-[-5%] w-72 h-72 bg-slate/5"
          animate={{ scale: [1, 0.9, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-teal tracking-widest uppercase mb-3">
              <span className="block w-5 h-px bg-teal" />
              Contact
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-text-primary leading-tight mb-6 whitespace-pre-line">
              {part1}
              <br />
              <span className="text-text-secondary">{part2}</span>
            </h2>
            <p className="text-text-secondary leading-relaxed mb-10">
              {sub || "Whether you have a project in mind, want to collaborate, or just want to say hello — my inbox is always open."}
            </p>

            {/* Social links */}
            <div className="space-y-3">
              {[
                { Icon: GithubIcon, label: githubLabel || 'GitHub', href: github || 'https://github.com' },
                { Icon: LinkedinIcon, label: linkedinLabel || 'LinkedIn', href: linkedin || 'https://linkedin.com' },
                { Icon: MailIcon, label: emailLabel || 'hello@portfolio.dev', href: email || 'mailto:hello@portfolio.dev' },
              ].map(({ Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-3 text-text-secondary hover:text-teal transition-colors duration-200 group"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/60 dark:bg-white/5 border border-border-color flex items-center justify-center group-hover:border-teal/30 group-hover:bg-teal/10 transition-colors duration-200">
                    <Icon className="w-4 h-4 text-text-secondary group-hover:text-teal transition-colors" />
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-glass-bg border border-glass-border backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-sm space-y-5"
            >
              {/* Name */}
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-text-primary mb-1.5">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Your name"
                  className={inputClass}
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <p className={errorClass}>{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-text-primary mb-1.5">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="you@example.com"
                  className={inputClass}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                  })}
                />
                {errors.email && <p className={errorClass}>{errors.email.message}</p>}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-text-primary mb-1.5">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="Tell me about your project..."
                  className={`${inputClass} resize-none`}
                  {...register('message', {
                    required: 'Message is required',
                    minLength: { value: 20, message: 'Message must be at least 20 characters' },
                  })}
                />
                {errors.message && <p className={errorClass}>{errors.message.message}</p>}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                <Send className="w-4 h-4" />
                Send Message
              </Button>

              {/* Status feedback */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-xl px-4 py-3"
                >
                  <CheckCircle className="w-4 h-4" />
                  Message sent! I'll get back to you soon.
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMessage || 'Something went wrong. Please try again.'}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
