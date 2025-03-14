import { createReducer, on } from '@ngrx/store';
import { loadDashboard, loadDashboardSuccess, loadDashboardFailure } from '../dashboard/dashboard.actions';
import { EnergyDashboard } from '../../model/EnergyDashboard';

export interface DashboardState {
  data: EnergyDashboard | null;
  loading: boolean;
  error: string | null;
}

export const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
};

export const dashboardReducer = createReducer(
  initialState,
  on(loadDashboard, state => ({ ...state, loading: true, error: null })),
  on(loadDashboardSuccess, (state, { data }) => ({ ...state, loading: false, data })),
  on(loadDashboardFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
