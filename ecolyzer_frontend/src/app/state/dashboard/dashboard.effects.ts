import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DashboardService } from '../../services/dashboard.service';
import { loadDashboard, loadDashboardSuccess, loadDashboardFailure } from '../dashboard/dashboard.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class DashboardEffects {
  constructor(private actions$: Actions, private dashboardService: DashboardService) {}

  loadDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDashboard),
      mergeMap(({ period }) =>
        this.dashboardService.getDashboardData(period).pipe(
          map(data => loadDashboardSuccess({ data })),
          catchError(error => of(loadDashboardFailure({ error: error.message })))
        )
      )
    )
  );
}
