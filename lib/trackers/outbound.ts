/**
 * Outbound Event Tracker
 *
 * Tracks CTA click events (phone, directions, website).
 * Posts to /api/cta-event (fire-and-forget).
 * No dependency on lib/events or lib/analytics — uses fetch directly.
 */

type EventType = 'phone' | 'directions' | 'website'

interface OutboundEvent {
  type: EventType
  companyId: number
  timestamp: number
}

/**
 * Map event type to cta_events event_type
 */
function mapEventType(type: EventType): 'call' | 'directions' | 'website' {
  if (type === 'phone') return 'call'
  return type
}

/**
 * Track outbound click events.
 * Called when users click phone, directions, or website CTAs.
 * Persists to cta_events table via API (fire-and-forget).
 */
export function trackOutboundEvent(event: OutboundEvent): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      '[outbound]',
      event.type,
      `company:${event.companyId}`,
      new Date(event.timestamp).toISOString()
    )
  }

  // GA4 placeholder — add gtag call here when analytics is wired up
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as Record<string, unknown>).gtag as (
      ...args: unknown[]
    ) => void
    gtag('event', 'company_contact_click', {
      type: event.type,
      company_id: event.companyId,
    })
  }

  // Persist to cta_events table (fire-and-forget)
  const sourcePage = typeof window !== 'undefined' ? window.location.pathname : 'unknown'

  fetch('/api/cta-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      companyId: event.companyId,
      eventType: mapEventType(event.type),
      sourcePage,
    }),
  }).catch(() => {
    // Silently fail - event tracking should not block user experience
  })
}
