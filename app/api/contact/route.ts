/**
 * Contact API Route
 *
 * Handles contact form submissions.
 * Sends to GHL if configured, otherwise logs.
 *
 * Phase 12: Marketing — Contact & CRM
 *
 * POST /api/contact
 * Body: { name, email, subject, message }
 */

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { syncLeadToCrm } from '@/lib/crm'

const VALID_SUBJECTS = [
  'General Inquiry',
  'Business Inquiry',
  'Listing Correction',
  'Feedback',
]

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { name, email, subject, message } = body as {
      name?: string
      email?: string
      subject?: string
      message?: string
    }

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Validate subject
    if (!VALID_SUBJECTS.includes(subject)) {
      return NextResponse.json(
        { error: 'Invalid subject' },
        { status: 400 }
      )
    }

    // Store in database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: dbError } = await (supabaseAdmin as any)
      .from('contact_submissions')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
      })

    if (dbError) {
      console.error('Contact submission DB error:', dbError)
      // Don't fail the request if DB insert fails — still sync to GHL
    }

    // Sync to CRM (non-blocking)
    try {
      await syncLeadToCrm(email.trim().toLowerCase(), 'contact', {
        tags: ['contact-form', subject.toLowerCase().replace(/\s+/g, '-')],
        metadata: { name: name.trim(), subject, message: message.trim() },
      })
    } catch {}

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact submission error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
