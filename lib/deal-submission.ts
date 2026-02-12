/**
 * Deal Submission Validation
 *
 * Validates deal form data before submission.
 */

export interface DealFormData {
  title: string
  description: string
  companyName: string
  email: string
  phone: string
  discountType: 'percentage' | 'flat' | 'free_diagnostic' | ''
  discountValue: string
  applianceTypes: string[]
  expiresAt: string
}

export const APPLIANCE_TYPES = [
  'Refrigerator',
  'Washer',
  'Dryer',
  'Dishwasher',
  'Oven/Range',
  'Microwave',
  'Freezer',
  'Garbage Disposal',
  'Ice Maker',
  'Wine Cooler',
] as const

export type ApplianceType = (typeof APPLIANCE_TYPES)[number]

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

export function validateDealSubmission(data: DealFormData): ValidationResult {
  const errors: Record<string, string> = {}

  // Title
  if (!data.title?.trim()) {
    errors.title = 'Deal title is required'
  } else if (data.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters'
  } else if (data.title.trim().length > 120) {
    errors.title = 'Title must be under 120 characters'
  }

  // Description
  if (!data.description?.trim()) {
    errors.description = 'Description is required'
  } else if (data.description.trim().length < 20) {
    errors.description = 'Description must be at least 20 characters'
  } else if (data.description.trim().length > 1000) {
    errors.description = 'Description must be under 1000 characters'
  }

  // Company name
  if (!data.companyName?.trim()) {
    errors.companyName = 'Company name is required'
  }

  // Email
  if (!data.email?.trim()) {
    errors.email = 'Email is required'
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email.trim())) {
      errors.email = 'Please enter a valid email address'
    }
  }

  // Discount type
  if (!data.discountType) {
    errors.discountType = 'Discount type is required'
  }

  // Discount value (required for percentage and flat, not for free_diagnostic)
  if (data.discountType === 'percentage' || data.discountType === 'flat') {
    if (!data.discountValue?.trim()) {
      errors.discountValue = 'Discount value is required'
    } else {
      const val = parseFloat(data.discountValue)
      if (isNaN(val) || val <= 0) {
        errors.discountValue = 'Please enter a valid discount amount'
      }
      if (data.discountType === 'percentage' && val > 100) {
        errors.discountValue = 'Percentage cannot exceed 100%'
      }
    }
  }

  // Appliance types
  if (!data.applianceTypes || data.applianceTypes.length === 0) {
    errors.applianceTypes = 'Select at least one appliance type'
  }

  // Expiry date
  if (!data.expiresAt) {
    errors.expiresAt = 'Expiration date is required'
  } else {
    const expiryDate = new Date(data.expiresAt)
    if (expiryDate <= new Date()) {
      errors.expiresAt = 'Expiration date must be in the future'
    }
  }

  return { valid: Object.keys(errors).length === 0, errors }
}
