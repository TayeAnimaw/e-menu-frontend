import { BASE_DOMAIN } from '../config'

// These subdomains belong to the platform itself, not tenant menus.
const SYSTEM_SUBDOMAINS = new Set(['menufront', 'menuadmin', 'www'])

/**
 * Resolve the menu-owner subdomain from the current browser host, e.g.
 * "mycafe.ethioserve.com" -> "mycafe". Returns null on localhost, IP addresses,
 * the bare base domain, or known system subdomains so the app falls back to
 * path-based routing (/menu/:subdomain, /admin).
 */
export function getSubdomainFromHost(hostname = window.location.hostname) {
  if (!BASE_DOMAIN) return null
  if (hostname === 'localhost' || hostname === '127.0.0.1') return null
  if (hostname === BASE_DOMAIN || hostname === `www.${BASE_DOMAIN}`) return null
  if (!hostname.endsWith(`.${BASE_DOMAIN}`)) return null

  const sub = hostname.slice(0, -(`.${BASE_DOMAIN}`.length))
  if (SYSTEM_SUBDOMAINS.has(sub)) return null
  return sub
}
