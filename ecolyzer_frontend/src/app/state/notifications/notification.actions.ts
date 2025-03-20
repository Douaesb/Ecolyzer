import { createAction, props } from '@ngrx/store';
import { ThresholdAlert } from '../../model/threshold-alert.model';

export const addNotification = createAction(
  '[Notification] Add Alert',
  props<{ alert: ThresholdAlert }>()
);

export const updateNotification = createAction(
  '[Notification] Update Alert',
  props<{ id: string; changes: Partial<ThresholdAlert> }>()
);

export const loadNotifications = createAction('[Notification] Load Alerts');

export const loadNotificationsSuccess = createAction(
  '[Notification] Load Alerts Success',
  props<{ alerts: ThresholdAlert[] }>()
);

export const markAlertAsRead = createAction(
  '[Notification] Mark Alert as Read',
  props<{ id: string }>()
);

export const markAlertsAsRead = createAction('[Notification] Mark All Alerts as Read');

export const clearResolvedAlerts = createAction('[Notification] Clear Resolved Alerts');

export const filterAlertsByStatus = createAction(
  '[Notification] Filter Alerts By Status',
  props<{ status: 'UNRESOLVED' | 'RESOLVING' | 'RESOLVED' | 'ALL' }>()
);