import React, { memo, useMemo } from 'react';

/**
 * PUBLIC_INTERFACE
 * DriftIndicator
 * Tiny badge representing current drift direction and magnitude.
 * - history: [{t:number,v:number}]
 * - sensorType: for precision (e.g., 'TEMP' to show fewer decimals)
 * - unit: optional unit suffix (e.g., 'mS/cm', 'pH', '°C')
 */
function DriftIndicator({ history, sensorType, unit }) {
  // Compute drift per minute from last few points to smooth noise
  const { drift } = useMemo(() => {
    const h = Array.isArray(history) ? history : [];
    if (h.length < 3) return { drift: 0 };
    const tail = h.slice(-6);
    const start = tail[0];
    const end = tail[tail.length - 1];
    const dtMin = Math.max(0.016, (end.t - start.t) / 60000); // avoid division by zero
    return { drift: (end.v - start.v) / dtMin };
  }, [history]);

  const color =
    drift > 0.05 ? 'var(--color-error)' : drift < -0.05 ? 'var(--color-success)' : 'var(--color-secondary)';

  const precision = sensorType === 'TEMP' ? 2 : 3;
  const direction = drift >= 0 ? 'up' : 'down';
  const label = `drift ${direction} ${Math.abs(drift).toFixed(precision)} ${unit || ''}/min`;

  return (
    <span
      role="note"
      aria-label={label}
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
      {drift >= 0 ? '▲' : '▼'} {Math.abs(drift).toFixed(precision)}
      {unit ? ` ${unit}/min` : ''}
    </span>
  );
}

export default memo(DriftIndicator);
