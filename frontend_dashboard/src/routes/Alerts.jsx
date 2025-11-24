import React, { useMemo, useState } from 'react';
import Card from '../components/common/Card';
import { useAlerts } from '../api/hooks/useAlerts';

export default function Alerts() {
  const { alerts, loading, error, acknowledge } = useAlerts();
  const [severity, setSeverity] = useState('all');
  const [showAck, setShowAck] = useState(true);

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (severity !== 'all' && a.severity !== severity) return false;
      if (!showAck && a.acknowledged) return false;
      return true;
    });
  }, [alerts, severity, showAck]);

  return (
    <div>
      <h2 style={{ marginTop: 0, color: 'var(--color-text)' }}>Alerts</h2>
      <Card
        title="Alert Feed"
        footer={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label>
              <span style={{ marginRight: 8 }}>Severity</span>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)' }}
                aria-label="Filter by severity"
              >
                <option value="all">All</option>
                <option value="error">Error</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={showAck} onChange={(e) => setShowAck(e.target.checked)} />
              Show acknowledged
            </label>
          </div>
        }
      >
        {loading && <div aria-busy="true">Loading alerts…</div>}
        {error && <div role="alert" style={{ color: 'var(--color-error)' }}>Failed to load alerts.</div>}
        {!loading && !error && (
          <div style={{ display: 'grid', gap: 12 }}>
            {filtered.length === 0 && <div>No alerts match current filters.</div>}
            {filtered.map((a) => (
              <div
                key={a.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  padding: '10px 12px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  borderRadius: 10,
                  background:
                    a.severity === 'error'
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
