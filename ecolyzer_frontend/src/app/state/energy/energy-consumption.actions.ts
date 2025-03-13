import { createAction, props } from '@ngrx/store';
import { EnergyConsumption, EnergyConsumptionSummary } from '../../model/energy-consumption.model';

// Load current energy consumption
export const loadCurrentEnergyConsumption = createAction(
  '[Energy] Load Current Energy Consumption',
  props<{ deviceId: string }>()
);
export const loadCurrentEnergyConsumptionSuccess = createAction(
  '[Energy] Load Current Energy Consumption Success',
  props<{ consumption: EnergyConsumption }>()
);
export const loadCurrentEnergyConsumptionFailure = createAction(
  '[Energy] Load Current Energy Consumption Failure',
  props<{ error: string }>()
);

// Load daily summary
export const loadDailyEnergySummary = createAction(
  '[Energy] Load Daily Energy Summary',
  props<{ deviceId: string; date?: string }>()
);
export const loadDailyEnergySummarySuccess = createAction(
  '[Energy] Load Daily Energy Summary Success',
  props<{ summary: EnergyConsumptionSummary }>()
);
export const loadDailyEnergySummaryFailure = createAction(
  '[Energy] Load Daily Energy Summary Failure',
  props<{ error: string }>()
);

// Load all summaries
export const loadAllEnergySummaries = createAction(
  '[Energy] Load All Energy Summaries',
  props<{ page: number; size: number }>()
);
export const loadAllEnergySummariesSuccess = createAction(
  '[Energy] Load All Energy Summaries Success',
  props<{ summaries: EnergyConsumptionSummary[], totalElements: number, totalPages: number }>()
);
export const loadAllEnergySummariesFailure = createAction(
  '[Energy] Load All Energy Summaries Failure',
  props<{ error: string }>()
);
