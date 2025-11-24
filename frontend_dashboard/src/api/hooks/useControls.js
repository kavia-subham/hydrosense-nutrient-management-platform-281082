import { useEffect, useMemo, useRef, useState } from 'react';
import { bus, WS_TOPICS } from '../../mocks/wsMock';
import { getControls, setControl } from '../../mocks/store';
import { getEnv } from '../../config/env';

/**
 * PUBLIC_INTERFACE
 * useControls
 * Access controls state and provide mutators. Re-renders on status events.
 */
export function useControls() {
  const { USE_MOCKS } = getEnv();
  const [controls, setControlsState] = useState(() => (USE_MOCKS ? getControls() : {}));
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

    setControlsState(getControls());
    setLoading(false);

    const unsub = bus.subscribe(WS_TOPICS.CONTROLS_STATUS, () => {
      if (!mounted.current) return;
      setControlsState(getControls());
    });

    return () => {
      mounted.current = false;
      if (unsub) unsub();
    };
  }, [USE_MOCKS]);

  const api = useMemo(
    () => ({
      set: (key, value) => {
        try {
          setControl(key, value);
          setControlsState(getControls());
        } catch (e) {
          setError(e);
        }
      },
      refresh: () => {
        try {
          setControlsState(getControls());
        } catch (e) {
          setError(e);
        }
      },
    }),
    []
  );

  return { controls, loading, error, ...api };
}
