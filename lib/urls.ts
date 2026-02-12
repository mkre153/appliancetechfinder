/**
 * URL Generation - Single Source of Truth
 *
 * ALL route strings MUST be generated through this file.
 */

// =============================================================================
// Directory Routes
// =============================================================================

export function getHomepageUrl(): string {
  return '/'
}

export function getAllStatesUrl(): string {
  return '/appliance-repair/'
}

export function getStateUrl(state: { slug: string }): string {
  return `/appliance-repair/${state.slug}/`
}

export function getCityUrl(
  state: { slug: string },
  city: { slug: string }
): string {
  return `/appliance-repair/${state.slug}/${city.slug}/`
}

// =============================================================================
// Static Routes
// =============================================================================

export function getAboutUrl(): string {
  return '/about/'
}

export function getContactUrl(): string {
  return '/contact/'
}

export function getPrivacyUrl(): string {
  return '/privacy/'
}

export function getTermsUrl(): string {
  return '/terms/'
}

export function getBlogUrl(): string {
  return '/blog/'
}

export function getBlogPostUrl(slug: string): string {
  return `/blog/${slug}/`
}

export function getBlogCategoryUrl(category: string): string {
  return `/blog/category/${category}/`
}

export function getSubmitCompanyUrl(): string {
  return '/stores/new/'
}

export function getAdminUrl(): string {
  return '/admin/'
}

// =============================================================================
// Deals Routes
// =============================================================================

export function getDealsUrl(): string {
  return '/deals/'
}

export function getDealUrl(id: string): string {
  return `/deals/${id}/`
}

export function getDealSubmitUrl(): string {
  return '/deals/submit/'
}

// =============================================================================
// Auth Routes
// =============================================================================

export function getSignInUrl(): string {
  return '/auth/signin/'
}

export function getSignUpUrl(): string {
  return '/auth/signup/'
}

export function getResetPasswordUrl(): string {
  return '/auth/reset-password/'
}

// =============================================================================
// Cross-site Links
// =============================================================================

export function getSdfStateUrl(state: { slug: string }): string {
  return `https://scratchanddentfinder.com/scratch-and-dent-appliances/${state.slug}/`
}

export function getSdfCityUrl(
  state: { slug: string },
  city: { slug: string }
): string {
  return `https://scratchanddentfinder.com/scratch-and-dent-appliances/${state.slug}/${city.slug}/`
}
