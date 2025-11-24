//
// PUBLIC_INTERFACE
// simulator.js
// Simulates realtime updates for sensors with bounded drift and random alerts.
// Publishes events through the wsMock bus and writes to the in-memory store.
//

import { bus, WS_TOPICS } from './wsMock';
import {
  getState,
  updateSensorValue,
  pushAlert,
  setControl,
} from './store';
import { DEFAULT_THRESHOLDS, alertTemplates, SENSOR_TYPES } from './dataSeed';

let intervalId = null;

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function boundedDrift(value, { min, max }, drift = 0.05) {
  const step = (Math.random() - 0.5) * 2 * drift; // ± drift
  const next = value + step;
  return clamp(next, min - drift * 6, max + drift * 6);
}

function maybeCreateAlert(sensor) {
  const t =
    sensor.type === SENSOR_TYPES.EC
      ? DEFAULT_THRESHOLDS.EC
      : sensor.type === SENSOR_TYPES.PH
      ? DEFAULT_THRESHOLDS.PH
      : DEFAULT_THRESHOLDS.TEMP;

  const { value } = sensor;
  const outOfRange = value < t.min || value > t.max;

  if (!outOfRange) {
    // Occasionally create an info alert about drift for PH
    if (sensor.type === SENSOR_TYPES.PH && Math.random() < 0.06) {
      const alertObj = alertTemplates.PH_DRIFT(value, t);
      pushAlert(alertObj);
      bus.publish(WS_TOPICS.ALERT_NEW, alertObj);
    }
    return;
  }

  // Randomly decide to emit alert when out-of-range to avoid spamming
  if (Math.random() < 0.5) {
    let alertObj;
    if (sensor.type === SENSOR_TYPES.EC) {
      alertObj = value > t.max ? alertTemplates.EC_HIGH(value, t) : alertTemplates.EC_LOW(value, t);
    } else if (sensor.type === SENSOR_TYPES.TEMP) {
      alertObj = alertTemplates.TEMP_OUT_OF_RANGE(value, t);
    } else {
      alertObj = alertTemplates.PH_DRIFT(value, t);
    }
    pushAlert(alertObj);
    bus.publish(WS_TOPICS.ALERT_NEW, alertObj);
  }
}

function tick() {
  const { sensors, controls } = getState();
  if (controls.simulator?.paused) return;

  sensors.forEach((s) => {
    const thresholds =
      s.type === SENSOR_TYPES.EC
        ? DEFAULT_THRESHOLDS.EC
        : s.type === SENSOR_TYPES.PH
        ? DEFAULT_THRESHOLDS.PH
        : DEFAULT_THRESHOLDS.TEMP;

    const drift = s.type === SENSOR_TYPES.TEMP ? 0.15 : s.type === SENSOR_TYPES.EC ? 0.07 : 0.04;

    const next = boundedDrift(s.value, thresholds, drift);
    updateSensorValue(s.id, next);

    const payload = { id: s.id, value: next, updatedAt: Date.now() };
    bus.publish(WS_TOPICS.SENSOR_UPDATES, payload);

    // Maybe produce an alert if out of range or drifting
    maybeCreateAlert({ ...s, value: next });
  });

  // Occasionally toggle controls status to simulate system state changes
  if (Math.random() < 0.03) {
    const running = Math.random() > 0.5 ? 'running' : 'idle';
    setControl('dosingPump', { status: running });
    bus.publish(WS_TOPICS.CONTROLS_STATUS, { key: 'dosingPump', status: running });
  }
}

/**
 * PUBLIC_INTERFACE
 * startSimulator
 * Begins the realtime simulation loop. Safe to call multiple times.
 */
export function startSimulator() {
  if (intervalId) return;
  intervalId = setInterval(tick, 1500);
}

/**
 * PUBLIC_INTERFACE
 * stopSimulator
 * Stops the realtime simulation loop.
 */
export function stopSimulator() {
  if (!intervalId) return;
  clearInterval(intervalId);
  intervalId = null;
}

/**
 * PUBLIC_INTERFACE
 * pauseSimulator
 * Pauses updates via control flag.
 */
export function pauseSimulator() {
  setControl('simulator', { paused: true });
}

/**
 * PUBLIC_INTERFACE
 * resumeSimulator
 * Resumes updates via control flag.
 */
export function resumeSimulator() {
  setControl('simulator', { paused: false });
}

// Auto-start in module scope to ensure live data without manual wiring in UI.
startSimulator();
