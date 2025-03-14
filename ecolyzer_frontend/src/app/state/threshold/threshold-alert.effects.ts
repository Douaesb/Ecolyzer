import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ThresholdAlertService } from '../../services/threshold-alert.service';
import * as ThresholdAlertActions from '../threshold/threshold-alert.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class ThresholdAlertEffects {
  constructor(
    private actions$: Actions,
    private thresholdAlertService: ThresholdAlertService
  ) {}

  loadAllActiveAlerts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ThresholdAlertActions.loadAllActiveAlerts),
      mergeMap(() =>
        this.thresholdAlertService.getAllActiveAlerts().pipe(
          map(alerts => ThresholdAlertActions.loadAllActiveAlertsSuccess({ alerts })),
          catchError(error => of(ThresholdAlertActions.loadAllActiveAlertsFailure({ error })))
        )
      )
    )
  );

  // Load alerts by device
  loadAlertsByDevice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ThresholdAlertActions.loadAlertsByDevice),
      mergeMap(({ deviceId }) =>
        this.thresholdAlertService.getAlertsByDevice(deviceId).pipe(
          map((alerts) => ThresholdAlertActions.loadAlertsByDeviceSuccess({ alerts })),
          catchError((error) => of(ThresholdAlertActions.loadAlertsByDeviceFailure({ error: error.message })))
        )
      )
    )
  );

  // Update alert status
  updateAlertStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ThresholdAlertActions.updateAlertStatus),
      mergeMap(({ alertId, status }) =>
        this.thresholdAlertService.updateAlertStatus(alertId, status).pipe(
          map((alert) => ThresholdAlertActions.updateAlertStatusSuccess({ alert })),
          catchError((error) => of(ThresholdAlertActions.updateAlertStatusFailure({ error: error.message })))
        )
      )
    )
  );

  // Delete alert
  deleteAlert$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ThresholdAlertActions.deleteAlert),
      mergeMap(({ alertId }) =>
        this.thresholdAlertService.deleteAlert(alertId).pipe(
          map(() => ThresholdAlertActions.deleteAlertSuccess({ alertId })),
          catchError((error) => of(ThresholdAlertActions.deleteAlertFailure({ error: error.message })))
        )
      )
    )
  );

  
}
