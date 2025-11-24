import React, { useMemo, useState } from 'react';
import Card from '../components/common/Card';
import { useSensors } from '../api/hooks/useSensors';
import Sparkline from '../components/common/Sparkline';
import SensorHealthCard from '../components/diagnostics/SensorHealthCard';
import { getState } from '../mocks/store';

export default function Sensors() {
  const store = getState();
  const [zoneId, setZoneId] = useState('all');
  const [cropId, setCropId] = useState('all');

  const filter = useMemo(() => {
    const f = {};
    if (zoneId !== 'all') f.zoneId = zoneId;
    if (cropId !== 'all') f.cropId = cropId;
    return Object.keys(f).length ? f : null;
  }, [zoneId, cropId]);

  const { sensors, loading, error } = useSensors(filter);
  const [activeId, setActiveId] = useState(null);
  const active = useMemo(() => sensors.find((s) => s.id === activeId), [sensors, activeId]);

  return (
    <div>
      <h2 style={{ marginTop: 0, color: 'var(--color-text)' }}>Sensors</h2>
      <div style={{ display: 'grid', gridTemplateColumns: active ? '2fr 1fr' : '1fr', gap: 16 }}>
        <Card
          title="Sensor Grid"
          footer={
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <label>
                <span style={{ marginRight: 8 }}>Zone</span>
                <select
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  aria-label="Filter by zone"
                  style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)' }}
                >
                  <option value="all">All</option>
                  {store.zones?.map((z) => (
                    <option key={z.id} value={z.id}>{z.name}</option>
                  ))}
                </select>
              </label>
              <label>
                <span style={{ marginRight: 8 }}>Crop</span>
                <select
                  value={cropId}
                  onChange={(e) => setCropId(e.target.value)}
                  aria-label="Filter by crop"
                  style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)' }}
                >
                  <option value="all">All</option>
                  {store.crops?.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </label>
            </div>
          }
        >
          {loading && <div aria-busy="true">Loading sensors…</div>}
          {error && <div role="alert" style={{ color: 'var(--color-error)' }}>Failed to load sensors.</div>}
          {!loading && !error && (
            <div style={{ display: 'grid', gap: 12 }}>
              {sensors.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  aria-label={`View details for ${s.name}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    padding: '10px 12px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 10,
                    background: 'var(--color-surface)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onFocus={(e) => (e.currentTarget.style.boxShadow = 'var(--focus-ring)')}
                  onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>
                      {s.type} • {s.zoneId || '—'} • Updated {new Date(s.updatedAt).toLocaleTimeString()}
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <Sparkline values={s.history} width={240} height={40} fill="var(--color-primary)" aria-label={`${s.name} history`} />
                    </div>
                  </div>
                  <div aria-label="current reading" style={{ fontWeight: 700, color: 'var(--color-primary)', alignSelf: 'center' }}>
                    {s.value.toFixed(s.type === 'TEMP' ? 1 : s.type === 'ORP' ? 0 : 2)} {s.unit}
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>

        {active ? (
          <div style={{ display: 'grid', gap: 16 }}>
            <SensorHealthCard sensor={active} />
            <Card title="History">
              <Sparkline values={active.history} width={360} height={96} fill="var(--color-primary)" aria-label={`${active.name} detailed history`} />
              <div style={{ fontSize: 12, color: 'var(--color-secondary)', marginTop: 8 }}>
                Showing last {active.history?.length || 0} points
              </div>
              <button
                onClick={() => setActiveId(null)}
                style={{
                  marginTop: 10,
                  background: 'var(--color-primary)',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}
