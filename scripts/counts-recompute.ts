#!/usr/bin/env npx tsx
/**
 * Counts Recompute Script
 *
 * Recomputes store_count and city_count for all cities and states.
 * Uses is_approved=true repair_companies for counting.
 *
 * Usage:
 *   npx tsx scripts/counts-recompute.ts
 *   npx tsx scripts/counts-recompute.ts --dry-run
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
// Main
// =============================================================================

const isDryRun = process.argv.includes('--dry-run')

async function recomputeCounts(): Promise<void> {
  console.log('='.repeat(60))
  console.log('Recompute Store & City Counts')
  console.log('='.repeat(60))
  if (isDryRun) {
    console.log('(DRY RUN - no changes will be made)')
  }
  console.log()

  let cityUpdates = 0
  let stateStoreUpdates = 0
  let stateCityUpdates = 0

  // =========================================================================
  // Step 1: Recompute city.store_count
  // =========================================================================
  console.log('Step 1: Recomputing city store counts...')

  const { data: cities, error: citiesError } = await supabase
    .from('cities')
    .select('id, name, store_count')

  if (citiesError) {
    console.error('Failed to fetch cities:', citiesError.message)
    process.exit(1)
  }

  for (const city of cities ?? []) {
    // Count approved repair_companies in this city
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

    if (actualCount !== city.store_count) {
      console.log(`  City ${city.name}: ${city.store_count} -> ${actualCount}`)

      if (!isDryRun) {
        const { error: updateError } = await supabase
          .from('cities')
          .update({ store_count: actualCount })
          .eq('id', city.id)

        if (updateError) {
          console.error(`  Error updating city ${city.name}:`, updateError.message)
          continue
        }
      }
      cityUpdates++
    }
  }

  console.log(`  Updated ${cityUpdates} city store counts`)
  console.log()

  // =========================================================================
  // Step 2: Recompute state.store_count (sum of city store_counts)
  // =========================================================================
  console.log('Step 2: Recomputing state store counts...')

  const { data: states, error: statesError } = await supabase
    .from('states')
    .select('id, name, store_count, city_count')

  if (statesError) {
    console.error('Failed to fetch states:', statesError.message)
    process.exit(1)
  }

  for (const state of states ?? []) {
    // Count approved repair_companies in this state
    const { count: storeCount, error: storeCountError } = await supabase
      .from('repair_companies')
      .select('*', { count: 'exact', head: true })
      .eq('state_id', state.id)
      .eq('is_approved', true)

    if (storeCountError) {
      console.error(`  Error counting stores for state ${state.name}:`, storeCountError.message)
      continue
    }

    const actualStoreCount = storeCount ?? 0

    if (actualStoreCount !== state.store_count) {
      console.log(`  State ${state.name} stores: ${state.store_count} -> ${actualStoreCount}`)

      if (!isDryRun) {
        const { error: updateError } = await supabase
          .from('states')
          .update({ store_count: actualStoreCount })
          .eq('id', state.id)

        if (updateError) {
          console.error(`  Error updating state ${state.name} store_count:`, updateError.message)
          continue
        }
      }
      stateStoreUpdates++
    }
  }

  console.log(`  Updated ${stateStoreUpdates} state store counts`)
  console.log()

  // =========================================================================
  // Step 3: Recompute state.city_count (cities with store_count > 0)
  // =========================================================================
  console.log('Step 3: Recomputing state city counts...')

  for (const state of states ?? []) {
    // Count cities in this state that have at least 1 approved store
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

    if (actualCityCount !== state.city_count) {
      console.log(`  State ${state.name} cities: ${state.city_count} -> ${actualCityCount}`)

      if (!isDryRun) {
        const { error: updateError } = await supabase
          .from('states')
          .update({ city_count: actualCityCount })
          .eq('id', state.id)

        if (updateError) {
          console.error(`  Error updating state ${state.name} city_count:`, updateError.message)
          continue
        }
      }
      stateCityUpdates++
    }
  }

  console.log(`  Updated ${stateCityUpdates} state city counts`)
  console.log()

  // =========================================================================
  // Summary
  // =========================================================================
  console.log('='.repeat(60))
  console.log('Summary')
  console.log('='.repeat(60))
  console.log(`  City store_count updates:  ${cityUpdates}`)
  console.log(`  State store_count updates: ${stateStoreUpdates}`)
  console.log(`  State city_count updates:  ${stateCityUpdates}`)
  console.log('='.repeat(60))

  if (isDryRun) {
    console.log('\n(DRY RUN complete - no changes were made)')
  } else if (cityUpdates === 0 && stateStoreUpdates === 0 && stateCityUpdates === 0) {
    console.log('\nAll counts are already correct!')
  } else {
    console.log('\nCounts recomputed successfully.')
  }
}

recomputeCounts().catch((err) => {
  console.error('Counts recompute failed:', err)
  process.exit(1)
})
