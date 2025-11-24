import React from 'react';
import Card from '../components/common/Card';
import { useSensors } from '../api/hooks/useSensors';

export default function Sensors() {
  const { sensors, loading, error } = useSensors();

  return (
    <div>
      <h2 style={{ marginTop: 0, color: 'var(--color-text)' }}>Sensors</h2>
      <Card title="Sensor Grid">
        {loading && <div aria-busy="true">Loading sensors…</div>}
        {error && <div role="alert" style={{ color: 'var(--color-error)' }}>Failed to load sensors.</div>}
        {!loading && !error && (
          <div style={{ display: 'grid', gap: 12 }}>
            {sensors.map((s) => (
              <div
                key={s.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  padding: '10px 12px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  borderRadius: 10,
                  background: 'var(--color-surface)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>
                    {s.type} • Updated {new Date(s.updatedAt).toLocaleTimeString()}
                  </div>
                </div>
                <div aria-label="current reading" style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                  {s.value.toFixed(s.type === 'TEMP' ? 1 : 2)} {s.unit}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
