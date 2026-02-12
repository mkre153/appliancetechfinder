/**
 * Deals API Route
 *
 * GET /api/deals - List active deals (status=approved, not expired)
 * POST /api/deals - Submit new deal, moderate content, send verification
 */

import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { validateDealSubmission, type DealFormData } from '@/lib/deal-submission'
import { moderateText } from '@/lib/moderation'

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function hashCode(code: string): string {
  return createHash('sha256').update(code).digest('hex')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const appliance = searchParams.get('appliance')
    const discount = searchParams.get('discount')
    const sort = searchParams.get('sort') || 'newest'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabaseAdmin as any)
      .from('repair_deals')
      .select('*', { count: 'exact' })
      .eq('status', 'approved')
      .gte('expires_at', new Date().toISOString())

    if (appliance) {
      query = query.contains('appliance_types', [appliance])
    }

    if (discount) {
      query = query.eq('discount_type', discount)
    }

    if (sort === 'expiring') {
      query = query.order('expires_at', { ascending: true })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    query = query.limit(50)

    const { data, count, error } = await query

    if (error) {
      console.error('Error fetching deals:', error)
      return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 })
    }

    return NextResponse.json({
      deals: data || [],
      total: count || 0,
    })
  } catch (error) {
    console.error('Deals GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const formData: DealFormData = {
      title: body.title || '',
      description: body.description || '',
      companyName: body.companyName || '',
      email: body.email || '',
      phone: body.phone || '',
      discountType: body.discountType || '',
      discountValue: body.discountValue || '',
      applianceTypes: body.applianceTypes || [],
      expiresAt: body.expiresAt || '',
    }

    // Validate
    const result = validateDealSubmission(formData)
    if (!result.valid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: result.errors },
        { status: 400 }
      )
    }

    // Run text moderation
    const textContent = [formData.title, formData.description].filter(Boolean).join('\n\n')
    const moderation = await moderateText(textContent)

    const status = moderation.flagged ? 'pending_review' : 'pending_verification'

    // Generate verification code
    const code = generateCode()
    const codeHash = hashCode(code)
    const verificationExpiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Parse discount value
    const discountValue =
      formData.discountType === 'free_diagnostic'
        ? null
        : parseFloat(formData.discountValue) || null

    // Insert deal into database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseAdmin as any)
      .from('repair_deals')
      .insert({
        title: formData.title.trim(),
        description: formData.description.trim(),
        company_name: formData.companyName.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || null,
        discount_type: formData.discountType,
        discount_value: discountValue,
        appliance_types: formData.applianceTypes,
        expires_at: new Date(formData.expiresAt).toISOString(),
        status,
        verification_code_hash: codeHash,
        verification_expires_at: verificationExpiresAt.toISOString(),
        moderation_flagged: moderation.flagged,
        moderation_categories: moderation.categories,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error creating deal:', error)
      return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 })
    }

    // TODO: Send verification email with code
    // For now, log the code in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Deals] Verification code for ${formData.email}: ${code}`)
    }

    return NextResponse.json({
      success: true,
      dealId: data.id,
      email: formData.email,
      message: `Verification code sent to ${formData.email}`,
    })
  } catch (error) {
    console.error('Deal submission error:', error)
    return NextResponse.json({ error: 'Failed to submit deal' }, { status: 500 })
  }
}
