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
  DO: 'DO', // Dissolved Oxygen
  ORP: 'ORP', // Oxidation Reduction Potential
});

export const DEFAULT_THRESHOLDS = Object.freeze({
  EC: { min: 1.2, max: 2.4, unit: 'mS/cm' },
  PH: { min: 5.5, max: 6.5, unit: 'pH' },
  TEMP: { min: 18, max: 26, unit: '°C' },
  DO: { min: 5.0, max: 10.0, unit: 'mg/L' },
  ORP: { min: 250, max: 450, unit: 'mV' },
});

// Greenhouses and zones for richer topology
export const initialSites = [
  { id: 'gh-1', name: 'Greenhouse Alpha' },
  { id: 'gh-2', name: 'Greenhouse Beta' },
];
export const initialZones = [
  { id: 'z-1', name: 'Zone A', greenhouseId: 'gh-1' },
  { id: 'z-2', name: 'Zone B', greenhouseId: 'gh-1' },
  { id: 'z-3', name: 'Zone C', greenhouseId: 'gh-2' },
];

// Seed sensors across zones with per-sensor metadata
export const initialSensors = [
  {
    id: 'sensor-ec-1',
    name: 'EC Sensor A',
    type: SENSOR_TYPES.EC,
    value: 1.8,
    unit: DEFAULT_THRESHOLDS.EC.unit,
    updatedAt: Date.now(),
    history: [],
    zoneId: 'z-1',
    greenhouseId: 'gh-1',
    cropId: 'crop-lettuce',
    stage: 'vegetative',
  },
  {
    id: 'sensor-ph-1',
    name: 'pH Sensor A',
    type: SENSOR_TYPES.PH,
    value: 6.1,
    unit: DEFAULT_THRESHOLDS.PH.unit,
    updatedAt: Date.now(),
    history: [],
    zoneId: 'z-1',
    greenhouseId: 'gh-1',
    cropId: 'crop-lettuce',
    stage: 'vegetative',
  },
  {
    id: 'sensor-temp-1',
    name: 'Solution Temp A',
    type: SENSOR_TYPES.TEMP,
    value: 22.2,
    unit: DEFAULT_THRESHOLDS.TEMP.unit,
    updatedAt: Date.now(),
    history: [],
    zoneId: 'z-1',
    greenhouseId: 'gh-1',
    cropId: 'crop-lettuce',
    stage: 'vegetative',
  },
  {
    id: 'sensor-do-1',
    name: 'DO Sensor A',
    type: SENSOR_TYPES.DO,
    value: 7.2,
    unit: DEFAULT_THRESHOLDS.DO.unit,
    updatedAt: Date.now(),
    history: [],
    zoneId: 'z-2',
    greenhouseId: 'gh-1',
    cropId: 'crop-basil',
    stage: 'vegetative',
  },
  {
    id: 'sensor-orp-1',
    name: 'ORP Sensor A',
    type: SENSOR_TYPES.ORP,
    value: 320,
    unit: DEFAULT_THRESHOLDS.ORP.unit,
    updatedAt: Date.now(),
    history: [],
    zoneId: 'z-2',
    greenhouseId: 'gh-1',
    cropId: 'crop-basil',
    stage: 'vegetative',
  },
  // Greenhouse Beta sensors
  {
    id: 'sensor-ec-2',
    name: 'EC Sensor B',
    type: SENSOR_TYPES.EC,
    value: 2.0,
    unit: DEFAULT_THRESHOLDS.EC.unit,
    updatedAt: Date.now(),
    history: [],
    zoneId: 'z-3',
    greenhouseId: 'gh-2',
    cropId: 'crop-tomato',
    stage: 'bloom',
  },
  {
    id: 'sensor-ph-2',
    name: 'pH Sensor B',
    type: SENSOR_TYPES.PH,
    value: 5.9,
    unit: DEFAULT_THRESHOLDS.PH.unit,
    updatedAt: Date.now(),
    history: [],
    zoneId: 'z-3',
    greenhouseId: 'gh-2',
    cropId: 'crop-tomato',
    stage: 'bloom',
  },
  {
    id: 'sensor-temp-2',
    name: 'Solution Temp B',
    type: SENSOR_TYPES.TEMP,
    value: 23.4,
    unit: DEFAULT_THRESHOLDS.TEMP.unit,
    updatedAt: Date.now(),
    history: [],
    zoneId: 'z-3',
    greenhouseId: 'gh-2',
    cropId: 'crop-tomato',
    stage: 'bloom',
  },
];

export const initialCrops = [
  {
    id: 'crop-lettuce',
    name: 'Butterhead Lettuce',
    stages: {
      seedling: {
        EC: { min: 0.8, max: 1.2, unit: 'mS/cm' },
        PH: { min: 5.8, max: 6.2, unit: 'pH' },
        TEMP: { min: 20, max: 23, unit: '°C' },
        DO: { min: 6.0, max: 10.0, unit: 'mg/L' },
      },
      vegetative: {
        EC: { min: 1.4, max: 1.8, unit: 'mS/cm' },
        PH: { min: 5.8, max: 6.2, unit: 'pH' },
        TEMP: { min: 20, max: 24, unit: '°C' },
        DO: { min: 6.0, max: 10.0, unit: 'mg/L' },
      },
      harvest: {
        EC: { min: 1.2, max: 1.6, unit: 'mS/cm' },
        PH: { min: 5.8, max: 6.3, unit: 'pH' },
        TEMP: { min: 18, max: 24, unit: '°C' },
        DO: { min: 5.5, max: 9.5, unit: 'mg/L' },
      },
    },
    defaultStage: 'vegetative',
  },
  {
    id: 'crop-basil',
    name: 'Genovese Basil',
    stages: {
      seedling: {
        EC: { min: 1.2, max: 1.6, unit: 'mS/cm' },
        PH: { min: 5.5, max: 6.5, unit: 'pH' },
        TEMP: { min: 21, max: 25, unit: '°C' },
        DO: { min: 6.0, max: 10.0, unit: 'mg/L' },
      },
      vegetative: {
        EC: { min: 1.6, max: 2.2, unit: 'mS/cm' },
        PH: { min: 5.5, max: 6.5, unit: 'pH' },
        TEMP: { min: 21, max: 26, unit: '°C' },
        DO: { min: 6.0, max: 10.0, unit: 'mg/L' },
      },
    },
    defaultStage: 'vegetative',
  },
  {
    id: 'crop-tomato',
    name: 'Cherry Tomato',
    stages: {
      seedling: {
        EC: { min: 1.4, max: 2.0, unit: 'mS/cm' },
        PH: { min: 5.8, max: 6.3, unit: 'pH' },
        TEMP: { min: 21, max: 25, unit: '°C' },
        DO: { min: 6.0, max: 10.0, unit: 'mg/L' },
        ORP: { min: 300, max: 450, unit: 'mV' },
      },
      vegetative: {
        EC: { min: 2.0, max: 2.6, unit: 'mS/cm' },
        PH: { min: 5.8, max: 6.3, unit: 'pH' },
        TEMP: { min: 20, max: 26, unit: '°C' },
        DO: { min: 6.0, max: 10.0, unit: 'mg/L' },
        ORP: { min: 300, max: 450, unit: 'mV' },
      },
      bloom: {
        EC: { min: 2.4, max: 3.2, unit: 'mS/cm' },
        PH: { min: 5.8, max: 6.3, unit: 'pH' },
        TEMP: { min: 20, max: 26, unit: '°C' },
        DO: { min: 5.5, max: 9.5, unit: 'mg/L' },
        ORP: { min: 300, max: 450, unit: 'mV' },
      },
    },
    defaultStage: 'vegetative',
  },
];

// Backward compatible "targets" shortcut for older UIs using a single targets object
// We map default stage values into targets for convenience.
export const initialCropsWithTargets = initialCrops.map((c) => {
  const st = c.stages[c.defaultStage] || {};
  return {
    ...c,
    targets: { ...st },
  };
});

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
  DO_LOW: (value, threshold) => ({
    severity: 'warning',
    title: 'Dissolved Oxygen Low',
    message: `DO at ${value.toFixed(1)} ${threshold.unit} is below ${threshold.min} ${threshold.unit}.`,
  }),
  ORP_OUT_OF_RANGE: (value, threshold) => ({
    severity: 'info',
    title: 'ORP Outside Range',
    message: `ORP at ${value.toFixed(0)} ${threshold.unit} outside ${threshold.min}-${threshold.max} ${threshold.unit}.`,
  }),
};

export const initialAlerts = [];

export const initialIntegrations = [
  { id: 'int-slack', name: 'Slack', status: 'connected' },
  { id: 'int-webhook', name: 'Webhook', status: 'connected' },
  { id: 'int-sms', name: 'SMS Provider', status: 'disconnected' },
];
