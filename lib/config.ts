/**
 * Application Configuration
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://appliancetechfinder.com'

export const SITE_NAME = 'Appliance Tech Finder'

export const DEFAULT_DESCRIPTION =
  'Find appliance repair companies near you. Browse local repair services for refrigerators, washers, dryers, dishwashers, and more.'

// PARITY_MODE
export const PARITY_MODE = true

// Feature Flags
export const ENABLE_DEALS = process.env.NEXT_PUBLIC_ENABLE_DEALS === 'true'
export const ENABLE_CHAT = process.env.NEXT_PUBLIC_ENABLE_CHAT === 'true'
export const ENABLE_SUBMISSIONS = process.env.NEXT_PUBLIC_ENABLE_SUBMISSIONS === 'true'
