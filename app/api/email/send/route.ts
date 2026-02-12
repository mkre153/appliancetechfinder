/**
 * Email Send API Route
 *
 * Admin-only endpoint for sending emails via Resend.
 *
 * Phase 12: Marketing -- Email System
 *
 * POST /api/email/send
 * Body: { to, subject, template, data }
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { getResendClient } from '@/lib/email/resend'
import { WelcomeEmail } from '@/lib/email/templates/welcome'
import { VerificationCodeEmail } from '@/lib/email/templates/verification-code'
import { renderNewsletterHtml } from '@/lib/email/templates/newsletter'
import { renderOutreachHtml } from '@/lib/email/templates/outreach'

const FROM_EMAIL = 'Appliance Tech Finder <info@appliancetechfinder.com>'

export async function POST(request: NextRequest) {
  try {
    // Admin only
    const { isAuthorized } = await requireAdmin()
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { to, subject, template, data } = body as {
      to: string
      subject: string
      template: string
      data?: Record<string, unknown>
    }

    if (!to || !subject || !template) {
      return NextResponse.json(
        { error: 'to, subject, and template are required' },
        { status: 400 }
      )
    }

    const resend = getResendClient()

    // Build email content based on template
    let emailOptions: {
      from: string
      to: string
      subject: string
      html?: string
      react?: React.ReactElement
    } = {
      from: FROM_EMAIL,
      to,
      subject,
    }

    switch (template) {
      case 'welcome':
        emailOptions.react = WelcomeEmail({ userEmail: to })
        break

      case 'verification-code':
        emailOptions.html = VerificationCodeEmail({
          code: (data?.code as string) || '000000',
          businessName: (data?.businessName as string) || 'Your Business',
        })
        break

      case 'newsletter':
        emailOptions.html = renderNewsletterHtml(
          (data?.posts as { title: string; description: string; slug: string }[]) || [],
          (data?.featuredCompanies as { name: string; city: string; state: string; slug: string; stateSlug: string; citySlug: string }[]) || [],
          (data?.unsubscribeUrl as string) || ''
        )
        break

      case 'outreach':
        emailOptions.html = renderOutreachHtml({
          companyName: (data?.companyName as string) || '',
          companyCity: (data?.companyCity as string) || '',
          companyState: (data?.companyState as string) || '',
          stateSlug: (data?.stateSlug as string) || '',
          citySlug: (data?.citySlug as string) || '',
          unsubscribeUrl: (data?.unsubscribeUrl as string) || '',
        })
        break

      default:
        return NextResponse.json(
          { error: `Unknown template: ${template}` },
          { status: 400 }
        )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await resend.emails.send(emailOptions as any)

    if (error) {
      console.error('Failed to send email:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
