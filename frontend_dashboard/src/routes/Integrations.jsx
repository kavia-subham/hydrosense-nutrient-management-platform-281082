import React from 'react';
import Card from '../components/common/Card';
import { useIntegrations } from '../api/hooks/useIntegrations';

export default function Integrations() {
  const { integrations, loading, error } = useIntegrations();

  return (
    <div>
      <h2 style={{ marginTop: 0, color: 'var(--color-text)' }}>Integrations</h2>
      <Card title="Connected Systems">
        {loading && <div aria-busy="true">Loading integrations…</div>}
        {error && <div role="alert" style={{ color: 'var(--color-error)' }}>Failed to load integrations.</div>}
        {!loading && !error && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
            {integrations.map((i) => (
              <li key={i.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    border: '1px solid rgba(0,0,0,0.06)',
                    borderRadius: 10,
                    background: 'var(--color-surface)',
                  }}>
                <span>{i.name}</span>
                <span style={{ color: i.status === 'connected' ? 'var(--color-success)' : 'var(--color-secondary)' }}>
                  {i.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
