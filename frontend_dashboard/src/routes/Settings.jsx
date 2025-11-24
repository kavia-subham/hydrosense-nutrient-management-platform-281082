import React, { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import { useAppStore } from '../state/StoreProvider';
import { getFeatureFlags } from '../utils/featureFlags';

const LS_KEY = 'hydrosense.preferences.v1';

/**
 * PUBLIC_INTERFACE
 * Settings
 * Allows user to change units, live updates, and view feature flags. Preferences persist in localStorage.
 */
export default function Settings() {
  const { preferences, setPreference } = useAppStore();
  const flags = getFeatureFlags();
  const [units, setUnits] = useState(preferences.units || 'metric');
  const [live, setLive] = useState(Boolean(preferences.liveUpdates));

  // Load initial from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          if (parsed.units) setUnits(parsed.units);
          if (typeof parsed.liveUpdates === 'boolean') setLive(parsed.liveUpdates);
        }
      }
    } catch (_e) {
      // ignore storage errors
    }
  }, []);

  // Persist changes
  useEffect(() => {
    setPreference('units', units);
    setPreference('liveUpdates', live);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ units, liveUpdates: live }));
    } catch (_e) {
      // ignore storage errors
    }
  }, [units, live, setPreference]);

  return (
    <div>
      <h2 style={{ marginTop: 0, color: 'var(--color-text)' }}>Settings</h2>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        <Card title="Preferences">
          <div style={{ display: 'grid', gap: 10 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span>Units</span>
              <select
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                aria-label="Units"
                style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)' }}
              >
                <option value="metric">Metric</option>
                <option value="imperial">Imperial</option>
              </select>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={live} onChange={(e) => setLive(e.target.checked)} />
              Enable live updates
            </label>
          </div>
        </Card>

        <Card title="Feature Flags">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6 }}>
            {Object.keys(flags).length === 0 && <li>No feature flags provided.</li>}
            {Object.entries(flags).map(([k, v]) => (
              <li key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{k}</span>
                <span style={{ color: v ? 'var(--color-success)' : 'var(--color-secondary)' }}>
                  {v ? 'enabled' : 'disabled'}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
