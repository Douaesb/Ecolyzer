import { createSelector, createFeatureSelector } from '@ngrx/store';
import { NotificationState } from './notification.reducer';

export const selectNotificationState = createFeatureSelector<NotificationState>('notifications');

export const selectAllNotifications = createSelector(
  selectNotificationState,
  (state) => state.alerts
);

export const selectFilteredNotifications = createSelector(
  selectNotificationState,
  (state) => state.filteredAlerts
);

export const selectUnreadNotificationsCount = createSelector(
  selectNotificationState,
  (state) => state.alerts.filter(alert => !alert.isRead).length
);

export const selectActiveNotifications = createSelector(
  selectNotificationState,
  (state) => state.alerts.filter(alert => alert.status !== 'RESOLVED')
);

export const selectResolvedNotifications = createSelector(
  selectNotificationState,
  (state) => state.alerts.filter(alert => alert.status === 'RESOLVED')
);

export const selectIsLoading = createSelector(
  selectNotificationState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectNotificationState,
  (state) => state.error
);
