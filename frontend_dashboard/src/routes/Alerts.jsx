import React from 'react';
import Card from '../components/common/Card';
import { useAlerts } from '../api/hooks/useAlerts';

export default function Alerts() {
  const { alerts, loading, error, acknowledge } = useAlerts();

  return (
    <div>
      <h2 style={{ marginTop: 0, color: 'var(--color-text)' }}>Alerts</h2>
      <Card title="Alert Feed">
        {loading && <div aria-busy="true">Loading alerts…</div>}
        {error && <div role="alert" style={{ color: 'var(--color-error)' }}>Failed to load alerts.</div>}
        {!loading && !error && (
          <div style={{ display: 'grid', gap: 12 }}>
            {alerts.length === 0 && <div>No alerts yet. Everything looks good.</div>}
            {alerts.map((a) => (
              <div
                key={a.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  padding: '10px 12px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  borderRadius: 10,
                  background: a.severity === 'error'
                    ? 'rgba(239, 68, 68, 0.06)'
                    : a.severity === 'warning'
                    ? 'rgba(245, 158, 11, 0.08)'
                    : 'rgba(139, 92, 246, 0.06)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>
                    {new Date(a.createdAt).toLocaleString()}
                  </div>
                  <div style={{ marginTop: 4 }}>{a.message}</div>
                </div>
                <div>
                  {!a.acknowledged ? (
                    <button
                      onClick={() => acknowledge(a.id)}
                      style={{
                        background: 'var(--color-primary)',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: 8,
                        cursor: 'pointer',
                      }}
                    >
                      Acknowledge
                    </button>
                  ) : (
                    <span style={{ color: 'var(--color-secondary)' }}>Acknowledged</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
