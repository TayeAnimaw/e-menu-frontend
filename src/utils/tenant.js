import { BASE_DOMAIN } from '../config'

/**
 * Resolve the menu-owner subdomain from the current browser host, e.g.
 * "mycafe.menu.com" -> "mycafe". Returns null on localhost, IP addresses,
 * or the bare base domain (no tenant subdomain present) so the app falls
 * back to path-based routing (/menu/:subdomain, /admin).
 */
export function getSubdomainFromHost(hostname = window.location.hostname) {
  if (!BASE_DOMAIN) return null
  if (hostname === 'localhost' || hostname === '127.0.0.1') return null
  if (hostname === BASE_DOMAIN || hostname === `www.${BASE_DOMAIN}`) return null
  if (!hostname.endsWith(`.${BASE_DOMAIN}`)) return null

  return hostname.slice(0, -(`.${BASE_DOMAIN}`.length))
}
