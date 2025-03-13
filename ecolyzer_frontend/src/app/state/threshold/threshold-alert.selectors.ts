import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ThresholdAlertState } from '../threshold/threshold-alert.reducer';
import { ThresholdAlert } from '../../model/threshold-alert.model';

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

export const selectDevicesWithActiveAlerts = createSelector(
  selectAllThresholdAlerts,
  (alerts) => {
    const latestAlertByDevice = new Map<string, ThresholdAlert>();

    alerts.forEach(alert => {
      if (!latestAlertByDevice.has(alert.deviceId) || 
          (alert.updatedAt ?? 0) > (latestAlertByDevice.get(alert.deviceId)?.updatedAt ?? 0)) {
        latestAlertByDevice.set(alert.deviceId, alert);
      }
    });

    return new Set(
      Array.from(latestAlertByDevice.values())
        .filter(alert => alert.status !== 'RESOLVED')
        .map(alert => alert.deviceId)
    );
  }
);
