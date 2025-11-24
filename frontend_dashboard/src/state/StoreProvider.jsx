import React, { createContext, useContext, useMemo, useState } from 'react';
import { getEnv } from '../config/env';

// Import simulator side-effect so it runs when mocks are enabled
import '../mocks/simulator';

const StoreContext = createContext({
  preferences: {},
  setPreference: () => {},
});

/**
 * PUBLIC_INTERFACE
 * StoreProvider
 * Provides a simple context for app-wide settings/preferences and ensures
 * the mock simulator is initialized when USE_MOCKS is true.
 */
export default function StoreProvider({ children }) {
  const { USE_MOCKS } = getEnv();
  const [preferences, setPreferences] = useState({
    units: 'metric',
    liveUpdates: true,
  });

  const setPreference = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const value = useMemo(
    () => ({
      USE_MOCKS,
      preferences,
      setPreference,
    }),
    [USE_MOCKS, preferences]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * useAppStore
 * Accessor for StoreProvider context.
 */
export function useAppStore() {
  return useContext(StoreContext);
}
