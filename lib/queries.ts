/**
 * Data Access Layer
 *
 * All database queries go through this file.
 */

import { supabaseAdmin } from '@/lib/supabase/admin'
import type {
  State,
  StateRow,
  City,
  CityRow,
  RepairCompany,
  RepairCompanyRow,
} from '@/lib/types'

// =============================================================================
// Row to Model Transformers
// =============================================================================

function stateRowToModel(row: StateRow): State {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    emoji: row.emoji,
    gradientColor: row.gradient_color,
    storeCount: row.store_count,
    cityCount: row.city_count,
    metaDescription: row.meta_description,
  }
}

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

function repairCompanyRowToModel(row: RepairCompanyRow): RepairCompany {
  return {
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
  }
}

// =============================================================================
// State Queries
// =============================================================================

export async function getAllStates(): Promise<State[]> {
  const { data, error } = await supabaseAdmin
    .from('states')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return (data ?? []).map(stateRowToModel)
}

export async function getStateBySlug(slug: string): Promise<State | null> {
  const { data, error } = await supabaseAdmin
    .from('states')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return stateRowToModel(data)
}

// =============================================================================
// City Queries
// =============================================================================

export async function getCitiesByStateId(stateId: number): Promise<City[]> {
  const { data, error } = await supabaseAdmin
    .from('cities')
    .select('*')
    .eq('state_id', stateId)
    .order('store_count', { ascending: false })
    .order('name', { ascending: true })

  if (error) throw error
  return (data ?? []).map(cityRowToModel)
}

export async function getCityBySlug(
  stateSlug: string,
  citySlug: string
): Promise<City | null> {
  const { data, error } = await supabaseAdmin
    .from('cities')
    .select('*, states!inner(slug)')
    .eq('slug', citySlug)
    .eq('states.slug', stateSlug.toLowerCase())
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return cityRowToModel(data)
}

// =============================================================================
// Repair Company Queries
// =============================================================================

export async function getRepairCompaniesByCityId(
  cityId: number
): Promise<RepairCompany[]> {
  const { data, error } = await supabaseAdmin
    .from('repair_companies')
    .select('*')
    .eq('city_id', cityId)
    .eq('is_approved', true)
    .order('rating', { ascending: false, nullsFirst: false })
    .order('name', { ascending: true })

  if (error) throw error
  return (data ?? []).map(repairCompanyRowToModel)
}

export async function getRepairCompaniesByStateId(
  stateId: number
): Promise<RepairCompany[]> {
  const { data, error } = await supabaseAdmin
    .from('repair_companies')
    .select('*')
    .eq('state_id', stateId)
    .eq('is_approved', true)
    .order('name', { ascending: true })

  if (error) throw error
  return (data ?? []).map(repairCompanyRowToModel)
}

export async function getRepairCompanyCount(): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from('repair_companies')
    .select('*', { count: 'exact', head: true })
    .eq('is_approved', true)

  if (error) throw error
  return count ?? 0
}
