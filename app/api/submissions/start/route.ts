/**
 * Start Repair Company Submission API Route
 *
 * Creates a pending submission and generates a 6-digit verification code.
 *
 * POST /api/submissions/start
 */

import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { validateSubmission, type SubmissionFormData } from '@/lib/store-submission'
import { supabaseAdmin } from '@/lib/supabase/admin'

// Generate a random 6-digit code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Hash the code for storage
function hashCode(code: string): string {
  return createHash('sha256').update(code).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Build form data
    const formData: SubmissionFormData = {
      companyName: body.companyName || '',
      address: body.address || '',
      city: body.city || '',
      state: body.state || '',
      zip: body.zip || '',
      phone: body.phone || '',
      email: body.email || '',
      website: body.website || '',
      services: body.services || '',
      description: body.description || '',
    }

    // Validate
    const result = validateSubmission(formData)

    if (!result.valid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: result.errors },
        { status: 400 }
      )
    }

    // Generate verification code
    const code = generateCode()
    const codeHash = hashCode(code)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Create pending submission with verification data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: submission, error } = await (supabaseAdmin as any)
      .from('repair_company_submissions')
      .insert({
        ...result.data!,
        verification_code_hash: codeHash,
        verification_expires_at: expiresAt.toISOString(),
        status: 'pending',
        verification_attempts: 0,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Failed to create submission:', error)
      return NextResponse.json(
        { error: 'Failed to create submission' },
        { status: 500 }
      )
    }

    // TODO: Send verification email via Resend
    // For now, log the code to console
    console.log(`[Submission] Verification code for ${formData.email}: ${code}`)

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      email: formData.email,
      message: `Verification code sent to ${formData.email}`,
    })
  } catch (error) {
    console.error('Submission start error:', error)
    return NextResponse.json(
      { error: 'Failed to start submission' },
      { status: 500 }
    )
  }
}
