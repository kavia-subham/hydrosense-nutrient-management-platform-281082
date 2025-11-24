import { useEffect, useMemo, useRef, useState } from 'react';
import { getIntegrations } from '../../mocks/store';
import { getEnv } from '../../config/env';

/**
 * PUBLIC_INTERFACE
 * useIntegrations
 * Returns integrations list; currently static in mocks but future-ready.
 */
export function useIntegrations() {
  const { USE_MOCKS } = getEnv();
  const [integrations, setIntegrations] = useState(() => (USE_MOCKS ? getIntegrations() : []));
  const [loading, setLoading] = useState(!USE_MOCKS);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (!USE_MOCKS) {
      setLoading(false);
      return () => {
        mounted.current = false;
      };
    }
    setIntegrations(getIntegrations());
    setLoading(false);

    return () => {
      mounted.current = false;
    };
  }, [USE_MOCKS]);

  const api = useMemo(
    () => ({
      refresh: () => {
        try {
          setIntegrations(getIntegrations());
        } catch (e) {
          setError(e);
        }
      },
    }),
    []
  );

  return { integrations, loading, error, ...api };
}
