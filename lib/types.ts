/**
 * Type definitions for Appliance Tech Finder
 */

// =============================================================================
// State
// =============================================================================

export interface StateRow {
  id: number
  slug: string
  name: string
  emoji: string
  gradient_color: string
  store_count: number
  city_count: number
  meta_description: string | null
  created_at: string
}

export interface State {
  id: number
  slug: string
  name: string
  emoji: string
  gradientColor: string
  storeCount: number
  cityCount: number
  metaDescription: string | null
}

// =============================================================================
// City
// =============================================================================

export interface CityRow {
  id: number
  slug: string
  name: string
  state_id: number
  state_code: string
  lat: number | null
  lng: number | null
  store_count: number
  created_at: string
}

export interface City {
  id: number
  slug: string
  name: string
  stateId: number
  stateCode: string
  lat: number | null
  lng: number | null
  storeCount: number
}

// =============================================================================
// Repair Company
// =============================================================================

export interface RepairCompanyRow {
  id: number
  name: string
  slug: string
  address: string | null
  city_id: number | null
  state_id: number | null
  zip: string | null
  phone: string | null
  website: string | null
  description: string | null
  services: string[] | null
  rating: number | null
  review_count: number | null
  lat: number | null
  lng: number | null
  is_approved: boolean
  created_at: string
  updated_at: string
}

export interface RepairCompany {
  id: number
  name: string
  slug: string
  address: string | null
  cityId: number | null
  stateId: number | null
  zip: string | null
  phone: string | null
  website: string | null
  description: string | null
  services: string[] | null
  rating: number | null
  reviewCount: number | null
  lat: number | null
  lng: number | null
  isApproved: boolean
}

// =============================================================================
// Database Types (for Supabase generic)
// =============================================================================

export type Database = {
  public: {
    Tables: {
      states: { Row: StateRow }
      cities: { Row: CityRow }
      repair_companies: { Row: RepairCompanyRow }
    }
  }
}
