import React, { useMemo } from 'react';
import Card from '../components/common/Card';
import { useSensors } from '../api/hooks/useSensors';
import { useAlerts } from '../api/hooks/useAlerts';
import { useControls } from '../api/hooks/useControls';
import Sparkline from '../components/common/Sparkline';
import DriftIndicator from '../components/diagnostics/DriftIndicator';

export default function Dashboard() {
  const { sensors } = useSensors();
  const { alerts } = useAlerts();
  const { controls } = useControls();

  // Choose representative sensors; auto-include DO/ORP if present
  const ec = useMemo(() => sensors.find((s) => s.type === 'EC'), [sensors]);
  const ph = useMemo(() => sensors.find((s) => s.type === 'PH'), [sensors]);
  const temp = useMemo(() => sensors.find((s) => s.type === 'TEMP'), [sensors]);
  const doSensor = useMemo(() => sensors.find((s) => s.type === 'DO'), [sensors]);
  const orp = useMemo(() => sensors.find((s) => s.type === 'ORP'), [sensors]);

  const kpis = useMemo(
    () =>
      [
        ec && { key: 'EC', name: ec.name, value: ec.value, unit: ec.unit, history: ec.history, type: ec.type },
        ph && { key: 'PH', name: ph.name, value: ph.value, unit: ph.unit, history: ph.history, type: ph.type },
        temp && { key: 'TEMP', name: temp.name, value: temp.value, unit: temp.unit, history: temp.history, type: temp.type },
        doSensor && { key: 'DO', name: doSensor.name, value: doSensor.value, unit: doSensor.unit, history: doSensor.history, type: doSensor.type },
        orp && { key: 'ORP', name: orp.name, value: orp.value, unit: orp.unit, history: orp.history, type: orp.type },
      ].filter(Boolean),
    [ec, ph, temp, doSensor, orp]
  );

  return (
    <div>
      <h2 style={{ marginTop: 0, color: 'var(--color-text)' }}>Dashboard</h2>

      {/* KPI tiles */}
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', marginBottom: 16 }}>
        {kpis.map((k) => (
          <Card
            key={k.key}
            title={k.name}
            style={{ background: 'linear-gradient(180deg, #fff, var(--color-bg))' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div>
                <div aria-label={`${k.key} value`} style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-primary)' }}>
                  {k.value.toFixed(k.type === 'TEMP' ? 1 : k.type === 'ORP' ? 0 : 2)} {k.unit}
                </div>
                <div style={{ marginTop: 6 }}>
                  <DriftIndicator history={k.history} sensorType={k.type} unit={k.unit} />
                </div>
              </div>
              <Sparkline
                values={k.history}
                width={160}
                height={44}
                fill="var(--color-primary)"
                aria-label={`${k.key} trend`}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Lists */}
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        <Card title="Recent Alerts">
          <div style={{ display: 'grid', gap: 8 }}>
            {alerts.slice(0, 6).map((a) => (
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
        <Card title="System Status">
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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Simulator</span>
              <span style={{ color: 'var(--color-secondary)' }}>
                {controls?.simulator?.paused ? 'paused' : 'active'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
