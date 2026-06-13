// Central place to configure the app for each environment.
// Update these two values when deploying (e.g. on cPanel).

// Base URL of the Laravel API, including the "/api" prefix.
export const API_BASE_URL = 'http://127.0.0.1:8000/api'

// Root domain menu owners are given subdomains under, e.g. "menu.com"
// results in tenants being reachable at "{subdomain}.menu.com".
// Set to null to disable subdomain-based tenant detection (path-based
// routing via /menu/:subdomain and /admin will still work).
export const BASE_DOMAIN = 'menu.com'

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
