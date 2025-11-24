//
// PUBLIC_INTERFACE
// store.js
// In-memory store that holds mock app state. Provides get/set/update APIs and a
// subscription mechanism for lightweight state change notifications.
//

import {
  initialSensors,
  initialCrops,
  initialControls,
  initialIntegrations,
  initialAlerts,
} from './dataSeed';

const HISTORY_LIMIT = 120; // small ring buffer per sensor

const state = {
  sensors: initialSensors.map((s) => ({ ...s, history: [...(s.history || [])] })),
  crops: [...initialCrops],
  controls: { ...initialControls },
  integrations: [...initialIntegrations],
  alerts: [...initialAlerts],
};

const subscribers = new Set();

// Notify subscribers with shallow copy to avoid external mutation
function notify() {
  const snapshot = {
    ...state,
    sensors: state.sensors.map((s) => ({ ...s, history: [...s.history] })),
    crops: [...state.crops],
    controls: { ...state.controls },
    integrations: [...state.integrations],
    alerts: [...state.alerts],
  };
  subscribers.forEach((fn) => {
    try {
      fn(snapshot);
    } catch (_e) {
      // keep other listeners running
    }
  });
}

/**
 * PUBLIC_INTERFACE
 * getState
 * Returns a read-only snapshot of the current store.
 */
export function getState() {
  return {
    ...state,
    sensors: state.sensors.map((s) => ({ ...s, history: [...s.history] })),
    crops: [...state.crops],
    controls: { ...state.controls },
    integrations: [...state.integrations],
    alerts: [...state.alerts],
  };
}

/**
 * PUBLIC_INTERFACE
 * subscribe
 * Subscribe to store changes. Returns an unsubscribe function.
 */
export function subscribe(listener) {
  if (typeof listener !== 'function') return () => {};
  subscribers.add(listener);
  return () => subscribers.delete(listener);
}

/**
 * PUBLIC_INTERFACE
 * updateSensorValue
 * Updates a sensor's value and appends to its history with timestamp.
 */
export function updateSensorValue(sensorId, value) {
  const idx = state.sensors.findIndex((s) => s.id === sensorId);
  if (idx === -1 || typeof value !== 'number' || Number.isNaN(value)) return;
  const sensor = state.sensors[idx];
  const updatedAt = Date.now();
  sensor.value = value;
  sensor.updatedAt = updatedAt;
  sensor.history.push({ t: updatedAt, v: value });
  if (sensor.history.length > HISTORY_LIMIT) {
    sensor.history.splice(0, sensor.history.length - HISTORY_LIMIT);
  }
  notify();
}

/**
 * PUBLIC_INTERFACE
 * pushAlert
 * Adds a new alert object to the store.
 */
export function pushAlert(alert) {
  if (!alert || typeof alert !== 'object') return;
  const record = {
    id: alert.id || `alert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: Date.now(),
    acknowledged: false,
    ...alert,
  };
  state.alerts.unshift(record);
  // Keep a reasonable limit to avoid unbounded growth in long sessions
  if (state.alerts.length > 200) state.alerts.length = 200;
  notify();
}

/**
 * PUBLIC_INTERFACE
 * acknowledgeAlert
 * Marks an alert as acknowledged.
 */
export function acknowledgeAlert(alertId) {
  const a = state.alerts.find((x) => x.id === alertId);
  if (a) {
    a.acknowledged = true;
    notify();
  }
}

/**
 * PUBLIC_INTERFACE
 * getSensors
 * Returns a copy of sensors state.
 */
export function getSensors() {
  return getState().sensors;
}

/**
 * PUBLIC_INTERFACE
 * getAlerts
 * Returns a copy of alerts list.
 */
export function getAlerts() {
  return [...state.alerts];
}

/**
 * PUBLIC_INTERFACE
 * getControls
 * Returns controls status.
 */
export function getControls() {
  return { ...state.controls };
}

/**
 * PUBLIC_INTERFACE
 * setControl
 * Sets a control's status or properties.
 */
export function setControl(key, value) {
  state.controls[key] = { ...(state.controls[key] || {}), ...value };
  notify();
}

/**
 * PUBLIC_INTERFACE
 * getIntegrations
 * Returns integrations state.
 */
export function getIntegrations() {
  return [...state.integrations];
}
