/**
 * Nearby Repair Companies API
 *
 * Phase 16: Returns repair companies near a given location.
 *
 * GET /api/stores/nearby?lat=40.7&lng=-73.9&radius=25&limit=10
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { haversineDistance, getBoundingBox } from '@/lib/utils/distance'
import type { RepairCompanyRow } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse and validate parameters
    const latStr = searchParams.get('lat')
    const lngStr = searchParams.get('lng')
    const radiusStr = searchParams.get('radius')
    const limitStr = searchParams.get('limit')

    if (!latStr || !lngStr) {
      return NextResponse.json(
        { error: 'Missing required parameters: lat and lng' },
        { status: 400 }
      )
    }

    const lat = parseFloat(latStr)
    const lng = parseFloat(lngStr)

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: 'Invalid lat/lng values' },
        { status: 400 }
      )
    }

    // Validate coordinate ranges
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { error: 'Coordinates out of valid range' },
        { status: 400 }
      )
    }

    // Parse optional parameters with defaults
    const radius = radiusStr ? Math.min(parseInt(radiusStr, 10), 100) : 25
    const limit = limitStr ? Math.min(parseInt(limitStr, 10), 50) : 10

    // Calculate bounding box for efficient pre-filtering
    const bbox = getBoundingBox(lat, lng, radius)

    // Query repair_companies within bounding box
    const { data: rows, error: dbError } = await supabaseAdmin
      .from('repair_companies')
      .select('*')
      .eq('is_approved', true)
      .not('lat', 'is', null)
      .not('lng', 'is', null)
      .gte('lat', bbox.minLat)
      .lte('lat', bbox.maxLat)
      .gte('lng', bbox.minLng)
      .lte('lng', bbox.maxLng)
      .limit(200) // Pre-filter limit before distance calculation

    if (dbError) {
      console.error('Supabase query error:', dbError)
      return NextResponse.json(
        { error: 'Database query failed' },
        { status: 500 }
      )
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json({
        companies: [],
        count: 0,
        params: { lat, lng, radius, limit },
      })
    }

    // Calculate exact haversine distance and filter by radius
    const companiesWithDistance = (rows as RepairCompanyRow[])
      .map((row) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        address: row.address,
        cityId: row.city_id,
        stateId: row.state_id,
        zip: row.zip,
        phone: row.phone,
        website: row.website,
        description: row.description,
        services: row.services,
        rating: row.rating,
        reviewCount: row.review_count,
        lat: row.lat,
        lng: row.lng,
        isApproved: row.is_approved,
        distance: haversineDistance(lat, lng, row.lat!, row.lng!),
      }))
      .filter((company) => company.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)

    return NextResponse.json({
      companies: companiesWithDistance,
      count: companiesWithDistance.length,
      params: { lat, lng, radius, limit },
    })
  } catch (error) {
    console.error('Nearby companies error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch nearby companies' },
      { status: 500 }
    )
  }
}
