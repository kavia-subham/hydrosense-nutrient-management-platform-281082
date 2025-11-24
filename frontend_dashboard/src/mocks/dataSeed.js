//
// PUBLIC_INTERFACE
// dataSeed.js
// Provides initial in-memory seed data for the mock data layer. Includes sensors,
// crops, thresholds, alert templates, and integrations. Easily extensible.
//

export const SENSOR_TYPES = Object.freeze({
  EC: 'EC',
  PH: 'PH',
  TEMP: 'TEMP',
});

export const DEFAULT_THRESHOLDS = Object.freeze({
  EC: { min: 1.2, max: 2.4, unit: 'mS/cm' },
  PH: { min: 5.5, max: 6.5, unit: 'pH' },
  TEMP: { min: 18, max: 26, unit: '°C' },
});

export const initialSensors = [
  {
    id: 'sensor-ec-1',
    name: 'EC Sensor A',
    type: SENSOR_TYPES.EC,
    value: 1.8,
    unit: DEFAULT_THRESHOLDS.EC.unit,
    updatedAt: Date.now(),
    history: [],
  },
  {
    id: 'sensor-ph-1',
    name: 'pH Sensor A',
    type: SENSOR_TYPES.PH,
    value: 6.1,
    unit: DEFAULT_THRESHOLDS.PH.unit,
    updatedAt: Date.now(),
    history: [],
  },
  {
    id: 'sensor-temp-1',
    name: 'Solution Temp A',
    type: SENSOR_TYPES.TEMP,
    value: 22.2,
    unit: DEFAULT_THRESHOLDS.TEMP.unit,
    updatedAt: Date.now(),
    history: [],
  },
];

export const initialCrops = [
  {
    id: 'crop-lettuce',
    name: 'Butterhead Lettuce',
    targets: {
      EC: { min: 1.4, max: 1.8, unit: 'mS/cm' },
      PH: { min: 5.8, max: 6.2, unit: 'pH' },
      TEMP: { min: 20, max: 24, unit: '°C' },
    },
  },
  {
    id: 'crop-basil',
    name: 'Genovese Basil',
    targets: {
      EC: { min: 1.6, max: 2.2, unit: 'mS/cm' },
      PH: { min: 5.5, max: 6.5, unit: 'pH' },
      TEMP: { min: 21, max: 26, unit: '°C' },
    },
  },
];

export const initialControls = {
  dosingPump: { id: 'ctrl-dosing-1', status: 'idle' }, // idle, running, paused
  circulation: { id: 'ctrl-circ-1', status: 'running' }, // running, stopped
  simulator: { paused: false },
};

export const alertTemplates = {
  EC_HIGH: (value, threshold) => ({
    severity: 'warning',
    title: 'EC Above Target',
    message: `Electrical conductivity at ${value.toFixed(
      2
    )} ${DEFAULT_THRESHOLDS.EC.unit} exceeds max ${threshold.max} ${threshold.unit}.`,
  }),
  EC_LOW: (value, threshold) => ({
    severity: 'warning',
    title: 'EC Below Target',
    message: `Electrical conductivity at ${value.toFixed(
      2
    )} ${DEFAULT_THRESHOLDS.EC.unit} is below min ${threshold.min} ${threshold.unit}.`,
  }),
  PH_DRIFT: (value, threshold) => ({
    severity: 'info',
    title: 'pH Drift Detected',
    message: `pH at ${value.toFixed(2)} outside ideal range ${threshold.min}-${threshold.max}.`,
  }),
  TEMP_OUT_OF_RANGE: (value, threshold) => ({
    severity: 'warning',
    title: 'Temperature Out of Range',
    message: `Solution temp at ${value.toFixed(
      1
    )} ${threshold.unit} outside ${threshold.min}-${threshold.max}.`,
  }),
};

export const initialAlerts = [];

export const initialIntegrations = [
  { id: 'int-slack', name: 'Slack', status: 'connected' },
  { id: 'int-webhook', name: 'Webhook', status: 'connected' },
  { id: 'int-sms', name: 'SMS Provider', status: 'disconnected' },
];
