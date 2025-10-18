/**
 * Analytics Opt-Out Utilities
 *
 * Provides functions to opt-out/opt-in from HubSpot tracking.
 * AVG-compliant: sets localStorage flag and revokes HubSpot cookies.
 */

/**
 * Opt-out van HubSpot analytics tracking
 * - Set localStorage flag
 * - Revoke HubSpot cookies (AVG compliance)
 * - Reload page to stop tracking
 */
export function optOutAnalytics(): void {
  if (typeof window === 'undefined') return

  // Set opt-out flag
  localStorage.setItem('analytics-opt-out', 'true')

  // Revoke HubSpot cookies (AVG requirement)
  if (window._hsq) {
    window._hsq.push(['revokeCookieConsent'])
  }

  // Reload to stop tracking
  window.location.reload()
}

/**
 * Check if user has opted out
 */
export function hasOptedOut(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('analytics-opt-out') === 'true'
}

/**
 * Opt-in (remove opt-out flag)
 * User can re-enable tracking
 */
export function optInAnalytics(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('analytics-opt-out')
  window.location.reload()
}

/**
 * Get current opt-out status (for UI display)
 */
export function getOptOutStatus(): 'opted-out' | 'opted-in' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown'
  return hasOptedOut() ? 'opted-out' : 'opted-in'
}

// TypeScript declaration for HubSpot
declare global {
  interface Window {
    _hsq?: Array<any>
  }
}
