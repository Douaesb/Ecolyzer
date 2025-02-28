import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { ZoneService } from '../../services/zone.service';
import * as ZoneActions from './zone.actions';
import { PaginatedZones } from '../../model/zone.model';

@Injectable()
export class ZoneEffects {
  constructor(private actions$: Actions, private zoneService: ZoneService) {}

  loadZones$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ZoneActions.loadZones),
      tap(() => console.log("Effect triggered: loadZones action detected")),
      mergeMap(({ page, size }) =>
        this.zoneService.getAllZones(page, size).pipe(
          tap(response => console.log("API Response in Effect:", response)),
          map(response => ZoneActions.loadZonesSuccess({ 
            zones: response.content, 
            totalElements: response.totalElements, 
            totalPages: response.totalPages 
          })),
          catchError(error => {
            console.error("Error fetching zones:", error);
            return of(ZoneActions.loadZonesFailure({ error: error.message }));
          })
        )
      )
    )
  );
  
  

  loadZoneById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ZoneActions.loadZoneById),
      mergeMap(({ id }) =>
        this.zoneService.getZoneById(id).pipe(
          map((zone) => ZoneActions.loadZoneByIdSuccess({ zone })),
          catchError((error) => of(ZoneActions.loadZoneByIdFailure({ error: error.message })))
        )
      )
    )
  );

  createZone$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ZoneActions.createZone),
      mergeMap(({ zone }) =>
        this.zoneService.createZone(zone).pipe(
          map((newZone) => ZoneActions.createZoneSuccess({ zone: newZone })),
          catchError((error) => of(ZoneActions.createZoneFailure({ error: error.message })))
        )
      )
    )
  );

  updateZone$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ZoneActions.updateZone),
      mergeMap(({ id, zone }) =>
        this.zoneService.updateZone(id, zone).pipe(
          map((updatedZone) => ZoneActions.updateZoneSuccess({ zone: updatedZone })),
          catchError((error) => of(ZoneActions.updateZoneFailure({ error: error.message })))
        )
      )
    )
  );

  deleteZone$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ZoneActions.deleteZone),
      mergeMap(({ id }) =>
        this.zoneService.deleteZone(id).pipe(
          map(() => ZoneActions.deleteZoneSuccess({ id })),
          catchError((error) => of(ZoneActions.deleteZoneFailure({ error: error.message })))
        )
      )
    )
  );
}
