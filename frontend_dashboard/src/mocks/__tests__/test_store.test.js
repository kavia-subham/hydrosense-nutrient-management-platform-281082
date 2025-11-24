import {
  getState,
  subscribe,
  updateSensorValue,
  pushAlert,
  acknowledgeAlert,
  getSensors,
  getAlerts,
  getControls,
  setControl,
  getIntegrations,
} from '../store';

describe('mock store', () => {
  test('get and set operations reflect in state', () => {
    const before = getState();
    expect(Array.isArray(before.sensors)).toBe(true);
    const subCalls = [];
    const unsub = subscribe((snap) => subCalls.push(snap));
    setControl('dosingPump', { status: 'running' });
    const controls = getControls();
    expect(controls.dosingPump.status).toBe('running');
    expect(subCalls.length).toBeGreaterThanOrEqual(1);
    unsub();
  });

  test('updateSensorValue appends history with cap', () => {
    const sensor = getSensors()[0];
    // push more than HISTORY_LIMIT updates
    for (let i = 0; i < 150; i++) {
      updateSensorValue(sensor.id, sensor.value + i * 0.001);
    }
    const updated = getSensors().find((s) => s.id === sensor.id);
    expect(updated.history.length).toBeLessThanOrEqual(120); // HISTORY_LIMIT
    expect(updated.updatedAt).toBeGreaterThan(0);
  });

  test('alerts push and acknowledge', () => {
    const beforeCount = getAlerts().length;
    pushAlert({ title: 'test', severity: 'info', message: 'hello' });
    const alerts = getAlerts();
    expect(alerts.length).toBeGreaterThan(beforeCount);
    const first = alerts[0];
    expect(first.acknowledged).toBe(false);
    acknowledgeAlert(first.id);
    const updated = getAlerts().find((a) => a.id === first.id);
    expect(updated.acknowledged).toBe(true);
  });

  test('getIntegrations returns shallow copy', () => {
    const ints = getIntegrations();
    expect(Array.isArray(ints)).toBe(true);
    if (ints.length) {
      const nameBefore = ints[0].name;
      ints[0].name = 'mutated';
      const fresh = getIntegrations();
      expect(fresh[0].name).toBe(nameBefore);
    }
  });
});
