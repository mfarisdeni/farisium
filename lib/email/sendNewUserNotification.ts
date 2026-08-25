import { getResend } from './resend'

interface NewUserData {
  email: string
  displayName: string
  joinedDate: string
  totalUsers: number
}

export async function sendNewUserNotification(data: NewUserData) {
  const { email, displayName, joinedDate, totalUsers } = data

  const resend = getResend()

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'Farisium <onboarding@resend.dev>',
    to: process.env.NOTIFICATION_EMAIL ?? 'hello@farisium.com',
    subject: '🎉 New User Joined',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
        <h1 style="font-size: 24px; margin: 0 0 4px;">🎉 New User Joined</h1>
        <p style="color: #666; margin: 0 0 24px; font-size: 14px;">
          User #${totalUsers}
        </p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #888; font-size: 13px; width: 100px; vertical-align: top;"><strong>Name</strong></td>
            <td style="padding: 10px 0; font-size: 14px;">${displayName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #888; font-size: 13px; width: 100px; vertical-align: top; border-top: 1px solid #eee;"><strong>Email</strong></td>
            <td style="padding: 10px 0; font-size: 14px; border-top: 1px solid #eee;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #888; font-size: 13px; width: 100px; vertical-align: top; border-top: 1px solid #eee;"><strong>Joined</strong></td>
            <td style="padding: 10px 0; font-size: 14px; border-top: 1px solid #eee;">${joinedDate}</td>
          </tr>
        </table>
      </div>
    `,
  })
}
