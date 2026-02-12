/**
 * GoHighLevel Contact Operations
 *
 * Functions for creating, updating, and finding contacts in GHL.
 * Uses the upsert endpoint to prevent duplicates.
 *
 * Phase 12: Marketing — Contact & CRM
 */

import { ghlFetchWithRetry, getLocationId, isGHLConfigured } from './client'

// =============================================================================
// Types
// =============================================================================

interface GHLCustomField {
  key: string
  field_value: string
}

interface GHLContactInput {
  email: string
  phone?: string
  firstName?: string
  lastName?: string
  name?: string
  tags?: string[]
  source?: string
  customFields?: GHLCustomField[]
}

interface GHLUpsertContactRequest {
  locationId: string
  email: string
  phone?: string
  firstName?: string
  lastName?: string
  name?: string
  tags?: string[]
  source?: string
  customFields?: GHLCustomField[]
}

interface GHLContactResponse {
  contact: {
    id: string
    locationId: string
    email: string
    phone?: string
    firstName?: string
    lastName?: string
    name?: string
    tags?: string[]
    source?: string
  }
}

interface GHLSearchResponse {
  contacts: GHLContactResponse['contact'][]
}

type GHLResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

// =============================================================================
// Core Operations
// =============================================================================

/**
 * Create or update a contact in GoHighLevel
 *
 * Uses the upsert endpoint - if email exists, updates; otherwise creates.
 * This function will NOT throw errors - it returns a result object.
 */
export async function createContact(
  input: GHLContactInput
): Promise<GHLResult<{ contactId: string }>> {
  if (!isGHLConfigured()) {
    console.log('[GHL] Not configured, skipping contact sync')
    return { success: false, error: 'GHL not configured' }
  }

  try {
    const locationId = getLocationId()

    const requestBody: GHLUpsertContactRequest = {
      locationId,
      email: input.email,
    }

    if (input.phone) requestBody.phone = input.phone
    if (input.firstName) requestBody.firstName = input.firstName
    if (input.lastName) requestBody.lastName = input.lastName
    if (input.name) requestBody.name = input.name
    if (input.tags && input.tags.length > 0) requestBody.tags = input.tags
    if (input.source) requestBody.source = input.source
    if (input.customFields && input.customFields.length > 0) {
      requestBody.customFields = input.customFields
    }

    const response = await ghlFetchWithRetry<GHLContactResponse>(
      '/contacts/upsert',
      {
        method: 'POST',
        body: requestBody as unknown as Record<string, unknown>,
      }
    )

    const contactId = response.contact?.id
    if (contactId) {
      console.log('[GHL] Contact synced successfully:', contactId)
      return { success: true, data: { contactId } }
    }

    return { success: false, error: 'No contact ID in response' }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    console.error('[GHL] Failed to sync contact:', errorMessage)
    return { success: false, error: errorMessage }
  }
}

/**
 * Update an existing contact by ID
 */
export async function updateContact(
  contactId: string,
  data: Partial<GHLContactInput>
): Promise<GHLResult<{ contactId: string }>> {
  if (!isGHLConfigured()) {
    return { success: false, error: 'GHL not configured' }
  }

  try {
    const response = await ghlFetchWithRetry<GHLContactResponse>(
      `/contacts/${contactId}`,
      {
        method: 'PUT',
        body: data as unknown as Record<string, unknown>,
      }
    )

    const id = response.contact?.id
    if (id) {
      return { success: true, data: { contactId: id } }
    }
    return { success: false, error: 'No contact ID in response' }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    console.error('[GHL] Failed to update contact:', errorMessage)
    return { success: false, error: errorMessage }
  }
}

/**
 * Find a contact by email address
 */
export async function findContactByEmail(
  email: string
): Promise<GHLResult<{ contactId: string } | null>> {
  if (!isGHLConfigured()) {
    return { success: false, error: 'GHL not configured' }
  }

  try {
    const locationId = getLocationId()
    const response = await ghlFetchWithRetry<GHLSearchResponse>(
      `/contacts/search/duplicate?locationId=${locationId}&email=${encodeURIComponent(email)}`,
      { method: 'GET' }
    )

    const contacts = response.contacts
    if (contacts && contacts.length > 0) {
      return { success: true, data: { contactId: contacts[0].id } }
    }

    return { success: true, data: null }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    console.error('[GHL] Failed to find contact:', errorMessage)
    return { success: false, error: errorMessage }
  }
}
