/**
 * Repair Company Submission Validation
 *
 * Validates untrusted inbound submissions.
 * Does NOT create RepairCompany records.
 * Does NOT affect the directory.
 */

import type { RepairCompanySubmissionInsert } from '@/lib/types'

export interface SubmissionFormData {
  companyName: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  email: string
  website?: string
  services?: string
  description?: string
}

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
  data?: RepairCompanySubmissionInsert
}

/**
 * US States for dropdown
 */
export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
] as const

/**
 * Validate and normalize submission form data
 */
export function validateSubmission(data: SubmissionFormData): ValidationResult {
  const errors: Record<string, string> = {}

  // Required fields
  if (!data.companyName?.trim()) {
    errors.companyName = 'Company name is required'
  }

  if (!data.address?.trim()) {
    errors.address = 'Street address is required'
  }

  if (!data.city?.trim()) {
    errors.city = 'City is required'
  }

  if (!data.state?.trim()) {
    errors.state = 'State is required'
  } else {
    const validState = US_STATES.find(
      (s) => s.code === data.state.toUpperCase() || s.name.toLowerCase() === data.state.toLowerCase()
    )
    if (!validState) {
      errors.state = 'Please select a valid US state'
    }
  }

  if (!data.zip?.trim()) {
    errors.zip = 'ZIP code is required'
  } else {
    const zipRegex = /^\d{5}(-\d{4})?$/
    if (!zipRegex.test(data.zip.trim())) {
      errors.zip = 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'
    }
  }

  // Phone is required
  if (!data.phone?.trim()) {
    errors.phone = 'Phone number is required'
  } else {
    // Accept various phone formats
    const phoneDigits = data.phone.replace(/\D/g, '')
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      errors.phone = 'Please enter a valid phone number'
    }
  }

  // Email is required for verification
  if (!data.email?.trim()) {
    errors.email = 'Email is required'
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email.trim())) {
      errors.email = 'Please enter a valid email address'
    }
  }

  // Optional: validate website URL format if provided
  if (data.website?.trim()) {
    try {
      new URL(data.website)
    } catch {
      errors.website = 'Please enter a valid URL (e.g., https://example.com)'
    }
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors }
  }

  // Normalize and return
  const submission: RepairCompanySubmissionInsert = {
    company_name: data.companyName.trim(),
    address: data.address.trim(),
    city: data.city.trim(),
    state: data.state.toUpperCase(),
    zip: data.zip.trim(),
    phone: data.phone.trim(),
    email: data.email.trim(),
    website: data.website?.trim() || null,
    services: data.services?.trim() || null,
    description: data.description?.trim() || null,
    verification_code_hash: null,
    verification_expires_at: null,
  }

  return { valid: true, errors: {}, data: submission }
}
