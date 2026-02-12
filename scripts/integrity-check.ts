#!/usr/bin/env npx tsx
/**
 * Data Integrity Check Script
 *
 * Checks for data quality issues in the repair_companies, cities, and states tables:
 * 1. Orphaned repair_companies (city_id not in cities table)
 * 2. Orphaned cities (state_id not in states table)
 * 3. Cities with store_count mismatch
 * 4. States with store_count / city_count mismatch
 * 5. Repair companies with missing required fields
 *
 * Usage:
 *   npx tsx scripts/integrity-check.ts
 */

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'

// =============================================================================
// Supabase client (self-contained, no Next.js imports)
// =============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// =============================================================================
// Types
// =============================================================================

interface Issue {
  check: string
  severity: 'error' | 'warning'
  message: string
  ids?: number[]
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  console.log('='.repeat(60))
  console.log('Data Integrity Check')
  console.log('='.repeat(60))
  console.log()

  const issues: Issue[] = []

  // =========================================================================
  // 1. Orphaned repair_companies (city_id not in cities)
  // =========================================================================
  console.log('Check 1: Orphaned repair companies (invalid city_id)...')

  // Fetch all city IDs
  const { data: cityRows, error: cityError } = await supabase
    .from('cities')
    .select('id')

  if (cityError) {
    console.error('  Failed to fetch cities:', cityError.message)
    process.exit(1)
  }

  const validCityIds = new Set((cityRows ?? []).map((c) => c.id))

  // Fetch all repair_companies with city_id
  const PAGE_SIZE = 1000
  const orphanedCompanies: number[] = []
  let offset = 0
  let hasMore = true

  while (hasMore) {
    const { data: companies, error: companyError } = await supabase
      .from('repair_companies')
      .select('id, city_id')
      .not('city_id', 'is', null)
      .order('id')
      .range(offset, offset + PAGE_SIZE - 1)

    if (companyError) {
      console.error('  Failed to fetch repair companies:', companyError.message)
      process.exit(1)
    }

    if (companies && companies.length > 0) {
      for (const company of companies) {
        if (company.city_id && !validCityIds.has(company.city_id)) {
          orphanedCompanies.push(company.id)
        }
      }
      offset += PAGE_SIZE
      hasMore = companies.length === PAGE_SIZE
    } else {
      hasMore = false
    }
  }

  if (orphanedCompanies.length > 0) {
    issues.push({
      check: 'Orphaned repair_companies (invalid city_id)',
      severity: 'error',
      message: `${orphanedCompanies.length} companies have city_id not in cities table`,
      ids: orphanedCompanies.slice(0, 20),
    })
    console.log(`  FAIL: ${orphanedCompanies.length} orphaned companies`)
  } else {
    console.log('  PASS')
  }

  // =========================================================================
  // 2. Orphaned cities (state_id not in states)
  // =========================================================================
  console.log('Check 2: Orphaned cities (invalid state_id)...')

  const { data: stateRows, error: stateError } = await supabase
    .from('states')
    .select('id')

  if (stateError) {
    console.error('  Failed to fetch states:', stateError.message)
    process.exit(1)
  }

  const validStateIds = new Set((stateRows ?? []).map((s) => s.id))

  const { data: allCities, error: allCitiesError } = await supabase
    .from('cities')
    .select('id, name, state_id')

  if (allCitiesError) {
    console.error('  Failed to fetch cities:', allCitiesError.message)
    process.exit(1)
  }

  const orphanedCities: { id: number; name: string; state_id: number }[] = []
  for (const city of allCities ?? []) {
    if (!validStateIds.has(city.state_id)) {
      orphanedCities.push(city)
    }
  }

  if (orphanedCities.length > 0) {
    issues.push({
      check: 'Orphaned cities (invalid state_id)',
      severity: 'error',
      message: `${orphanedCities.length} cities have state_id not in states table`,
      ids: orphanedCities.slice(0, 20).map((c) => c.id),
    })
    console.log(`  FAIL: ${orphanedCities.length} orphaned cities`)
    for (const city of orphanedCities.slice(0, 5)) {
      console.log(`    [${city.id}] ${city.name} (state_id=${city.state_id})`)
    }
  } else {
    console.log('  PASS')
  }

  // =========================================================================
  // 3. Cities with store_count mismatch
  // =========================================================================
  console.log('Check 3: City store_count accuracy...')

  const cityMismatches: { id: number; name: string; recorded: number; actual: number }[] = []

  for (const city of allCities ?? []) {
    const { count, error: countError } = await supabase
      .from('repair_companies')
      .select('*', { count: 'exact', head: true })
      .eq('city_id', city.id)
      .eq('is_approved', true)

    if (countError) {
      console.error(`  Error counting for city ${city.name}:`, countError.message)
      continue
    }

    const actualCount = count ?? 0
    const cityFull = city as any

    if (actualCount !== (cityFull.store_count ?? 0)) {
      cityMismatches.push({
        id: city.id,
        name: city.name,
        recorded: cityFull.store_count ?? 0,
        actual: actualCount,
      })
    }
  }

  if (cityMismatches.length > 0) {
    issues.push({
      check: 'City store_count mismatch',
      severity: 'warning',
      message: `${cityMismatches.length} cities have incorrect store_count`,
      ids: cityMismatches.slice(0, 20).map((c) => c.id),
    })
    console.log(`  FAIL: ${cityMismatches.length} cities with mismatched store_count`)
    for (const city of cityMismatches.slice(0, 5)) {
      console.log(`    [${city.id}] ${city.name}: recorded=${city.recorded}, actual=${city.actual}`)
    }
  } else {
    console.log('  PASS')
  }

  // =========================================================================
  // 4. States with store_count / city_count mismatch
  // =========================================================================
  console.log('Check 4: State store_count and city_count accuracy...')

  const { data: allStates, error: allStatesError } = await supabase
    .from('states')
    .select('id, name, store_count, city_count')

  if (allStatesError) {
    console.error('  Failed to fetch states:', allStatesError.message)
    process.exit(1)
  }

  const stateMismatches: { id: number; name: string; field: string; recorded: number; actual: number }[] = []

  for (const state of allStates ?? []) {
    // Check store_count
    const { count: storeCount, error: storeError } = await supabase
      .from('repair_companies')
      .select('*', { count: 'exact', head: true })
      .eq('state_id', state.id)
      .eq('is_approved', true)

    if (storeError) {
      console.error(`  Error counting stores for state ${state.name}:`, storeError.message)
      continue
    }

    const actualStoreCount = storeCount ?? 0
    if (actualStoreCount !== (state.store_count ?? 0)) {
      stateMismatches.push({
        id: state.id,
        name: state.name,
        field: 'store_count',
        recorded: state.store_count ?? 0,
        actual: actualStoreCount,
      })
    }

    // Check city_count (cities with store_count > 0)
    const { count: cityCount, error: cityCountError } = await supabase
      .from('cities')
      .select('*', { count: 'exact', head: true })
      .eq('state_id', state.id)
      .gt('store_count', 0)

    if (cityCountError) {
      console.error(`  Error counting cities for state ${state.name}:`, cityCountError.message)
      continue
    }

    const actualCityCount = cityCount ?? 0
    if (actualCityCount !== (state.city_count ?? 0)) {
      stateMismatches.push({
        id: state.id,
        name: state.name,
        field: 'city_count',
        recorded: state.city_count ?? 0,
        actual: actualCityCount,
      })
    }
  }

  if (stateMismatches.length > 0) {
    issues.push({
      check: 'State count mismatch',
      severity: 'warning',
      message: `${stateMismatches.length} state count mismatches`,
      ids: [...new Set(stateMismatches.map((s) => s.id))],
    })
    console.log(`  FAIL: ${stateMismatches.length} state count mismatches`)
    for (const mismatch of stateMismatches.slice(0, 10)) {
      console.log(`    [${mismatch.id}] ${mismatch.name} ${mismatch.field}: recorded=${mismatch.recorded}, actual=${mismatch.actual}`)
    }
  } else {
    console.log('  PASS')
  }

  // =========================================================================
  // 5. Repair companies with missing required fields
  // =========================================================================
  console.log('Check 5: Repair companies with missing required fields...')

  const missingFields: { field: string; count: number; sampleIds: number[] }[] = []

  // Check for missing name
  const { count: missingName, error: nameError } = await supabase
    .from('repair_companies')
    .select('*', { count: 'exact', head: true })
    .or('name.is.null,name.eq.')

  if (!nameError && (missingName ?? 0) > 0) {
    const { data: samples } = await supabase
      .from('repair_companies')
      .select('id')
      .or('name.is.null,name.eq.')
      .limit(10)
    missingFields.push({
      field: 'name',
      count: missingName!,
      sampleIds: (samples ?? []).map((s) => s.id),
    })
  }

  // Check for missing city_id
  const { count: missingCity, error: cityIdError } = await supabase
    .from('repair_companies')
    .select('*', { count: 'exact', head: true })
    .is('city_id', null)

  if (!cityIdError && (missingCity ?? 0) > 0) {
    const { data: samples } = await supabase
      .from('repair_companies')
      .select('id')
      .is('city_id', null)
      .limit(10)
    missingFields.push({
      field: 'city_id',
      count: missingCity!,
      sampleIds: (samples ?? []).map((s) => s.id),
    })
  }

  // Check for missing state_id
  const { count: missingState, error: stateIdError } = await supabase
    .from('repair_companies')
    .select('*', { count: 'exact', head: true })
    .is('state_id', null)

  if (!stateIdError && (missingState ?? 0) > 0) {
    const { data: samples } = await supabase
      .from('repair_companies')
      .select('id')
      .is('state_id', null)
      .limit(10)
    missingFields.push({
      field: 'state_id',
      count: missingState!,
      sampleIds: (samples ?? []).map((s) => s.id),
    })
  }

  // Check for missing slug
  const { count: missingSlug, error: slugError } = await supabase
    .from('repair_companies')
    .select('*', { count: 'exact', head: true })
    .or('slug.is.null,slug.eq.')

  if (!slugError && (missingSlug ?? 0) > 0) {
    const { data: samples } = await supabase
      .from('repair_companies')
      .select('id')
      .or('slug.is.null,slug.eq.')
      .limit(10)
    missingFields.push({
      field: 'slug',
      count: missingSlug!,
      sampleIds: (samples ?? []).map((s) => s.id),
    })
  }

  // Check for missing address
  const { count: missingAddress, error: addressError } = await supabase
    .from('repair_companies')
    .select('*', { count: 'exact', head: true })
    .is('address', null)

  if (!addressError && (missingAddress ?? 0) > 0) {
    const { data: samples } = await supabase
      .from('repair_companies')
      .select('id')
      .is('address', null)
      .limit(10)
    missingFields.push({
      field: 'address',
      count: missingAddress!,
      sampleIds: (samples ?? []).map((s) => s.id),
    })
  }

  // Check for missing phone
  const { count: missingPhone, error: phoneError } = await supabase
    .from('repair_companies')
    .select('*', { count: 'exact', head: true })
    .is('phone', null)

  if (!phoneError && (missingPhone ?? 0) > 0) {
    missingFields.push({
      field: 'phone',
      count: missingPhone!,
      sampleIds: [],
    })
  }

  if (missingFields.length > 0) {
    for (const mf of missingFields) {
      const severity = ['name', 'city_id', 'state_id', 'slug'].includes(mf.field) ? 'error' : 'warning'
      issues.push({
        check: `Missing ${mf.field}`,
        severity,
        message: `${mf.count} repair companies missing ${mf.field}`,
        ids: mf.sampleIds,
      })
      console.log(`  ${severity === 'error' ? 'FAIL' : 'WARN'}: ${mf.count} missing ${mf.field}`)
      if (mf.sampleIds.length > 0) {
        console.log(`    Sample IDs: ${mf.sampleIds.join(', ')}`)
      }
    }
  } else {
    console.log('  PASS')
  }

  // =========================================================================
  // Final Summary
  // =========================================================================
  console.log()
  console.log('='.repeat(60))
  console.log('Integrity Check Summary')
  console.log('='.repeat(60))

  const errors = issues.filter((i) => i.severity === 'error')
  const warnings = issues.filter((i) => i.severity === 'warning')

  if (issues.length === 0) {
    console.log('All checks passed! No issues found.')
  } else {
    console.log(`Errors:   ${errors.length}`)
    console.log(`Warnings: ${warnings.length}`)
    console.log()

    if (errors.length > 0) {
      console.log('ERRORS:')
      for (const issue of errors) {
        console.log(`  - ${issue.check}: ${issue.message}`)
      }
    }

    if (warnings.length > 0) {
      console.log('WARNINGS:')
      for (const issue of warnings) {
        console.log(`  - ${issue.check}: ${issue.message}`)
      }
    }
  }

  // Exit with error code if there are errors
  if (errors.length > 0) {
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
