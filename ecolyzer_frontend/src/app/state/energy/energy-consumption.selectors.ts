import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EnergyState } from '../energy/energy-consumption.reducer';

export const selectEnergyState = createFeatureSelector<EnergyState>('energy');

export const selectCurrentConsumption = createSelector(selectEnergyState, (state) => state.currentConsumption);
export const selectDailySummary = createSelector(selectEnergyState, (state) => state.dailySummary);
export const selectAllSummaries = createSelector(selectEnergyState, (state) => state.allSummaries);
export const selectEnergyLoading = createSelector(selectEnergyState, (state) => state.loading);
export const selectEnergyError = createSelector(selectEnergyState, (state) => state.error);
