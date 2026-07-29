'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactPayload {
  name: string
  email: string
  message: string
}

export async function sendContactEmail(payload: ContactPayload) {
  const { name, email, message } = payload
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey || !apiKey.startsWith('re_')) {
    return {
      success: false,
      error: 'Invalid or missing RESEND_API_KEY in .env.local. Resend API keys start with "re_".',
    }
  }

  const toEmail = process.env.RESEND_TO_EMAIL || 'hello@portfolio.dev'

  try {
    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [toEmail],
      replyTo: email,
      subject: `New message from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2E2C2F; border-bottom: 2px solid #79A2AD; padding-bottom: 8px;">
            New Portfolio Contact
          </h2>
          <p style="color: #475B63;"><strong style="color: #2E2C2F;">From:</strong> ${name}</p>
          <p style="color: #475B63;"><strong style="color: #2E2C2F;">Email:</strong> ${email}</p>
          <div style="background: #FCF7F8; border-left: 3px solid #79A2AD; padding: 16px; margin: 16px 0; border-radius: 4px;">
            <p style="color: #2E2C2F; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #999; font-size: 12px;">Sent via portfolio contact form</p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    console.error('Contact action error:', err)
    return { success: false, error: err?.message || 'Failed to send email' }
  }
}
