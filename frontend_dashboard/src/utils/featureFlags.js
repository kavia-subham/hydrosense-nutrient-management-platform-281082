const RAW = process.env.REACT_APP_FEATURE_FLAGS;

/**
 * PUBLIC_INTERFACE
 * getFeatureFlags
 * Safely parses the REACT_APP_FEATURE_FLAGS JSON string to an object.
 * - Accepts only string input from environment
 * - Returns {} when missing or invalid
 * - Avoids throwing to keep UI stable
 */
export function getFeatureFlags() {
  try {
    if (!RAW || typeof RAW !== 'string') return {};
    const parsed = JSON.parse(RAW);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed;
    }
    return {};
  } catch (_e) {
    // Do not leak details or crash UI
    return {};
  }
}

/**
 * PUBLIC_INTERFACE
 * isFeatureEnabled
 * Returns a boolean indicating whether a feature flag is enabled.
 */
export function isFeatureEnabled(flagKey) {
  const flags = getFeatureFlags();
  return Boolean(flags?.[flagKey]);
}
