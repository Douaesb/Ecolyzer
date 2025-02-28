import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ZoneState } from './zone.reducer';

export const selectZoneState = createFeatureSelector<ZoneState>('zones');

export const selectAllZones = createSelector(selectZoneState, (state) => state.zones);
export const selectZoneLoading = createSelector(selectZoneState, (state) => state.loading);
export const selectSelectedZone = createSelector(selectZoneState, (state) => state.selectedZone);
