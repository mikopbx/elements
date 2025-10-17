/**
 * MikoPBX i18n integration for Stoplight Elements
 * This module provides access to the global i18n translation function from MikoPBX
 */

// Declare the global i18n function that will be available at runtime from MikoPBX
declare global {
  function i18n(key: string, params?: Record<string, any>): string;
}

/**
 * Translation function wrapper
 * Uses the global i18n function if available, otherwise returns the key
 *
 * @param key - Translation key (e.g., 'sl_Request', 'sl_Response')
 * @param params - Optional parameters for string substitution
 * @returns Translated string or the key itself if translation not found
 */
export function t(key: string, params?: Record<string, any>): string {
  // Check if global i18n function is available
  if (typeof i18n === 'function') {
    return i18n(key, params);
  }

  // Fallback: return the key itself if i18n is not available
  // This ensures the component works even outside MikoPBX environment
  return key;
}
