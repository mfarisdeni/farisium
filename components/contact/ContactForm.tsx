'use client'

import { useState, type FormEvent } from 'react'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface ContactFormProps {
  lang: 'id' | 'en'
}

const labels = {
  id: {
    name: 'Nama Lengkap',
    email: 'Email',
    subject: 'Subjek',
    message: 'Pesan',
    send: 'Kirim Pesan',
    sending: 'Mengirim...',
    success: 'Pesan berhasil dikirim! Kami akan menghubungi Anda segera.',
    error: 'Gagal mengirim pesan. Silakan coba lagi.',
    namePlaceholder: 'John Doe',
    emailPlaceholder: 'john@example.com',
    subjectPlaceholder: 'Pertanyaan tentang layanan',
    messagePlaceholder: 'Tulis pesan Anda di sini...',
  },
  en: {
    name: 'Full Name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
    send: 'Send Message',
    sending: 'Sending...',
    success: 'Message sent successfully! We will get back to you soon.',
    error: 'Failed to send message. Please try again.',
    namePlaceholder: 'John Doe',
    emailPlaceholder: 'john@example.com',
    subjectPlaceholder: 'Question about services',
    messagePlaceholder: 'Write your message here...',
  },
}

export default function ContactForm({ lang }: ContactFormProps) {
  const t = labels[lang]
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-frsc-text-200">{t.name}</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder={t.namePlaceholder}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-frsc-text-400 focus:border-frsc-crimson-500/50 focus:outline-none focus:ring-1 focus:ring-frsc-crimson-500/30"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-frsc-text-200">{t.email}</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder={t.emailPlaceholder}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-frsc-text-400 focus:border-frsc-crimson-500/50 focus:outline-none focus:ring-1 focus:ring-frsc-crimson-500/30"
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-frsc-text-200">{t.subject}</label>
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder={t.subjectPlaceholder}
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-frsc-text-400 focus:border-frsc-crimson-500/50 focus:outline-none focus:ring-1 focus:ring-frsc-crimson-500/30"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-frsc-text-200">{t.message}</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder={t.messagePlaceholder}
          className="w-full resize-y rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-frsc-text-400 focus:border-frsc-crimson-500/50 focus:outline-none focus:ring-1 focus:ring-frsc-crimson-500/30"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-frsc-crimson-600 to-frsc-purple-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:from-frsc-crimson-500 hover:to-frsc-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'loading' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {status === 'loading' ? t.sending : t.send}
      </button>
      {status === 'success' && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          <p className="text-sm text-emerald-200">{t.success}</p>
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
          <p className="text-sm text-red-200">{t.error}</p>
        </div>
      )}
    </form>
  )
}
