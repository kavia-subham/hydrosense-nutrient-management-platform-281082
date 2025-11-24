import { useEffect, useMemo, useRef, useState } from 'react';
import { bus, WS_TOPICS } from '../../mocks/wsMock';
import { getSensors } from '../../mocks/store';
import { getEnv } from '../../config/env';

/**
 * PUBLIC_INTERFACE
 * useSensors
 * Returns live sensors, loading and error. Subscribes to mock bus to re-render
 * on updates. Cleanly replaceable with real API/WebSocket later.
 * Optionally accepts a filter: { zoneId, greenhouseId, cropId, stage, type }
 */
export function useSensors(filter = null) {
  const { USE_MOCKS } = getEnv();
  const [sensors, setSensors] = useState(() => (USE_MOCKS ? getSensors(filter) : []));
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

    setSensors(getSensors(filter));
    setLoading(false);

    // Throttle frequent updates to animation frame for smoother UI
    let rafId = null;
    const onUpdate = () => {
      if (!mounted.current) return;
      if (rafId) return; // already queued
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setSensors(getSensors(filter));
      });
    };
    const unsub = bus.subscribe(WS_TOPICS.SENSOR_UPDATES, onUpdate);

    return () => {
      mounted.current = false;
      if (unsub) unsub();
    };
  }, [USE_MOCKS, filter?.zoneId, filter?.greenhouseId, filter?.cropId, filter?.stage, filter?.type]);

  const api = useMemo(
    () => ({
      refresh: () => {
        try {
          setSensors(getSensors(filter));
        } catch (e) {
          setError(e);
        }
      },
    }),
    [filter]
  );

  return { sensors, loading, error, ...api };
}
