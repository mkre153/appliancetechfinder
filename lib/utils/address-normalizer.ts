/**
 * Address Normalization Utilities
 *
 * Deterministic address normalization for deduplication.
 * Creates consistent representations from varied address formats.
 */

import { createHash } from 'crypto'

/**
 * Normalize an address string for consistent comparison
 *
 * Transformations:
 * - Lowercase
 * - Remove punctuation
 * - Strip ZIP codes (including doubled patterns like "02903 02903")
 * - Extract and PRESERVE 2-letter state code (appended at end)
 * - Strip full state names (converted to 2-letter code)
 * - Normalize street suffixes (Street -> st, Avenue -> av, etc.)
 * - Normalize directional prefixes (North -> n, South -> s, etc.)
 * - Remove unit/suite numbers
 * - Remove common noise ("USA", trailing commas)
 * - Collapse whitespace and title case
 */
export function normalizeAddress(address: string): string {
  if (!address) return ''

  const stateNameToCode: Record<string, string> = {
    alabama: 'al',
    alaska: 'ak',
    arizona: 'az',
    arkansas: 'ar',
    california: 'ca',
    colorado: 'co',
    connecticut: 'ct',
    delaware: 'de',
    florida: 'fl',
    georgia: 'ga',
    hawaii: 'hi',
    idaho: 'id',
    illinois: 'il',
    indiana: 'in',
    iowa: 'ia',
    kansas: 'ks',
    kentucky: 'ky',
    louisiana: 'la',
    maine: 'me',
    maryland: 'md',
    massachusetts: 'ma',
    michigan: 'mi',
    minnesota: 'mn',
    mississippi: 'ms',
    missouri: 'mo',
    montana: 'mt',
    nebraska: 'ne',
    nevada: 'nv',
    'new hampshire': 'nh',
    'new jersey': 'nj',
    'new mexico': 'nm',
    'new york': 'ny',
    'north carolina': 'nc',
    'north dakota': 'nd',
    ohio: 'oh',
    oklahoma: 'ok',
    oregon: 'or',
    pennsylvania: 'pa',
    'rhode island': 'ri',
    'south carolina': 'sc',
    'south dakota': 'sd',
    tennessee: 'tn',
    texas: 'tx',
    utah: 'ut',
    vermont: 'vt',
    virginia: 'va',
    washington: 'wa',
    'west virginia': 'wv',
    wisconsin: 'wi',
    wyoming: 'wy',
    'district of columbia': 'dc',
  }

  const stateCodes = new Set([
    'al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'dc', 'fl',
    'ga', 'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky', 'la', 'me',
    'md', 'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh',
    'nj', 'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 'or', 'pa', 'ri',
    'sc', 'sd', 'tn', 'tx', 'ut', 'vt', 'va', 'wa', 'wv', 'wi',
    'wy',
  ])

  let normalized = address.toLowerCase()

  // STEP 1: Extract state code BEFORE any stripping
  let extractedStateCode: string | null = null

  // Try to find 2-letter state code at end (before ZIP if present)
  const stateCodeMatch = normalized.match(
    /[,\s]+(al|ak|az|ar|ca|co|ct|de|dc|fl|ga|hi|id|il|in|ia|ks|ky|la|me|md|ma|mi|mn|ms|mo|mt|ne|nv|nh|nj|nm|ny|nc|nd|oh|ok|or|pa|ri|sc|sd|tn|tx|ut|vt|va|wa|wv|wi|wy)(?:\s+\d{5})?(?:[-\s]*\d{4})?\s*$/i
  )
  if (stateCodeMatch) {
    extractedStateCode = stateCodeMatch[1].toLowerCase()
  }

  // If no 2-letter code found, try full state names at END of address only
  if (!extractedStateCode) {
    const stateNamePattern =
      /,\s*(alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new\s+hampshire|new\s+jersey|new\s+mexico|new\s+york|north\s+carolina|north\s+dakota|ohio|oklahoma|oregon|pennsylvania|rhode\s+island|south\s+carolina|south\s+dakota|tennessee|texas|utah|vermont|virginia|washington|west\s+virginia|wisconsin|wyoming|district\s+of\s+columbia)(?:,?\s*\d{5})?(?:[-\s]*\d{4})?\s*$/i
    const fullNameMatch = normalized.match(stateNamePattern)
    if (fullNameMatch) {
      const matchedState = fullNameMatch[1].toLowerCase().replace(/\s+/g, ' ')
      extractedStateCode = stateNameToCode[matchedState] || null
    }
  }

  // STEP 2: Perform normalization
  normalized = normalized
    // Remove common noise words
    .replace(/\b(usa|united\s+states)\b/gi, '')

    // Remove punctuation
    .replace(/[^\w\s]/g, ' ')

    // Strip doubled ZIP codes (e.g., "02903 02903")
    .replace(/\b(\d{5})\s+\1\s*$/g, '')

    // Strip ZIP codes at end of address only
    .replace(/\s+\d{5}(?:[-\s]*\d{4})?\s*$/g, '')

    // Strip full state names at end
    .replace(
      /(\s)(alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new\s+hampshire|new\s+jersey|new\s+mexico|new\s+york|north\s+carolina|north\s+dakota|ohio|oklahoma|oregon|pennsylvania|rhode\s+island|south\s+carolina|south\s+dakota|tennessee|texas|utah|vermont|virginia|washington|west\s+virginia|wisconsin|wyoming|district\s+of\s+columbia)\s*$/gi,
      ''
    )

    // Strip 2-letter state codes at end
    .replace(/\b(al|ak|az|ar|ca|co|ct|de|dc|fl|ga|hi|id|il|in|ia|ks|ky|la|me|md|ma|mi|mn|ms|mo|mt|ne|nv|nh|nj|nm|ny|nc|nd|oh|ok|or|pa|ri|sc|sd|tn|tx|ut|vt|va|wa|wv|wi|wy)\s*$/g, '')

    // Street suffixes
    .replace(/\b(street|str)\b/g, 'st')
    .replace(/\b(avenue|ave)\b/g, 'av')
    .replace(/\b(boulevard|blvd)\b/g, 'bl')
    .replace(/\b(highway|hwy)\b/g, 'hw')
    .replace(/\bfreeway\b/g, 'fwy')
    .replace(/\b(drive|dr)\b/g, 'dr')
    .replace(/\b(road|rd)\b/g, 'rd')
    .replace(/\b(lane|ln)\b/g, 'ln')
    .replace(/\b(court|ct)\b/g, 'ct')
    .replace(/\b(circle|cir)\b/g, 'cir')
    .replace(/\b(place|pl)\b/g, 'pl')
    .replace(/\b(terrace|ter)\b/g, 'ter')
    .replace(/\b(parkway|pkwy)\b/g, 'pkwy')
    .replace(/\b(way)\b/g, 'wy')
    .replace(/\b(suite|ste)\b/g, 'ste')
    .replace(/\b(apartment|apt)\b/g, 'apt')

    // Directional prefixes/suffixes
    .replace(/\bnorth\b/g, 'n')
    .replace(/\bsouth\b/g, 's')
    .replace(/\beast\b/g, 'e')
    .replace(/\bwest\b/g, 'w')
    .replace(/\bnortheast\b/g, 'ne')
    .replace(/\bnorthwest\b/g, 'nw')
    .replace(/\bsoutheast\b/g, 'se')
    .replace(/\bsouthwest\b/g, 'sw')

    // Remove unit/suite designations
    .replace(/\b(ste|unit|apt|apartment|#|bldg|building|floor|fl)\s*\w*\b/g, '')

    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim()

  // STEP 3: Append state code at end (critical for cross-state uniqueness)
  if (extractedStateCode && stateCodes.has(extractedStateCode)) {
    normalized = `${normalized} ${extractedStateCode}`
  }

  return normalized
}

/**
 * Create a hash of a normalized address
 *
 * Uses first 16 chars of SHA256 for reasonable uniqueness
 * while keeping the column size manageable.
 */
export function hashAddress(address: string): string {
  const normalized = normalizeAddress(address)
  if (!normalized) return ''

  return createHash('sha256').update(normalized).digest('hex').slice(0, 16)
}

/**
 * Normalize a phone number to E.164 format
 *
 * Handles US phone numbers:
 * - 10 digits -> +1XXXXXXXXXX
 * - 11 digits starting with 1 -> +1XXXXXXXXXX
 *
 * Returns null if phone can't be normalized (international, invalid length)
 */
export function normalizePhone(phone: string | null | undefined): string | null {
  if (!phone) return null

  const digits = phone.replace(/\D/g, '')

  if (digits.length === 10) {
    return `+1${digits}`
  }

  if (digits.length === 11 && digits[0] === '1') {
    return `+${digits}`
  }

  return null
}

/**
 * Normalize a business name for fuzzy matching
 *
 * Used for soft-match duplicate detection (not hard constraints).
 */
export function normalizeBusinessName(name: string): string {
  if (!name) return ''

  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\b(llc|inc|corp|corporation|company|co|ltd|limited)\b/g, '') // Remove business suffixes
    .replace(/\b(the|a|an)\b/g, '') // Remove articles
    .replace(/\b(appliance|repair|service|services|tech|technician|technicians)\b/g, '') // Remove industry terms
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Extract US ZIP code from an address string
 *
 * Returns null if no valid ZIP found.
 */
export function extractZipFromAddress(address: string | null | undefined): string | null {
  if (!address) return null

  const zipPattern = /\b(\d{5})(?:-\d{4})?\s*(?:,?\s*(?:USA?|United States)?)?$/i

  const match = address.match(zipPattern)
  if (match) {
    const zip = match[1]
    const zipNum = parseInt(zip, 10)
    if (zipNum >= 501 && zipNum <= 99950) {
      return zip
    }
  }

  return null
}
