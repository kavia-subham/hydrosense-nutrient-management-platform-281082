//
// PUBLIC_INTERFACE
// selectors.js
// Simple selector utilities, kept separate for parity with a future state lib.
//

/**
 * PUBLIC_INTERFACE
 * selectPreference
 * Safely read a preference key with optional default.
 */
export function selectPreference(state, key, defValue = undefined) {
  if (!state || !state.preferences) return defValue;
  return state.preferences[key] ?? defValue;
}
