import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ThresholdAlertState } from '../threshold/threshold-alert.reducer';

// Select the feature state
export const selectThresholdAlertState = createFeatureSelector<ThresholdAlertState>('thresholdAlert');

// Select alerts
export const selectAllThresholdAlerts = createSelector(
  selectThresholdAlertState,
  (state) => state.alerts
);

// Select active alerts
export const selectActiveAlerts = createSelector(
  selectAllThresholdAlerts,
  (alerts) => alerts.filter((alert) => alert.active)
);

// Select loading state
export const selectThresholdAlertLoading = createSelector(
  selectThresholdAlertState,
  (state) => state.loading
);

// Select error state
export const selectThresholdAlertError = createSelector(
  selectThresholdAlertState,
  (state) => state.error
);
