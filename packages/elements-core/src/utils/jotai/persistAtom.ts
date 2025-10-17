import { safeParse } from '@stoplight/json';
import { atom, WritableAtom } from 'jotai';

/**
 * External provider function type for security scheme values.
 * Allows integrating external token management systems (e.g., JWT authentication).
 *
 * @example
 * ```typescript
 * // In your application, before loading Stoplight Elements:
 * window.stoplightSecuritySchemeProvider = () => {
 *   return {
 *     bearerAuth: myApp.getAuthToken(),
 *     apiKey: myApp.getApiKey()
 *   };
 * };
 * ```
 */
export type SecuritySchemeProvider = () => Record<string, string> | null | undefined;

declare global {
  interface Window {
    /**
     * Optional external provider for security scheme values.
     * When defined, Stoplight Elements will call this function to get authentication values
     * instead of reading from localStorage. This allows integration with external auth systems.
     *
     * The provider should return an object with security scheme names as keys and auth values as values.
     * Return null or undefined to fall back to localStorage.
     *
     * @example
     * ```javascript
     * // Example: Integrate with JWT-based authentication
     * window.stoplightSecuritySchemeProvider = () => {
     *   if (window.TokenManager && window.TokenManager.accessToken) {
     *     return { bearerAuth: window.TokenManager.accessToken };
     *   }
     *   return null; // Fallback to localStorage
     * };
     * ```
     */
    stoplightSecuritySchemeProvider?: SecuritySchemeProvider;
  }
}

/**
 * @deprecated use `import { atomWithStorage } from 'jotai/utils'` instead
 */
export const persistAtom = <T extends Object>(key: string, atomInstance: WritableAtom<T, T>) => {
  if (typeof window === 'undefined' || window.localStorage === undefined) {
    return atomInstance;
  }

  return atom<T, T>(
    get => {
      // INTEGRATION HOOK: Check for external security scheme provider
      // This allows embedding applications to provide authentication values dynamically
      // without storing them in localStorage (better security for sensitive tokens)
      if (key === 'TryIt_securitySchemeValues' && typeof window.stoplightSecuritySchemeProvider === 'function') {
        try {
          const externalValue = window.stoplightSecuritySchemeProvider();
          if (externalValue !== null && externalValue !== undefined) {
            return externalValue as unknown as T;
          }
        } catch (error) {
          console.warn('Stoplight Elements: External security scheme provider threw an error, falling back to localStorage:', error);
        }
      }

      // Fallback to localStorage for persistence
      const localStorageValue = window.localStorage.getItem(key);
      const atomValue = get(atomInstance);

      if (localStorageValue === null) return atomValue;

      return safeParse(localStorageValue) ?? atomValue;
    },
    (_, set, update) => {
      // Don't persist to localStorage if external provider is actively providing values
      // This prevents stale tokens from being saved
      const hasExternalProvider =
        key === 'TryIt_securitySchemeValues' &&
        typeof window.stoplightSecuritySchemeProvider === 'function';

      if (!hasExternalProvider) {
        try {
          /* setItem can throw when storage is full */
          window.localStorage.setItem(key, JSON.stringify(update));
        } catch (error) {
          console.error(error);
        }
      }

      set(atomInstance, update);
    },
  );
};
