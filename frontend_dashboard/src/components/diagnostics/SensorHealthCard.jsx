import React, { memo, useMemo } from 'react';
import Card from '../common/Card';

/**
 * PUBLIC_INTERFACE
 * SensorHealthCard
 * Shows derived sensor health metrics: freshness, stability, and drift.
 * - sensor: { name, updatedAt, history: [{t,v}], type }
 */
function SensorHealthCard({ sensor }) {
  const { freshnessSec, stability, driftPerMin } = useMemo(() => {
    if (!sensor) return { freshnessSec: Infinity, stability: 'unknown', driftPerMin: 0 };
    const now = Date.now();
    const freshnessSec = Math.max(0, Math.round((now - (sensor.updatedAt || now)) / 1000));

    const h = Array.isArray(sensor.history) ? sensor.history : [];
    if (h.length < 3) return { freshnessSec, stability: 'insufficient', driftPerMin: 0 };

    // Compute simple drift as delta between last and 5th-from-last per minute
    const tail = h.slice(-6);
    const first = tail[0];
    const last = tail[tail.length - 1];
    const dtMin = Math.max(0.016, (last.t - first.t) / 60000); // avoid /0
    const driftPerMin = (last.v - first.v) / dtMin;

    // Stability via standard deviation over tail
    const mean = tail.reduce((a, x) => a + x.v, 0) / tail.length;
    const variance = tail.reduce((a, x) => a + (x.v - mean) ** 2, 0) / tail.length;
    const std = Math.sqrt(variance);

    let stability = 'stable';
    if (std > 0.25) stability = 'noisy';
    if (Math.abs(driftPerMin) > 0.2) stability = 'drifting';

    return { freshnessSec, stability, driftPerMin };
  }, [sensor]);

  const statusColor =
    stability === 'stable'
      ? 'var(--color-success)'
      : stability === 'noisy'
      ? 'var(--color-secondary)'
      : 'var(--color-error)';

  return (
    <Card
      title={`Health • ${sensor?.name || 'Sensor'}`}
      style={{
        background: 'linear-gradient(180deg, #fff, var(--color-bg))',
      }}
    >
      <dl
        style={{
          margin: 0,
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          rowGap: 8,
          columnGap: 12,
        }}
      >
        <dt>Last update</dt>
        <dd aria-live="polite">{Number.isFinite(freshnessSec) ? `${freshnessSec}s ago` : '–'}</dd>

        <dt>Stability</dt>
        <dd>
          <span style={{ color: statusColor, fontWeight: 600 }}>{stability}</span>
        </dd>

        <dt>Drift</dt>
        <dd>
          <code style={{ color: 'var(--color-primary)' }}>
            {driftPerMin >= 0 ? '+' : ''}
            {driftPerMin.toFixed(sensor?.type === 'TEMP' ? 2 : 3)} {sensor?.unit || ''}/min
          </code>
        </dd>
      </dl>
    </Card>
  );
}

export default memo(SensorHealthCard);
