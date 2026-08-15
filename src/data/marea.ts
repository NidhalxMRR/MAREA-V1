/**
 * Facts sourced from the MAREA repository (NidhalxMRR/MAREA).
 *
 * Everything in this file is transcribed from real project artefacts:
 *   - ml/reports/metrics/daily_temperature_baselines.json
 *   - ml/reports/baseline_results_temperature_real.json
 *   - ml/configs/temperature_series_provenance.yaml
 *
 * Nothing here is invented. No live sensor readings, forecasts, alerts or
 * biological thresholds exist in the project yet, so none are defined.
 */

export const BRAND = {
  name: "MAREA",
  fullName: "Marine Aquaculture Risk & Early-warning Analytics",
  tagline: "Predict the water. Protect the harvest.",
};

export const DATASET = {
  id: "bizerte_temperature_series_v1",
  rows: 3640,
  dateRange: ["2004-01-01", "2013-12-18"] as const,
  samplingFrequency: "Daily",
  timestampColumn: "Date",
  temperatureColumn: "T (°C)",
  worksheet: "Physico_Chemical",
  workbook: "Wat_physico_chemical_range.xlsx",
  repetition: {
    lagRows: 365,
    comparedPairs: 3275,
    matchingPairs: 3275,
    exactRepetitionDetected: true,
  },
  research: {
    approved: true,
    authorization: "Researcher instruction: use this dataset for MAREA forecasting research.",
  },
  operational: {
    approved: false,
    status: "requires_independent_live_site_validation",
    reason:
      "The supplied source repeats exactly every 365 consecutive daily rows and cannot establish independent-year generalisation or live site variability.",
  },
  statedHistory: "Approximately 20 years reported by the researcher",
  suppliedCoverage: "2004-01-01 through 2013-12-18 (approximately 10 years supplied)",
  openQuestion:
    "Awaiting researcher clarification: are these measured observations, modelled/reference values, climatological values, or intentionally repeated simulation data?",
  riskTemperatureThreshold: null,
};

/** Descriptive temperature range of the supplied series — not risk thresholds. */
export const DESCRIPTIVE_RANGE = {
  min: 11.70528,
  max: 31.3013,
  mean: 21.9595692434663,
  q90Cutoff: 30.39428,
  q95Cutoff: 30.65726,
  note: "Descriptive distribution cut-offs only. MAREA defines no biological or risk threshold.",
};

export type BaselineKey = "persistence" | "seasonal_persistence_365_days";

export interface HorizonMetrics {
  horizonDays: number;
  persistence: { nSamples: number; mae: number; rmse: number };
  seasonal: { nSamples: number; mae: number; rmse: number; start: string; end: string };
}

export const DAILY_BASELINES: HorizonMetrics[] = [
  {
    horizonDays: 1,
    persistence: { nSamples: 3639, mae: 0.15095079417422375, rmse: 0.2019092805684393 },
    seasonal: {
      nSamples: 3275,
      mae: 0,
      rmse: 0,
      start: "2004-12-31",
      end: "2013-12-18",
    },
  },
  {
    horizonDays: 3,
    persistence: { nSamples: 3637, mae: 0.4106502089634314, rmse: 0.5057357384166932 },
    seasonal: {
      nSamples: 3275,
      mae: 0,
      rmse: 0,
      start: "2004-12-31",
      end: "2013-12-18",
    },
  },
  {
    horizonDays: 7,
    persistence: { nSamples: 3633, mae: 0.8507309276080375, rmse: 0.9978763525881679 },
    seasonal: {
      nSamples: 3275,
      mae: 0,
      rmse: 0,
      start: "2004-12-31",
      end: "2013-12-18",
    },
  },
];

export const SCIENTIFIC_INTERPRETATION =
  "An exact 365-day seasonal-persistence result demonstrates the deterministic annual-cycle structure of this supplied dataset. It is not independent-year generalisation evidence and does not justify feature-model or LSTM training on this dataset alone.";

/** Held-out persistence evaluation from ml/reports/baseline_results_temperature_real.json */
export const PERSISTENCE_EVALUATION = {
  model: "PersistenceBaseline",
  nSamples: 727,
  mae: 0.15156348005502068,
  rmse: 0.2034494371255731,
  r2: 0.998961869380574,
};

/**
 * Expected payload of the IoT programme currently in development.
 * Declared as a contract only — no device is connected.
 */
export const IOT_CONTRACT = [
  { field: "device_id", description: "Sensor identifier", status: "specified" },
  { field: "timestamp", description: "Reading time, target interval ~15 min", status: "specified" },
  { field: "water_temperature", description: "Sea-water temperature in °C", status: "specified" },
  { field: "gps_position", description: "Latitude / longitude of the device", status: "specified" },
  { field: "sensor_status", description: "Device health reported by firmware", status: "specified" },
] as const;

export const PIPELINE_STAGES = [
  { label: "Historical reference", state: "available" as const, note: "Researcher-supplied daily series" },
  { label: "Live IoT ingestion", state: "planned" as const, note: "Hardware in development" },
  { label: "Validation", state: "partial" as const, note: "Provenance + repetition audit complete" },
  { label: "Forecasting", state: "planned" as const, note: "Baselines evaluated, no production model" },
  { label: "Change detection", state: "planned" as const, note: "Requires live measurements" },
  { label: "Risk & early warning", state: "planned" as const, note: "No thresholds defined yet" },
];
