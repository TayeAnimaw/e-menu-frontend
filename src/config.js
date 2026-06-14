// Central place to configure the app for each environment.
// Update these two values when deploying (e.g. on cPanel).

// Base URL of the Laravel API, including the "/api" prefix.
export const API_BASE_URL = 'https://menuadmin.ethioserve.com/api'

// Set to null because ethioserve.com hosts other projects — a wildcard DNS
// record would conflict. Tenant menus are served at the path-based URL:
// https://menufront.ethioserve.com/menu/{subdomain}
export const BASE_DOMAIN = null

// Root URL where public menus are served (the React frontend host).
export const MENU_FRONTEND_URL = 'https://menufront.ethioserve.com'

// Build the public-facing menu link for a given subdomain.
export function publicMenuUrl(subdomain) {
  if (BASE_DOMAIN) return `https://${subdomain}.${BASE_DOMAIN}`
  return `${MENU_FRONTEND_URL}/menu/${subdomain}`
}

// Suggested dietary tags shown when editing menu items. Owners can still
// type any custom tag.
export const DIETARY_TAG_PRESETS = [
  'vegan',
  'vegetarian',
  'gluten-free',
  'dairy-free',
  'nut-free',
  'halal',
  'keto',
  'spicy',
]
