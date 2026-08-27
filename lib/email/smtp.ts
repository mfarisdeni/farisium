import nodemailer from 'nodemailer'

let _transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter {
  if (_transporter) return _transporter

  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD

  if (!host || !user || !pass) {
    throw new Error(
      'SMTP credentials are not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD in your environment.',
    )
  }

  _transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 465),
    secure: true,
    auth: { user, pass },
    tls: { servername: host },
  })

  return _transporter
}

export async function verifySmtp(): Promise<{ ok: boolean; error?: string }> {
  try {
    await getTransporter().verify()
    console.log('[SMTP] Connection verified')
    return { ok: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[SMTP] Connection verification failed:', message)
    return { ok: false, error: message }
  }
}

export async function sendSmtpMail(opts: {
  to: string
  subject: string
  html: string
}): Promise<{ messageId?: string; error?: string }> {
  try {
    const transporter = getTransporter()
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Farisium <hello@farisium.com>',
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    })
    console.log('[SMTP] Mail sent', { to: opts.to, messageId: result.messageId })
    return { messageId: result.messageId }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[SMTP] Mail send failed', { to: opts.to, error: message })
    return { error: message }
  }
}
