import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { bus, WS_TOPICS } from '../../mocks/wsMock';

const ToastContext = createContext({
  push: (_toast) => {},
});

/**
 * PUBLIC_INTERFACE
 * useToasts
 * Hook to push transient toasts: { id?, title, message, type='info', timeoutMs=4000 }
 */
export function useToasts() {
  return useContext(ToastContext);
}

/**
 * PUBLIC_INTERFACE
 * ToastCenter
 * Displays transient notifications and listens to mock simulator events (alerts, control changes).
 * Applies a built-in throttle to ensure at most one toast is displayed every 10 seconds.
 */
export default function ToastCenter({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);
  // Track last toast time to throttle UI notifications
  const lastToastAtRef = useRef(0);
  const TOAST_MIN_INTERVAL_MS = 10000;

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((toast) => {
    // Throttle UI toast display to avoid overwhelming users
    const now = Date.now();
    if (now - lastToastAtRef.current < TOAST_MIN_INTERVAL_MS) {
      return;
    }
    lastToastAtRef.current = now;

    const id = toast.id || `toast-${now}-${counter.current++}`;
    const t = { id, type: 'info', timeoutMs: 4000, ...toast };
    setToasts((prev) => [...prev, t]);
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timeout = prefersReduced ? Math.min(4000, t.timeoutMs) : t.timeoutMs;
    if (timeout > 0) {
      window.setTimeout(() => remove(id), timeout);
    }
  }, [remove]);

  useEffect(() => {
    const unsubAlert = bus.subscribe(WS_TOPICS.ALERT_NEW, (a) => {
      push({
        type: a.severity === 'error' ? 'error' : a.severity === 'warning' ? 'warning' : 'info',
        title: a.title || 'Alert',
        message: a.message || '',
        timeoutMs: 6000,
      });
    });
    const unsubCtrl = bus.subscribe(WS_TOPICS.CONTROLS_STATUS, (c) => {
      push({
        type: 'info',
        title: 'Control Status',
        message: `${c?.key || 'Control'} is now ${c?.status || 'updated'}`,
        timeoutMs: 3000,
      });
    });
    return () => {
      if (unsubAlert) unsubAlert();
      if (unsubCtrl) unsubCtrl();
    };
  }, [push]);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="region"
        aria-live="polite"
        aria-atomic="true"
        aria-label="Notifications"
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          display: 'grid',
          gap: 8,
          maxWidth: 360,
          zIndex: 50,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{
              background: 'var(--color-surface)',
              borderRadius: 12,
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: 'var(--shadow-soft)',
              padding: '10px 12px',
              display: 'grid',
              gap: 4,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: t.type === 'error' ? 'var(--color-error)' : t.type === 'warning' ? '#b45309' : 'var(--color-primary)' }}>
                {t.title}
              </strong>
              <button
                onClick={() => remove(t.id)}
                aria-label="Dismiss notification"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-secondary)',
                }}
              >
                ✕
              </button>
            </div>
            {t.message ? <div style={{ color: 'var(--color-text)' }}>{t.message}</div> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
