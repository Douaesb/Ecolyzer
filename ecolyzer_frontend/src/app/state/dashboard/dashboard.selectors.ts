import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardState } from '../dashboard/dashboard.reducer';

export const selectDashboardState = createFeatureSelector<DashboardState>('dashboard');

export const selectDashboardData = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.data
);

export const selectDashboardLoading = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.loading
);

export const selectDashboardError = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.error
);
