import { createAction, props } from '@ngrx/store';
import { ThresholdAlert } from '../../model/threshold-alert.model';

// Load alerts
export const loadAlertsByDevice = createAction(
  '[ThresholdAlert] Load Alerts By Device',
  props<{ deviceId: string }>()
);

export const loadAlertsByDeviceSuccess = createAction(
  '[ThresholdAlert] Load Alerts By Device Success',
  props<{ alerts: ThresholdAlert[] }>()
);

export const loadAlertsByDeviceFailure = createAction(
  '[ThresholdAlert] Load Alerts By Device Failure',
  props<{ error: string }>()
);

// Update alert status
export const updateAlertStatus = createAction(
  '[ThresholdAlert] Update Alert Status',
  props<{ alertId: string; status: string }>()
);

export const updateAlertStatusSuccess = createAction(
  '[ThresholdAlert] Update Alert Status Success',
  props<{ alert: ThresholdAlert }>()
);

export const updateAlertStatusFailure = createAction(
  '[ThresholdAlert] Update Alert Status Failure',
  props<{ error: string }>()
);

// Delete alert
export const deleteAlert = createAction(
  '[ThresholdAlert] Delete Alert',
  props<{ alertId: string }>()
);

export const deleteAlertSuccess = createAction(
  '[ThresholdAlert] Delete Alert Success',
  props<{ alertId: string }>()
);

export const deleteAlertFailure = createAction(
  '[ThresholdAlert] Delete Alert Failure',
  props<{ error: string }>()
);

export const loadAllActiveAlerts = createAction(
  '[Threshold Alert] Load All Active Alerts'
);

export const loadAllActiveAlertsSuccess = createAction(
  '[Threshold Alert] Load All Active Alerts Success',
  props<{ alerts: ThresholdAlert[] }>()
);

export const loadAllActiveAlertsFailure = createAction(
  '[Threshold Alert] Load All Active Alerts Failure',
  props<{ error: any }>()
);
