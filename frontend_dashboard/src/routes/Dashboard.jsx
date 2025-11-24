import React from 'react';
import Card from '../components/common/Card';
import { useSensors } from '../api/hooks/useSensors';
import { useAlerts } from '../api/hooks/useAlerts';
import { useControls } from '../api/hooks/useControls';

export default function Dashboard() {
  const { sensors } = useSensors();
  const { alerts } = useAlerts();
  const { controls } = useControls();

  const latest = sensors.slice(0, 3);

  return (
    <div>
      <h2 style={{ marginTop: 0, color: 'var(--color-text)' }}>Dashboard</h2>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        <Card title="Live Status">
          <div style={{ display: 'grid', gap: 8 }}>
            {latest.map((s) => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{s.name}</span>
                <strong style={{ color: 'var(--color-primary)' }}>
                  {s.value.toFixed(s.type === 'TEMP' ? 1 : 2)} {s.unit}
                </strong>
              </div>
            ))}
            {latest.length === 0 && <div>No sensors available.</div>}
          </div>
        </Card>
        <Card title="Recent Alerts">
          <div style={{ display: 'grid', gap: 8 }}>
            {alerts.slice(0, 5).map((a) => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{a.title}</span>
                <span style={{ color: 'var(--color-secondary)' }}>
                  {new Date(a.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))}
            {alerts.length === 0 && <div>No recent alerts.</div>}
          </div>
        </Card>
        <Card title="Quick Actions">
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Dosing Pump</span>
              <span style={{ color: controls?.dosingPump?.status === 'running' ? 'var(--color-success)' : 'var(--color-secondary)' }}>
                {controls?.dosingPump?.status || 'unknown'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Circulation</span>
              <span style={{ color: controls?.circulation?.status === 'running' ? 'var(--color-success)' : 'var(--color-secondary)' }}>
                {controls?.circulation?.status || 'unknown'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
