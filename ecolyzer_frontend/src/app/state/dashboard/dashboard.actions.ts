import { createAction, props } from '@ngrx/store';
import { EnergyDashboard } from '../../model/EnergyDashboard';

export const loadDashboard = createAction(
  '[Dashboard] Load Dashboard Data',
  props<{ period: string }>()
);

export const loadDashboardSuccess = createAction(
  '[Dashboard] Load Dashboard Data Success',
  props<{ data: EnergyDashboard }>()
);

export const loadDashboardFailure = createAction(
  '[Dashboard] Load Dashboard Data Failure',
  props<{ error: string }>()
);
