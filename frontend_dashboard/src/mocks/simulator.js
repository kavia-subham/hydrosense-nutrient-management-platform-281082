//
//
// PUBLIC_INTERFACE
// simulator.js
// Simulates realtime updates for sensors with bounded drift and random alerts.
// Publishes events through the wsMock bus and writes to the in-memory store.
// Now supports additional sensors (DO, ORP) and crop-stage-specific thresholds.
//
import { bus, WS_TOPICS } from './wsMock';
import {
  getState,
  updateSensorValue,
  pushAlert,
  setControl,
  getCrops,
} from './store';
import { DEFAULT_THRESHOLDS, alertTemplates, SENSOR_TYPES } from './dataSeed';

let intervalId = null;

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function pickThreshold(sensor, cropsList) {
  // Prefer crop-stage targets if available; fall back to defaults for sensor type
  const crop = cropsList.find((c) => c.id === sensor.cropId);
  if (crop && crop.stages && (sensor.stage || crop.defaultStage)) {
    const stage = sensor.stage || crop.defaultStage;
    const byType = crop.stages[stage] || {};
    const t = byType[sensor.type];
    if (t) return t;
  }
  // Fallback defaults by type
  switch (sensor.type) {
    case SENSOR_TYPES.EC:
      return DEFAULT_THRESHOLDS.EC;
    case SENSOR_TYPES.PH:
      return DEFAULT_THRESHOLDS.PH;
    case SENSOR_TYPES.TEMP:
      return DEFAULT_THRESHOLDS.TEMP;
    case SENSOR_TYPES.DO:
      return DEFAULT_THRESHOLDS.DO;
    case SENSOR_TYPES.ORP:
      return DEFAULT_THRESHOLDS.ORP;
    default:
      return { min: 0, max: 100, unit: '' };
  }
}

function boundedDrift(value, { min, max }, drift = 0.05) {
  const step = (Math.random() - 0.5) * 2 * drift; // ± drift
  const next = value + step;
  return clamp(next, min - drift * 6, max + drift * 6);
}

function maybeCreateAlert(sensor, thresholds) {
  const t = thresholds;
  const { value } = sensor;
  const outOfRange = value < t.min || value > t.max;

  if (!outOfRange) {
    // Occasionally create an info alert about drift for PH and ORP
    if ((sensor.type === SENSOR_TYPES.PH || sensor.type === SENSOR_TYPES.ORP) && Math.random() < 0.06) {
      const alertObj =
        sensor.type === SENSOR_TYPES.PH ? alertTemplates.PH_DRIFT(value, t) : alertTemplates.ORP_OUT_OF_RANGE(value, t);
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
    } else if (sensor.type === SENSOR_TYPES.DO) {
      if (value < t.min) alertObj = alertTemplates.DO_LOW(value, t);
    } else if (sensor.type === SENSOR_TYPES.ORP) {
      alertObj = alertTemplates.ORP_OUT_OF_RANGE(value, t);
    } else {
      alertObj = alertTemplates.PH_DRIFT(value, t);
    }
    if (alertObj) {
      pushAlert(alertObj);
      bus.publish(WS_TOPICS.ALERT_NEW, alertObj);
    }
  }
}

function tick() {
  const { sensors, controls } = getState();
  if (controls.simulator?.paused) return;

  const crops = getCrops();

  sensors.forEach((s) => {
    const thresholds = pickThreshold(s, crops);

    const drift =
      s.type === SENSOR_TYPES.TEMP
        ? 0.15
        : s.type === SENSOR_TYPES.EC
        ? 0.07
        : s.type === SENSOR_TYPES.DO
        ? 0.08
        : s.type === SENSOR_TYPES.ORP
        ? 2.5 // mV jitter magnitude
        : 0.04;

    const next = boundedDrift(s.value, thresholds, drift);
    updateSensorValue(s.id, next);

    const payload = { id: s.id, value: next, updatedAt: Date.now() };
    bus.publish(WS_TOPICS.SENSOR_UPDATES, payload);

    // Maybe produce an alert if out of range or drifting
    maybeCreateAlert({ ...s, value: next }, thresholds);
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
