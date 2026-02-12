#!/usr/bin/env npx tsx
/**
 * Merge Duplicate Repair Companies
 *
 * Takes a JSON file of duplicate pairs and merges them:
 * - Keeps the canonical record (keep_id)
 * - Fills null fields from the removed record
 * - Deletes the removed record
 * - Updates city/state counts afterward
 *
 * SAFE BY DEFAULT: Runs in dry-run mode unless --execute is passed.
 *
 * Usage:
 *   npx tsx scripts/merge-duplicates.ts duplicates.json
 *   npx tsx scripts/merge-duplicates.ts duplicates.json --execute
 *   npx tsx scripts/merge-duplicates.ts duplicates.json --dry-run
 *
 * JSON format:
 *   [
 *     { "keep_id": 1, "remove_id": 2 },
 *     { "keep_id": 3, "remove_id": 4 }
 *   ]
 *
 * Safety Features:
 *   - Dry-run by default (must pass --execute to make changes)
 *   - Validates all IDs exist before processing
 *   - Fills nulls from removed record into kept record
 *   - Deletes removed record
 *   - Reports all actions taken
 */

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

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

interface DuplicatePair {
  keep_id: number
  remove_id: number
}

interface MergeStats {
  pairsProcessed: number
  pairsSkipped: number
  fieldsFilled: number
  recordsDeleted: number
  errors: number
}

// Nullable fields that can be filled from the removed record
const FILLABLE_FIELDS = [
  'address',
  'phone',
  'website',
  'description',
  'zip',
  'lat',
  'lng',
  'rating',
  'review_count',
  'services',
  'google_place_id',
  'source',
] as const

// =============================================================================
// Main
// =============================================================================

async function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'))
  const flags = process.argv.slice(2).filter((a) => a.startsWith('--'))

  const execute = flags.includes('--execute')
  const dryRun = !execute

  if (args.length === 0) {
    console.error('Usage: npx tsx scripts/merge-duplicates.ts <duplicates.json> [--execute]')
    console.error('')
    console.error('JSON format: [{ "keep_id": 1, "remove_id": 2 }, ...]')
    process.exit(1)
  }

  const inputFile = args[0]

  if (!fs.existsSync(inputFile)) {
    console.error(`File not found: ${inputFile}`)
    process.exit(1)
  }

  let pairs: DuplicatePair[]
  try {
    const raw = fs.readFileSync(inputFile, 'utf-8')
    pairs = JSON.parse(raw)
  } catch (err) {
    console.error(`Failed to parse ${inputFile}:`, err)
    process.exit(1)
  }

  if (!Array.isArray(pairs) || pairs.length === 0) {
    console.error('Input must be a non-empty JSON array of { keep_id, remove_id } objects')
    process.exit(1)
  }

  // Validate structure
  for (const pair of pairs) {
    if (!pair.keep_id || !pair.remove_id) {
      console.error(`Invalid pair: ${JSON.stringify(pair)} — must have keep_id and remove_id`)
      process.exit(1)
    }
    if (pair.keep_id === pair.remove_id) {
      console.error(`Invalid pair: keep_id and remove_id are the same (${pair.keep_id})`)
      process.exit(1)
    }
  }

  console.log('='.repeat(60))
  console.log('Merge Duplicate Repair Companies')
  console.log('='.repeat(60))
  console.log(`Mode:   ${dryRun ? 'DRY RUN (no changes)' : 'LIVE EXECUTION'}`)
  console.log(`Input:  ${inputFile}`)
  console.log(`Pairs:  ${pairs.length}`)
  console.log('')

  if (!dryRun) {
    console.log('WARNING: This will modify the database!')
    console.log('Press Ctrl+C within 5 seconds to cancel...')
    await new Promise((resolve) => setTimeout(resolve, 5000))
    console.log('')
  }

  const stats: MergeStats = {
    pairsProcessed: 0,
    pairsSkipped: 0,
    fieldsFilled: 0,
    recordsDeleted: 0,
    errors: 0,
  }

  for (const pair of pairs) {
    console.log(`--- Pair: keep=${pair.keep_id}, remove=${pair.remove_id} ---`)

    try {
      // Fetch both records
      const { data: keepRecord, error: keepError } = await supabase
        .from('repair_companies')
        .select('*')
        .eq('id', pair.keep_id)
        .single()

      if (keepError || !keepRecord) {
        console.log(`  SKIP: keep_id=${pair.keep_id} not found`)
        stats.pairsSkipped++
        continue
      }

      const { data: removeRecord, error: removeError } = await supabase
        .from('repair_companies')
        .select('*')
        .eq('id', pair.remove_id)
        .single()

      if (removeError || !removeRecord) {
        console.log(`  SKIP: remove_id=${pair.remove_id} not found`)
        stats.pairsSkipped++
        continue
      }

      console.log(`  Keep:   [${keepRecord.id}] ${keepRecord.name}`)
      console.log(`  Remove: [${removeRecord.id}] ${removeRecord.name}`)

      // Build update payload: fill nulls from removed record
      const updates: Record<string, any> = {}
      for (const field of FILLABLE_FIELDS) {
        const keepVal = (keepRecord as any)[field]
        const removeVal = (removeRecord as any)[field]
        if ((keepVal === null || keepVal === undefined) && removeVal !== null && removeVal !== undefined) {
          updates[field] = removeVal
          console.log(`  Fill: ${field} = ${JSON.stringify(removeVal).substring(0, 60)}`)
          stats.fieldsFilled++
        }
      }

      if (dryRun) {
        console.log(`  [DRY RUN] Would update ${Object.keys(updates).length} field(s) and delete record ${pair.remove_id}`)
        stats.pairsProcessed++
        stats.recordsDeleted++
        console.log('')
        continue
      }

      // Apply updates to kept record
      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from('repair_companies')
          .update(updates)
          .eq('id', pair.keep_id)

        if (updateError) {
          throw new Error(`Failed to update keep_id=${pair.keep_id}: ${updateError.message}`)
        }
        console.log(`  Updated ${Object.keys(updates).length} field(s) on record ${pair.keep_id}`)
      }

      // Delete removed record
      const { error: deleteError } = await supabase
        .from('repair_companies')
        .delete()
        .eq('id', pair.remove_id)

      if (deleteError) {
        throw new Error(`Failed to delete remove_id=${pair.remove_id}: ${deleteError.message}`)
      }

      console.log(`  Deleted record ${pair.remove_id}`)
      stats.pairsProcessed++
      stats.recordsDeleted++
      console.log('')
    } catch (err) {
      console.error(`  ERROR: ${err}`)
      stats.errors++
    }
  }

  // =========================================================================
  // Summary
  // =========================================================================
  console.log('='.repeat(60))
  console.log('Summary')
  console.log('='.repeat(60))
  console.log(`Mode:              ${dryRun ? 'DRY RUN' : 'LIVE'}`)
  console.log(`Pairs processed:   ${stats.pairsProcessed}`)
  console.log(`Pairs skipped:     ${stats.pairsSkipped}`)
  console.log(`Fields filled:     ${stats.fieldsFilled}`)
  console.log(`Records deleted:   ${stats.recordsDeleted}`)
  console.log(`Errors:            ${stats.errors}`)

  if (dryRun) {
    console.log('\n[DRY RUN] No changes made. Use --execute to apply.')
  } else if (stats.errors === 0) {
    console.log('\nMerge complete! Run counts-recompute.ts to update city/state counts.')
  } else {
    console.log('\nMerge completed with errors. Review output above.')
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
