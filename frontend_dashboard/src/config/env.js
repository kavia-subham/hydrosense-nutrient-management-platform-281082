//
// PUBLIC_INTERFACE
// env.js
// Centralizes reading environment variables for the frontend. Provides a single
// place to toggle mocks and access feature flags safely without leaking errors.
//

/**
 * PUBLIC_INTERFACE
 * getEnv
 * Returns a frozen object with normalized environment configuration for the app.
 * - USE_MOCKS: boolean; defaults to true to enable mock data layer
 * - FEATURE_FLAGS: object parsed from REACT_APP_FEATURE_FLAGS JSON string
 * - LOG_LEVEL: string log level hint for future diagnostics
 */
export function getEnv() {
  const RAW_FLAGS = process.env.REACT_APP_FEATURE_FLAGS;
  let flags = {};
  try {
    if (RAW_FLAGS && typeof RAW_FLAGS === 'string') {
      const parsed = JSON.parse(RAW_FLAGS);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        flags = parsed;
      }
    }
  } catch (_e) {
    // Fail safe to empty flags
    flags = {};
  }

  const USE_MOCKS =
    String(process.env.REACT_APP_USE_MOCKS || 'true').toLowerCase() !== 'false';

  const LOG_LEVEL = process.env.REACT_APP_LOG_LEVEL || 'info';

  return Object.freeze({
    USE_MOCKS,
    FEATURE_FLAGS: flags,
    LOG_LEVEL,
  });
}
