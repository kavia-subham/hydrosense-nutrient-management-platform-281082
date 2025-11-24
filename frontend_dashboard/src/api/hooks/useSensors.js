import { useEffect, useMemo, useRef, useState } from 'react';
import { bus, WS_TOPICS } from '../../mocks/wsMock';
import { getSensors } from '../../mocks/store';
import { getEnv } from '../../config/env';

/**
 * PUBLIC_INTERFACE
 * useSensors
 * Returns live sensors, loading and error. Subscribes to mock bus to re-render
 * on updates. Cleanly replaceable with real API/WebSocket later.
 */
export function useSensors() {
  const { USE_MOCKS } = getEnv();
  const [sensors, setSensors] = useState(() => (USE_MOCKS ? getSensors() : []));
  const [loading, setLoading] = useState(!USE_MOCKS);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (!USE_MOCKS) {
      // Placeholder for future fetch
      setLoading(false);
      return () => {
        mounted.current = false;
      };
    }

    setSensors(getSensors());
    setLoading(false);

    const unsub = bus.subscribe(WS_TOPICS.SENSOR_UPDATES, () => {
      // Batch updates by reading the full set only when events arrive
      if (!mounted.current) return;
      setSensors(getSensors());
    });

    return () => {
      mounted.current = false;
      if (unsub) unsub();
    };
  }, [USE_MOCKS]);

  const api = useMemo(
    () => ({
      refresh: () => {
        try {
          setSensors(getSensors());
        } catch (e) {
          setError(e);
        }
      },
    }),
    []
  );

  return { sensors, loading, error, ...api };
}
