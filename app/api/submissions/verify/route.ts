/**
 * Verify Repair Company Submission API Route
 *
 * Validates the 6-digit code and marks the submission as verified.
 *
 * POST /api/submissions/verify
 */

import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase/admin'

const MAX_ATTEMPTS = 5

// Hash the code for comparison
function hashCode(code: string): string {
  return createHash('sha256').update(code).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { submissionId, code } = body

    if (!submissionId || !code) {
      return NextResponse.json(
        { error: 'Missing submissionId or code' },
        { status: 400 }
      )
    }

    // Get the submission
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: submission, error: fetchError } = await (supabaseAdmin as any)
      .from('repair_company_submissions')
      .select('*')
      .eq('id', submissionId)
      .single()

    if (fetchError || !submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Check if already verified
    if (submission.email_verified_at) {
      return NextResponse.json({
        success: true,
        message: 'Email already verified',
      })
    }

    // Check if code has expired
    if (
      submission.verification_expires_at &&
      new Date(submission.verification_expires_at) < new Date()
    ) {
      return NextResponse.json(
        { error: 'Verification code has expired. Please submit again.' },
        { status: 400 }
      )
    }

    // Check attempt limit
    if (submission.verification_attempts >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: 'Too many attempts. Please submit again.' },
        { status: 429 }
      )
    }

    // Verify the code
    const codeHash = hashCode(code.toString().trim())

    if (codeHash !== submission.verification_code_hash) {
      // Increment attempts
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabaseAdmin as any)
        .from('repair_company_submissions')
        .update({
          verification_attempts: submission.verification_attempts + 1,
        })
        .eq('id', submissionId)

      const attemptsRemaining =
        MAX_ATTEMPTS - submission.verification_attempts - 1

      return NextResponse.json(
        {
          error: 'Invalid verification code',
          attemptsRemaining: Math.max(0, attemptsRemaining),
        },
        { status: 400 }
      )
    }

    // Code is valid - mark as verified
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabaseAdmin as any)
      .from('repair_company_submissions')
      .update({
        email_verified_at: new Date().toISOString(),
        status: 'verified',
      })
      .eq('id', submissionId)

    if (updateError) {
      console.error('Failed to verify submission:', updateError)
      return NextResponse.json(
        { error: 'Failed to verify submission' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Email verified! Your submission is now under review.',
    })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify code' },
      { status: 500 }
    )
  }
}
