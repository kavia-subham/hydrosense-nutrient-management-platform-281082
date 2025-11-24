import React, { useMemo, useState } from 'react';
import Card from '../components/common/Card';
import { useControls } from '../api/hooks/useControls';
import { useSensors } from '../api/hooks/useSensors';
import { bus, WS_TOPICS } from '../mocks/wsMock';
import { updateSensorValue } from '../mocks/store';

/**
 * PUBLIC_INTERFACE
 * Controls
 * Forms to update targets (conceptual), toggle subsystems, and simulate manual dosing which nudges EC and pH readings.
 */
export default function Controls() {
  const { controls, set } = useControls();
  const { sensors } = useSensors();
  const [doseMl, setDoseMl] = useState(5);
  const [acidMl, setAcidMl] = useState(2);

  const ecSensor = useMemo(() => sensors.find((s) => s.type === 'EC'), [sensors]);
  const phSensor = useMemo(() => sensors.find((s) => s.type === 'PH'), [sensors]);

  const applyDose = (e) => {
    e.preventDefault();
    // Simulate impact: EC rises slightly, pH drifts down a bit with acid
    if (ecSensor) {
      const bump = Math.min(0.5, doseMl / 100); // 0.05 for 5ml
      updateSensorValue(ecSensor.id, ecSensor.value + bump);
      bus.publish(WS_TOPICS.SENSOR_UPDATES, { id: ecSensor.id, value: ecSensor.value + bump, updatedAt: Date.now() });
    }
    if (phSensor) {
      const drop = Math.min(0.4, acidMl / 100); // small drop
      updateSensorValue(phSensor.id, Math.max(0, phSensor.value - drop));
      bus.publish(WS_TOPICS.SENSOR_UPDATES, { id: phSensor.id, value: phSensor.value - drop, updatedAt: Date.now() });
    }
  };

  return (
    <div>
      <h2 style={{ marginTop: 0, color: 'var(--color-text)' }}>Controls</h2>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        <Card title="Subsystems">
          <div style={{ display: 'grid', gap: 8 }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Dosing Pump</span>
              <select
                value={controls?.dosingPump?.status || 'idle'}
                onChange={(e) => set('dosingPump', { status: e.target.value })}
                aria-label="Dosing pump status"
                style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)' }}
              >
                <option value="idle">idle</option>
                <option value="running">running</option>
                <option value="paused">paused</option>
              </select>
            </label>

            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Circulation</span>
              <select
                value={controls?.circulation?.status || 'running'}
                onChange={(e) => set('circulation', { status: e.target.value })}
                aria-label="Circulation status"
                style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)' }}
              >
                <option value="running">running</option>
                <option value="stopped">stopped</option>
              </select>
            </label>

            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Simulator</span>
              <select
                value={controls?.simulator?.paused ? 'paused' : 'active'}
                onChange={(e) => set('simulator', { paused: e.target.value === 'paused' })}
                aria-label="Simulator state"
                style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)' }}
              >
                <option value="active">active</option>
                <option value="paused">paused</option>
              </select>
            </label>
          </div>
        </Card>

        <Card title="Manual Dosing">
          <form onSubmit={applyDose} style={{ display: 'grid', gap: 10 }}>
            <label>
              <div>EC Nutrient dose (ml)</div>
              <input
                type="number"
                min="0"
                step="1"
                value={doseMl}
                onChange={(e) => setDoseMl(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)' }}
              />
            </label>
            <label>
              <div>pH Down (acid) (ml)</div>
              <input
                type="number"
                min="0"
                step="1"
                value={acidMl}
                onChange={(e) => setAcidMl(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)' }}
              />
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
              Apply Dose
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
