import React, { useMemo, useState } from 'react';
import Card from '../components/common/Card';
import { getCrops } from '../mocks/store';

/**
 * PUBLIC_INTERFACE
 * Crops
 * Lists available crop profiles from the mock store with minimal details.
 * Shows name, default stage, and target ranges for EC/PH/TEMP/DO/ORP at default stage.
 */
export default function Crops() {
  const [query, setQuery] = useState('');
  const crops = getCrops();

  const filtered = useMemo(() => {
    const q = (query || '').toLowerCase().trim();
    if (!q) return crops;
    return crops.filter((c) => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
  }, [crops, query]);

  return (
    <div>
      <h2 style={{ marginTop: 0, color: 'var(--color-text)' }}>Crops</h2>
      <Card
        title="Crop Profiles"
        footer={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ width: '100%' }}>
              <span style={{ marginRight: 8 }}>Search</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., lettuce, basil, tomato"
                aria-label="Search crops"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: '1px solid rgba(0,0,0,0.12)',
                }}
                onFocus={(e) => (e.currentTarget.style.boxShadow = 'var(--focus-ring)')}
                onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
              />
            </label>
          </div>
        }
      >
        <div style={{ display: 'grid', gap: 12 }}>
          {filtered.length === 0 && (
            <div>No crop profiles match your search.</div>
          )}
          {filtered.map((c) => {
            // Backward compatibility: targets provided in mock store for default stage
            const targets = c.targets || {};
            return (
              <div
                key={c.id}
                role="article"
                aria-label={`Crop ${c.name}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: 8,
                  padding: '10px 12px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: 10,
                  background: 'var(--color-surface)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>
                    ID: {c.id} • Default stage: {c.defaultStage || '—'}
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {['EC', 'PH', 'TEMP', 'DO', 'ORP'].map((k) => {
                      const t = targets[k];
                      if (!t) return null;
                      return (
                        <span
                          key={k}
                          role="note"
                          aria-label={`${k} target ${t.min}-${t.max} ${t.unit || ''}`}
                          style={{
                            padding: '2px 8px',
                            borderRadius: 999,
                            background: 'rgba(139, 92, 246, 0.08)',
                            border: '1px solid rgba(139, 92, 246, 0.25)',
                            color: 'var(--color-primary)',
                            fontSize: 12,
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {k}: {t.min}–{t.max} {t.unit || ''}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div style={{ alignSelf: 'center', color: 'var(--color-secondary)', fontSize: 12 }}>
                  {Object.keys(targets).length ? 'targets' : 'no targets'}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
