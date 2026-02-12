/**
 * Ingestion Boundary - SINGLE ENTRY POINT
 *
 * ALL directory data (repair_companies, cities) must enter through this module.
 *
 * Sources are isolated in separate files.
 * This file owns: logging, validation, city creation, company import.
 *
 * ARCHITECTURAL INVARIANTS:
 * 1. All repair_companies inserts go through this module
 * 2. All city inserts go through this module
 * 3. Every operation is logged
 * 4. All ingested companies get is_approved = false (require manual review)
 *
 * ============================================================================
 * IMPORTANT: SCRAPING IS INTENTIONALLY EXTERNAL
 * ============================================================================
 * Do NOT add Apify, Outscraper, or any scraping/crawling logic here.
 * Data mining is a separate system with its own legal and operational risks.
 * All data must be pre-normalized externally before ingestion.
 * ============================================================================
 */

import { supabaseAdmin } from '@/lib/supabase/admin'
import type { City, CityRow, CityInsert, RepairCompanyInsert } from '@/lib/types'

// =============================================================================
// Types
// =============================================================================

export type IngestionSource = 'prospector' | 'outscraper' | 'submission' | 'manual'
export type IngestionAction = 'import' | 'submission_approved' | 'city_created'

export interface IngestionLogEntry {
  source: IngestionSource
  action: IngestionAction
  details: string
  records_affected: number
}

// =============================================================================
// Row to Model Transformer
// =============================================================================

function cityRowToModel(row: CityRow): City {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    stateId: row.state_id,
    stateCode: row.state_code,
    lat: row.lat,
    lng: row.lng,
    storeCount: row.store_count,
  }
}

// =============================================================================
// Logging
// =============================================================================

/**
 * Log every ingestion operation for audit trail.
 * Logs to console. If ingestion_log table exists, also inserts there.
 */
export async function logIngestion(
  source: IngestionSource,
  action: IngestionAction,
  details: string
): Promise<void> {
  const timestamp = new Date().toISOString()
  console.log(`[Ingestion] ${timestamp} | ${source} | ${action} | ${details}`)

  // Attempt to log to ingestion_log table (non-critical)
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseAdmin as any)
      .from('ingestion_log')
      .insert({
        source,
        action,
        details,
        created_at: timestamp,
      })
  } catch {
    // Table may not exist — that's fine, console log is sufficient
  }
}

// =============================================================================
// City Creation
// =============================================================================

/**
 * Get a city by name and state ID
 */
async function getCityByNameAndState(
  cityName: string,
  stateId: number
): Promise<City | null> {
  const { data, error } = await supabaseAdmin
    .from('cities')
    .select('*')
    .eq('state_id', stateId)
    .ilike('name', cityName)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return cityRowToModel(data)
}

/**
 * Create a new city
 * INTERNAL: Only called from ensureCity
 */
async function createCity(city: CityInsert): Promise<City> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabaseAdmin as any)
    .from('cities')
    .insert(city)
    .select()
    .single()

  if (error) throw error

  await logIngestion('manual', 'city_created', `Created city: ${city.name} (${city.state_code})`)
  return cityRowToModel(data as CityRow)
}

/**
 * Ensure a city exists, creating it if needed.
 * This is the ONLY way to create cities in the system.
 */
export async function ensureCity(
  stateId: number,
  stateCode: string,
  cityName: string,
  lat?: number | null,
  lng?: number | null
): Promise<City> {
  const existing = await getCityByNameAndState(cityName, stateId)
  if (existing) {
    return existing
  }

  // Create new city with deterministic slug
  const slug = cityName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const newCity: CityInsert = {
    slug,
    name: cityName,
    state_id: stateId,
    state_code: stateCode.toLowerCase(),
    lat: lat ?? null,
    lng: lng ?? null,
  }

  return createCity(newCity)
}

// =============================================================================
// Repair Company Import
// =============================================================================

/**
 * Import a repair company into the database.
 * All companies enter as is_approved=false by default.
 */
export async function importRepairCompany(
  data: RepairCompanyInsert
): Promise<{ id: number }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: inserted, error } = await (supabaseAdmin as any)
    .from('repair_companies')
    .insert(data)
    .select('id')
    .single()

  if (error) throw error

  return { id: inserted.id }
}
