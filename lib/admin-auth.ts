/**
 * Admin Auth Utility
 *
 * Server-side admin role verification.
 *
 * For development: Set ADMIN_BYPASS_USER_ID in .env.local to bypass auth
 * For production: Remove bypass and integrate with real auth
 */

import { supabaseAdmin } from '@/lib/supabase/admin'

// =============================================================================
// Dev Bypass
// =============================================================================

const ADMIN_BYPASS_USER_ID = process.env.ADMIN_BYPASS_USER_ID

// =============================================================================
// Helpers
// =============================================================================

/**
 * Get the current authenticated user ID
 *
 * TODO: Integrate with Supabase Auth when implemented
 */
async function getCurrentUserId(): Promise<string | null> {
  // Development bypass
  if (ADMIN_BYPASS_USER_ID && process.env.NODE_ENV === 'development') {
    return ADMIN_BYPASS_USER_ID
  }

  // TODO: Implement real session handling
  return null
}

/**
 * Check if a user is an admin in the admin_users table
 */
async function isAdmin(userId: string): Promise<boolean> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseAdmin as any)
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('[Admin Auth] DB error:', error)
      return false
    }
    return !!data
  } catch {
    return false
  }
}

/**
 * Get admin role for a user
 */
async function getAdminRole(userId: string): Promise<'admin' | 'super_admin' | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseAdmin as any)
      .from('admin_users')
      .select('role')
      .eq('user_id', userId)
      .single()

    if (error) return null
    return data?.role ?? null
  } catch {
    return null
  }
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Check if the current user is an admin.
 * Returns authorization status, userId, and role.
 */
export async function requireAdmin(): Promise<{
  isAuthorized: boolean
  userId: string | null
  role: 'admin' | 'super_admin' | null
}> {
  // Full bypass for development
  if (ADMIN_BYPASS_USER_ID && process.env.NODE_ENV === 'development') {
    console.log('[Admin Auth] DEV BYPASS ACTIVE - skipping DB check')
    return { isAuthorized: true, userId: ADMIN_BYPASS_USER_ID, role: 'super_admin' }
  }

  const userId = await getCurrentUserId()

  if (!userId) {
    return { isAuthorized: false, userId: null, role: null }
  }

  const authorized = await isAdmin(userId)
  if (!authorized) {
    return { isAuthorized: false, userId, role: null }
  }

  const role = await getAdminRole(userId)
  return { isAuthorized: true, userId, role }
}

/**
 * Check if the current user is a super admin
 */
export async function requireSuperAdmin(): Promise<{
  isAuthorized: boolean
  userId: string | null
}> {
  const { isAuthorized, userId, role } = await requireAdmin()

  if (!isAuthorized || role !== 'super_admin') {
    return { isAuthorized: false, userId }
  }

  return { isAuthorized: true, userId }
}
