/**
 * ZIP Code Geocoder
 *
 * Phase 16: Static ZIP code validation and geocoding stub.
 *
 * ATF does not ship a zip centroids file. Format validation only.
 * Real geocoding comes from Supabase repair_companies data (lat/lng columns).
 */

export interface ZipCoordinates {
  lat: number
  lng: number
}

/**
 * Look up coordinates for a US ZIP code.
 *
 * ATF stub: Always returns null. Real geocoding comes from Supabase data.
 * If a centroids file is added later, this function will be updated to use it.
 *
 * @param zip - 5-digit ZIP code (e.g., "90210")
 * @returns Coordinates or null (always null in ATF — no centroids file)
 */
export function getZipCoordinates(zip: string): ZipCoordinates | null {
  // Normalize to 5 digits (strip +4 if present)
  const zip5 = zip.replace(/[^0-9]/g, '').slice(0, 5)

  if (zip5.length !== 5) {
    return null
  }

  // ATF: No static centroids file shipped.
  // Return null — real coordinates come from Supabase repair_companies.
  return null
}

/**
 * Validate ZIP code format.
 *
 * @param zip - ZIP code to validate
 * @returns true if valid 5-digit format
 */
export function isValidZip(zip: string): boolean {
  const zip5 = zip.replace(/[^0-9]/g, '').slice(0, 5)
  return zip5.length === 5
}
