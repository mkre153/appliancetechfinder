/**
 * Claims API Route
 *
 * Creates business ownership claims.
 * Phase 12: Marketing — Claim System
 *
 * POST /api/claims
 * Body: { companyId, name, email, phone, role, message }
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

type ClaimRole = 'owner' | 'manager' | 'employee' | 'other'
const VALID_ROLES: ClaimRole[] = ['owner', 'manager', 'employee', 'other']

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyId, name, email, phone, role, message } = body as {
      companyId?: number
      name?: string
      email?: string
      phone?: string
      role?: string
      message?: string
    }

    // Validate required fields
    if (!companyId || typeof companyId !== 'number') {
      return NextResponse.json(
        { error: 'companyId is required and must be a number' },
        { status: 400 }
      )
    }

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !role?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'All fields are required (name, email, phone, role, message)' },
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

    // Validate role
    if (!VALID_ROLES.includes(role as ClaimRole)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be: owner, manager, employee, or other' },
        { status: 400 }
      )
    }

    // Verify company exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: company, error: companyError } = await (supabaseAdmin as any)
      .from('repair_companies')
      .select('id, name')
      .eq('id', companyId)
      .single()

    if (companyError || !company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Check for existing pending claim with same email for this company
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingClaim } = await (supabaseAdmin as any)
      .from('store_claims')
      .select('id, status')
      .eq('company_id', companyId)
      .eq('claimer_email', email.trim().toLowerCase())
      .in('status', ['pending', 'approved'])
      .maybeSingle()

    if (existingClaim) {
      if (existingClaim.status === 'pending') {
        return NextResponse.json(
          { error: 'You already have a pending claim for this business' },
          { status: 409 }
        )
      }
      if (existingClaim.status === 'approved') {
        return NextResponse.json(
          { error: 'This business has already been claimed' },
          { status: 409 }
        )
      }
    }

    // Insert claim
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: claim, error: insertError } = await (supabaseAdmin as any)
      .from('store_claims')
      .insert({
        company_id: companyId,
        claimer_name: name.trim(),
        claimer_email: email.trim().toLowerCase(),
        claimer_phone: phone.trim(),
        claimer_role: role,
        message: message.trim(),
        status: 'pending',
      })
      .select('id, status')
      .single()

    if (insertError) {
      console.error('Claim insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create claim' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      claimId: claim.id,
      status: claim.status,
      message: 'Claim submitted successfully. It will be reviewed by an admin.',
    })
  } catch (error) {
    console.error('Claim creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create claim' },
      { status: 500 }
    )
  }
}
