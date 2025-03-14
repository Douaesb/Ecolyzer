import { createReducer, on } from '@ngrx/store';
import * as ThresholdAlertActions from '../threshold/threshold-alert.actions';
import { ThresholdAlert } from '../../model/threshold-alert.model';

export interface ThresholdAlertState {
  alerts: ThresholdAlert[];
  loading: boolean;
  error: string | null;
}

const initialState: ThresholdAlertState = {
  alerts: [],
  loading: false,
  error: null
};

export const thresholdAlertReducer = createReducer(
  initialState,

  // Load alerts
  on(ThresholdAlertActions.loadAlertsByDevice, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ThresholdAlertActions.loadAlertsByDeviceSuccess, (state, { alerts }) => ({
    ...state,
    alerts,
    loading: false
  })),
  on(ThresholdAlertActions.loadAlertsByDeviceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update alert status
  on(ThresholdAlertActions.updateAlertStatusSuccess, (state, { alert }) => ({
    ...state,
    alerts: state.alerts.map((a) => (a.id === alert.id ? alert : a))
  })),
  on(ThresholdAlertActions.updateAlertStatusFailure, (state, { error }) => ({
    ...state,
    error
  })),

  // Delete alert
  on(ThresholdAlertActions.deleteAlertSuccess, (state, { alertId }) => ({
    ...state,
    alerts: state.alerts.filter((alert) => alert.id !== alertId)
  })),
  on(ThresholdAlertActions.deleteAlertFailure, (state, { error }) => ({
    ...state,
    error
  }))
);
