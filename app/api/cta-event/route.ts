/**
 * CTA Event API Route
 *
 * Receives CTA events from client-side tracker and persists to cta_events table.
 * Rate limited via Postgres RPC (durable, survives deploys/scaling).
 *
 * Internal API route - no authentication required for event tracking.
 * Events are fire-and-forget from the client perspective.
 */

import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase/admin'

/**
 * Hash IP address for privacy-preserving rate limiting
 */
function hashIP(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').substring(0, 32)
}

/**
 * Extract client IP from request headers
 */
function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  return 'unknown'
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const { companyId, eventType, sourcePage } = body as {
      companyId?: number
      eventType?: string
      sourcePage?: string
    }

    if (!companyId || !eventType || !sourcePage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate event type
    if (!['call', 'directions', 'website'].includes(eventType)) {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      )
    }

    // Validate company exists
    const { count } = await supabaseAdmin
      .from('repair_companies')
      .select('*', { count: 'exact', head: true })
      .eq('id', companyId)

    if (!count || count === 0) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Rate limit check (durable, Postgres-based)
    const clientIP = getClientIP(request)
    const ipHash = hashIP(clientIP)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rateLimitResult } = await (supabaseAdmin as any)
      .rpc('check_cta_rate_limit', {
        p_ip_hash: ipHash,
        p_store_id: companyId,
        p_window_minutes: 1,
        p_max_events: 60,
      })

    if (rateLimitResult === false) {
      return NextResponse.json(
        { error: 'Rate limited' },
        { status: 429 }
      )
    }

    // Insert event
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabaseAdmin as any)
      .from('cta_events')
      .insert({
        store_id: companyId,
        event_type: eventType,
        source_page: sourcePage,
        ip_hash: ipHash,
      })

    if (insertError) {
      console.error('CTA event insert error:', insertError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('CTA event error:', error)
    // Return success anyway - event tracking should not block user experience
    return NextResponse.json({ success: true })
  }
}
