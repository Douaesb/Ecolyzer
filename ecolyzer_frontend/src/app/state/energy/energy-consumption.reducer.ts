import { createReducer, on } from '@ngrx/store';
import * as EnergyActions from '../energy/energy-consumption.actions';
import { EnergyConsumption, EnergyConsumptionSummary } from '../../model/energy-consumption.model';

export interface EnergyState {
  currentConsumption: EnergyConsumption | null;
  dailySummary: EnergyConsumptionSummary | null;
  allSummaries: EnergyConsumptionSummary[];
  totalElements: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

export const initialState: EnergyState = {
  currentConsumption: null,
  dailySummary: null,
  allSummaries: [],
  totalElements: 0,
  totalPages: 0,
  loading: false,
  error: null,
};

export const energyReducer = createReducer(
  initialState,

  // Current energy consumption
  on(EnergyActions.loadCurrentEnergyConsumption, (state) => ({ ...state, loading: true })),
  on(EnergyActions.loadCurrentEnergyConsumptionSuccess, (state, { consumption }) => ({
    ...state,
    loading: false,
    currentConsumption: consumption,
  })),
  on(EnergyActions.loadCurrentEnergyConsumptionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Daily energy summary
  on(EnergyActions.loadDailyEnergySummary, (state) => ({ ...state, loading: true })),
  on(EnergyActions.loadDailyEnergySummarySuccess, (state, { summary }) => ({
    ...state,
    loading: false,
    dailySummary: summary,
  })),
  on(EnergyActions.loadDailyEnergySummaryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // All energy summaries
  on(EnergyActions.loadAllEnergySummaries, (state) => ({ ...state, loading: true })),
  on(EnergyActions.loadAllEnergySummariesSuccess, (state, { summaries, totalElements, totalPages }) => ({
    ...state,
    loading: false,
    allSummaries: summaries,
    totalElements,
    totalPages
  })),
  on(EnergyActions.loadAllEnergySummariesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
