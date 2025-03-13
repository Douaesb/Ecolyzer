import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EnergyConsumptionService } from '../../services/energy-consumption.service';
import * as EnergyActions from '../energy/energy-consumption.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class EnergyEffects {
  constructor(private actions$: Actions, private energyService: EnergyConsumptionService) {}

  loadCurrentEnergyConsumption$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnergyActions.loadCurrentEnergyConsumption),
      mergeMap(({ deviceId }) =>
        this.energyService.getCurrentEnergyConsumption(deviceId).pipe(
          map((consumption) => EnergyActions.loadCurrentEnergyConsumptionSuccess({ consumption })),
          catchError((error) => of(EnergyActions.loadCurrentEnergyConsumptionFailure({ error: error.message })))
        )
      )
    )
  );

  loadDailyEnergySummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnergyActions.loadDailyEnergySummary),
      mergeMap(({ deviceId, date }) =>
        this.energyService.getDailyEnergySummary(deviceId, date).pipe(
          map((summary) => EnergyActions.loadDailyEnergySummarySuccess({ summary })),
          catchError((error) => of(EnergyActions.loadDailyEnergySummaryFailure({ error: error.message })))
        )
      )
    )
  );

  loadAllEnergySummaries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnergyActions.loadAllEnergySummaries),
      mergeMap(({ page, size }) =>
        this.energyService.getAllEnergySummaries(page, size).pipe(
          map((response) => EnergyActions.loadAllEnergySummariesSuccess({ 
            summaries: response.content, 
            totalElements: response.totalElements, 
            totalPages: response.totalPages 
          })),
          catchError((error) => of(EnergyActions.loadAllEnergySummariesFailure({ error: error.message })))
        )
      )
    )
  );
  
}
