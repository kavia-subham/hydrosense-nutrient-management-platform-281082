import { act, renderHook } from '@testing-library/react';
import { bus, WS_TOPICS } from '../../../mocks/wsMock';
import { pushAlert, getAlerts } from '../../../mocks/store';
import { useAlerts } from '../useAlerts';

describe('useAlerts', () => {
  afterEach(() => {
    bus.clear();
  });

  test('exposes alerts and acknowledge action updates store', () => {
    // seed one alert
    act(() => {
      pushAlert({ title: 'Seed', severity: 'info', message: 'hello' });
    });
    const { result } = renderHook(() => useAlerts());
    expect(result.current.loading).toBe(false);
    expect(Array.isArray(result.current.alerts)).toBe(true);
    const first = result.current.alerts[0];
    act(() => {
      result.current.acknowledge(first.id);
    });
    const updated = getAlerts().find((a) => a.id === first.id);
    expect(updated.acknowledged).toBe(true);
  });

  test('receives new alerts via bus', () => {
    const { result } = renderHook(() => useAlerts());
    const before = result.current.alerts.length;
    act(() => {
      const a = { title: 'New', severity: 'warning', message: 'warn' };
      pushAlert(a);
      bus.publish(WS_TOPICS.ALERT_NEW, a);
    });
    expect(result.current.alerts.length).toBeGreaterThan(before);
  });
});
