/**
 * Single Deal API Route
 *
 * GET /api/deals/[id] - Get single deal by ID
 * PATCH /api/deals/[id] - Update deal status (verify email, admin approve/reject)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase/admin'

function hashCode(code: string): string {
  return createHash('sha256').update(code).digest('hex')
}

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params

    const { data, error } = // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseAdmin as any)
      .from('repair_deals')
      .select('*')
      .eq('id', id)
      .eq('status', 'approved')
      .gte('expires_at', new Date().toISOString())
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    return NextResponse.json({ deal: data })
  } catch (error) {
    console.error('Deal GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { action } = body

    // --- Email verification ---
    if (action === 'verify') {
      const { code } = body

      if (!code || typeof code !== 'string' || code.length !== 6) {
        return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
      }

      // Fetch the deal
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: deal, error: fetchError } = await (supabaseAdmin as any)
        .from('repair_deals')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError || !deal) {
        return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
      }

      // Check if already verified
      if (deal.status === 'approved') {
        return NextResponse.json({ message: 'Already verified', status: 'approved' })
      }

      // Check verification expiry
      if (new Date(deal.verification_expires_at) < new Date()) {
        return NextResponse.json({ error: 'Verification code expired. Please request a new one.' }, { status: 400 })
      }

      // Check attempts
      const attempts = (deal.verification_attempts || 0) + 1
      if (attempts > 5) {
        return NextResponse.json({ error: 'Too many attempts. Please request a new code.' }, { status: 429 })
      }

      // Verify code
      const codeHash = hashCode(code)
      if (codeHash !== deal.verification_code_hash) {
        // Increment attempts
        await (supabaseAdmin as any) // eslint-disable-line @typescript-eslint/no-explicit-any
          .from('repair_deals')
          .update({ verification_attempts: attempts })
          .eq('id', id)

        return NextResponse.json({ error: 'Invalid code. Please try again.' }, { status: 400 })
      }

      // Code matches — determine final status
      const finalStatus = deal.moderation_flagged ? 'pending_review' : 'approved'

      const { error: updateError } = await (supabaseAdmin as any) // eslint-disable-line @typescript-eslint/no-explicit-any
        .from('repair_deals')
        .update({
          status: finalStatus,
          email_verified_at: new Date().toISOString(),
          verification_code_hash: null,
          verification_expires_at: null,
          verification_attempts: 0,
        })
        .eq('id', id)

      if (updateError) {
        console.error('Error verifying deal:', updateError)
        return NextResponse.json({ error: 'Failed to verify' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        status: finalStatus,
        message: finalStatus === 'approved' ? 'Deal is now live!' : 'Deal is under review.',
      })
    }

    // --- Resend verification code ---
    if (action === 'resend') {
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      const codeHash = hashCode(code)
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

      const { error: updateError } = await (supabaseAdmin as any) // eslint-disable-line @typescript-eslint/no-explicit-any
        .from('repair_deals')
        .update({
          verification_code_hash: codeHash,
          verification_expires_at: expiresAt.toISOString(),
          verification_attempts: 0,
        })
        .eq('id', id)

      if (updateError) {
        return NextResponse.json({ error: 'Failed to resend code' }, { status: 500 })
      }

      // TODO: Send verification email
      if (process.env.NODE_ENV === 'development') {
        const { data: deal } = await (supabaseAdmin as any) // eslint-disable-line @typescript-eslint/no-explicit-any
          .from('repair_deals')
          .select('email')
          .eq('id', id)
          .single()
        console.log(`[Deals] New verification code for ${deal?.email}: ${code}`)
      }

      return NextResponse.json({ success: true, message: 'New verification code sent' })
    }

    // --- Admin status update ---
    if (action === 'approve' || action === 'reject') {
      // Check for admin auth header
      const adminKey = request.headers.get('x-admin-key')
      if (adminKey !== process.env.ADMIN_SECRET_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const newStatus = action === 'approve' ? 'approved' : 'rejected'

      const { error: updateError } = await (supabaseAdmin as any) // eslint-disable-line @typescript-eslint/no-explicit-any
        .from('repair_deals')
        .update({
          status: newStatus,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (updateError) {
        return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 })
      }

      return NextResponse.json({ success: true, status: newStatus })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Deal PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
