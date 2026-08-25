import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'mail.farisium.com',
  port: 465,
  secure: true,
  auth: {
    user: 'hello@farisium.com',
    pass: '!221295xxXX',
  },
})

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
    }

    await transporter.sendMail({
      from: '"Farisium Contact" <hello@farisium.com>',
      to: 'hello@farisium.com',
      replyTo: email,
      subject: `[Kontak Farisium] ${subject || 'Pesan Baru'}`,
      html: `
        <h2>Pesan Baru dari Form Kontak</h2>
        <p><strong>Nama:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subjek:</strong> ${subject || '-'}</p>
        <p><strong>Pesan:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}
