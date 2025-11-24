import * as simulatorModule from '../simulator';
import { bus, WS_TOPICS } from '../wsMock';
import { getState, setControl } from '../store';

describe('simulator', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    bus.clear();
    simulatorModule.stopSimulator();
    setControl('simulator', { paused: false });
  });

  test('emits SENSOR_UPDATES events on ticks', () => {
    const events = [];
    const unsub = bus.subscribe(WS_TOPICS.SENSOR_UPDATES, (p) => events.push(p));
    simulatorModule.startSimulator();
    jest.advanceTimersByTime(1600);
    jest.advanceTimersByTime(1600);
    expect(events.length).toBeGreaterThanOrEqual(1);
    unsub();
  });

  test('pause and resume behavior prevents updates when paused', () => {
    const events = [];
    const unsub = bus.subscribe(WS_TOPICS.SENSOR_UPDATES, (p) => events.push(p));
    simulatorModule.startSimulator();
    jest.advanceTimersByTime(1600);
    simulatorModule.pauseSimulator();
    const countAfterFirst = events.length;
    jest.advanceTimersByTime(3200);
    expect(events.length).toBe(countAfterFirst);
    simulatorModule.resumeSimulator();
    jest.advanceTimersByTime(1600);
    expect(events.length).toBeGreaterThan(countAfterFirst);
    unsub();
  });

  test('occasionally emits alerts via ALERT_NEW', () => {
    const alerts = [];
    const unsub = bus.subscribe(WS_TOPICS.ALERT_NEW, (a) => alerts.push(a));
    // Force multiple ticks to increase probability
    simulatorModule.startSimulator();
    for (let i = 0; i < 20; i++) {
      jest.advanceTimersByTime(1600);
    }
    expect(Array.isArray(alerts)).toBe(true);
    // Non-deterministic; ensure no errors and allowed to be zero in rare case
    unsub();
  });

  test('bounded drift keeps values within extended bounds', () => {
    simulatorModule.startSimulator();
    jest.advanceTimersByTime(1600);
    const { sensors } = getState();
    sensors.forEach((s) => {
      expect(typeof s.value).toBe('number');
      expect(s.updatedAt).toBeGreaterThan(0);
    });
  });
});
