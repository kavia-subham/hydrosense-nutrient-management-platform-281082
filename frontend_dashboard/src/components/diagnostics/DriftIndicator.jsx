import React, { useMemo } from 'react';

/**
 * PUBLIC_INTERFACE
 * DriftIndicator
 * Tiny badge representing current drift direction and magnitude.
 * - history: [{t,v}], - sensorType for precision, unit (optional)
 */
export default function DriftIndicator({ history, sensorType, unit }) {
  const { drift } = useMemo(() => {
    const h = Array.isArray(history) ? history : [];
    if (h.length < 3) return { drift: 0 };
    const tail = h.slice(-6);
    const start = tail[0];
    const end = tail[tail.length - 1];
    const dtMin = Math.max(0.016, (end.t - start.t) / 60000);
    return { drift: (end.v - start.v) / dtMin };
  }, [history]);

  const color =
    drift > 0.05 ? 'var(--color-error)' : drift < -0.05 ? 'var(--color-success)' : 'var(--color-secondary)';

  return (
    <span
      role="note"
      aria-label={`drift ${drift >= 0 ? 'up' : 'down'} ${Math.abs(drift).toFixed(sensorType === 'TEMP' ? 2 : 3)} ${unit || ''}/min`}
      style={{
        padding: '2px 8px',
        borderRadius: 999,
        background: 'rgba(139, 92, 246, 0.08)',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        color,
        fontSize: 12,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {drift >= 0 ? '▲' : '▼'} {Math.abs(drift).toFixed(sensorType === 'TEMP' ? 2 : 3)}
      {unit ? ` ${unit}/min` : ''}
    </span>
  );
}
