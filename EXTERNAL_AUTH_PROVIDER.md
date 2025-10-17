# External Security Scheme Provider

## Overview

Stoplight Elements now supports integration with external authentication systems through the `window.stoplightSecuritySchemeProvider` API. This allows embedding applications to provide security credentials (like JWT tokens) dynamically without storing them in `localStorage`.

## Use Case

This feature is particularly useful when:
- Your application manages authentication tokens in memory (e.g., JWT tokens with short lifetimes)
- You want to avoid XSS vulnerabilities associated with storing tokens in `localStorage`
- You have an existing token management system (like `TokenManager`) that should be the single source of truth
- You need tokens to be refreshed automatically without user interaction

## How It Works

### 1. Provider Function

Define a global function that returns security scheme values:

```javascript
window.stoplightSecuritySchemeProvider = () => {
  // Return security scheme values dynamically
  // The keys should match security scheme names in your OpenAPI spec
  return {
    'bearerAuth': myApp.getAuthToken(),
    'apiKey': myApp.getApiKey()
  };
};
```

### 2. Fallback Behavior

- If the provider returns `null` or `undefined`, Stoplight Elements falls back to `localStorage`
- If the provider throws an error, it logs a warning and falls back to `localStorage`
- If no provider is defined, `localStorage` is used (backward compatible)

### 3. Storage Prevention

When an external provider is active, Stoplight Elements will **not** persist values to `localStorage` for that security scheme. This prevents stale tokens from being saved.

## Implementation Example

### MikoPBX Integration

```javascript
// Set up the provider before initializing Stoplight Elements
window.stoplightSecuritySchemeProvider = () => {
  // Check if TokenManager is available and has an access token
  if (typeof TokenManager !== 'undefined' && TokenManager.accessToken) {
    return {
      'bearerAuth': TokenManager.accessToken
    };
  }

  // No token available - fallback to localStorage
  return null;
};

// Now initialize Stoplight Elements
const apiElement = document.createElement('elements-api');
apiElement.apiDescriptionDocument = openApiSpec;
document.getElementById('elements-container').appendChild(apiElement);
```

## Security Benefits

1. **XSS Protection**: Tokens never touch `localStorage`, reducing XSS attack surface
2. **Token Freshness**: Always uses the current token from your auth system
3. **Automatic Refresh**: When your auth system refreshes tokens, Stoplight Elements automatically uses the new one
4. **Memory-Only Storage**: Tokens can stay in memory only (httpOnly cookies for refresh tokens)

## API Reference

### window.stoplightSecuritySchemeProvider

**Type**: `() => Record<string, string> | null | undefined`

**Returns**:
- `Record<string, string>`: Object with security scheme names as keys and auth values as values
- `null` or `undefined`: Falls back to localStorage

**Example Return Value**:
```javascript
{
  'bearerAuth': 'eyJ0eXAiOiJKV1QiLCJhbGc...',
  'apiKeyAuth': 'your-api-key-here',
  'customAuth': 'custom-token-value'
}
```

## Modified Files

- `packages/elements-core/src/utils/jotai/persistAtom.ts`
  - Added `SecuritySchemeProvider` type definition
  - Added `window.stoplightSecuritySchemeProvider` to global Window interface
  - Modified `persistAtom` getter to check external provider first
  - Modified `persistAtom` setter to skip localStorage when external provider is active

## Backward Compatibility

✅ **Fully backward compatible**

- If `window.stoplightSecuritySchemeProvider` is not defined, behavior is unchanged
- Existing applications using `localStorage` continue to work
- No breaking changes to the API

## Testing

To verify the integration works:

1. Set up the provider function before loading Stoplight Elements
2. Open browser DevTools and check console for: `"Stoplight Elements security scheme provider configured"`
3. Open an API endpoint in the "Try It" panel
4. Verify the security token field is auto-populated
5. Send a request and verify it includes the `Authorization` header with your token

## Future Enhancements

Potential improvements for this feature:

- Support for async providers (returning `Promise<Record<string, string>>`)
- Provider refresh callbacks (notify when Stoplight Elements needs fresh tokens)
- Per-scheme providers (different providers for different security schemes)
- TypeScript type exports for better IDE support

## License

This enhancement maintains the same license as Stoplight Elements.
