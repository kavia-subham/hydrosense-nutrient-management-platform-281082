import { useEffect, useMemo, useRef, useState } from 'react';
import { bus, WS_TOPICS } from '../../mocks/wsMock';
import { getAlerts, acknowledgeAlert } from '../../mocks/store';
import { getEnv } from '../../config/env';

/**
 * PUBLIC_INTERFACE
 * useAlerts
 * Exposes alerts list with realtime updates, and acknowledge API.
 */
export function useAlerts() {
  const { USE_MOCKS } = getEnv();
  const [alerts, setAlerts] = useState(() => (USE_MOCKS ? getAlerts() : []));
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

    setAlerts(getAlerts());
    setLoading(false);

    const unsub = bus.subscribe(WS_TOPICS.ALERT_NEW, () => {
      if (!mounted.current) return;
      setAlerts(getAlerts());
    });

    return () => {
      mounted.current = false;
      if (unsub) unsub();
    };
  }, [USE_MOCKS]);

  const api = useMemo(
    () => ({
      acknowledge: (alertId) => {
        try {
          acknowledgeAlert(alertId);
          setAlerts(getAlerts());
        } catch (e) {
          setError(e);
        }
      },
      refresh: () => {
        try {
          setAlerts(getAlerts());
        } catch (e) {
          setError(e);
        }
      },
    }),
    []
  );

  return { alerts, loading, error, ...api };
}
