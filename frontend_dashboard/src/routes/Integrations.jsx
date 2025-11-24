import React, { useMemo, useState } from 'react';
import Card from '../components/common/Card';
import { useIntegrations } from '../api/hooks/useIntegrations';
import { getState } from '../mocks/store';

export default function Integrations() {
  const { integrations, loading, error, refresh } = useIntegrations();
  const [name, setName] = useState('');
  const [status, setStatus] = useState('connected');

  // lightweight in-place mutation via store reference (demo-only)
  const store = useMemo(() => {
    // Not exported mutators for CRUD; we piggyback state for mock demo
    return getState();
  }, []);

  const addIntegration = (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      store.integrations.push({ id: `int-${Date.now()}`, name, status });
      refresh();
      setName('');
    } catch (_e) {
      // ignore
    }
  };

  const toggleStatus = (id) => {
    const item = store.integrations.find((x) => x.id === id);
    if (item) {
      item.status = item.status === 'connected' ? 'disconnected' : 'connected';
      refresh();
    }
  };

  const remove = (id) => {
    const idx = store.integrations.findIndex((x) => x.id === id);
    if (idx >= 0) {
      store.integrations.splice(idx, 1);
      refresh();
    }
  };

  return (
    <div>
      <h2 style={{ marginTop: 0, color: 'var(--color-text)' }}>Integrations</h2>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '2fr 1fr' }}>
        <Card title="Connected Systems">
          {loading && <div aria-busy="true">Loading integrations…</div>}
          {error && <div role="alert" style={{ color: 'var(--color-error)' }}>Failed to load integrations.</div>}
          {!loading && !error && (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
              {integrations.map((i) => (
                <li key={i.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto auto',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 12px',
                      border: '1px solid rgba(0,0,0,0.06)',
                      borderRadius: 10,
                      background: 'var(--color-surface)',
                    }}>
                  <span>{i.name}</span>
                  <button
                    onClick={() => toggleStatus(i.id)}
                    style={{
                      background: i.status === 'connected' ? 'var(--color-success)' : 'var(--color-secondary)',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: 8,
                      cursor: 'pointer',
                    }}
                    aria-label={`Toggle status for ${i.name}`}
                  >
                    {i.status}
                  </button>
                  <button
                    onClick={() => remove(i.id)}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(0,0,0,0.12)',
                      padding: '6px 10px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      color: 'var(--color-secondary)',
                    }}
                    aria-label={`Remove ${i.name}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Add Integration">
          <form onSubmit={addIntegration} style={{ display: 'grid', gap: 8 }}>
            <label>
              <div>Name</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Slack"
                style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)' }}
              />
            </label>
            <label>
              <div>Status</div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)' }}
              >
                <option value="connected">connected</option>
                <option value="disconnected">disconnected</option>
              </select>
            </label>
            <button
              type="submit"
              style={{
                background: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                padding: '8px 12px',
                borderRadius: 10,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-soft)',
              }}
            >
              Add
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
