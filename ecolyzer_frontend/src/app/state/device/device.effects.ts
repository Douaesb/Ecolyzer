import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DeviceService } from '../../services/device.service';
import * as DeviceActions from '../device/device.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';

@Injectable()
export class DeviceEffects {
  constructor(
    private actions$: Actions,
    private deviceService: DeviceService
  ) {}

  // Load Devices
  loadDevices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeviceActions.loadDevices),
      mergeMap(({ page, size }) =>
        this.deviceService.getDevices(page, size).pipe(
          tap((response) => console.log('API Response in Effect:', response)),
          map((response) =>
            DeviceActions.loadDevicesSuccess({
              devices: response.content,
              totalElements: response.totalElements,
              totalPages: response.totalPages,
            })
          ),
          catchError((error) =>
            of(DeviceActions.loadDevicesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Create Device
  createDevice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeviceActions.createDevice),
      mergeMap(({ device }) =>
        this.deviceService.createDevice(device).pipe(
          map((createdDevice) =>
            DeviceActions.createDeviceSuccess({ device: createdDevice })
          ),
          catchError((error) =>
            of(DeviceActions.createDeviceFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Update Device
  updateDevice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeviceActions.updateDevice),
      mergeMap(({ id, device }) =>
        this.deviceService.updateDevice(id, device).pipe(
          map((updatedDevice) =>
            DeviceActions.updateDeviceSuccess({ device: updatedDevice })
          ),
          catchError((error) =>
            of(DeviceActions.updateDeviceFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Delete Device
  deleteDevice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeviceActions.deleteDevice),
      mergeMap(({ id }) =>
        this.deviceService.deleteDevice(id).pipe(
          map(() => DeviceActions.deleteDeviceSuccess({ id })),
          catchError((error) =>
            of(DeviceActions.deleteDeviceFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Search Devices

  searchDevices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeviceActions.searchDevices),
      mergeMap(({name, page, size }) =>
        this.deviceService.searchDevices(name, page, size).pipe(
          tap((response) => console.log('API Response in Effect:', response)),
          map((response) =>
            DeviceActions.searchDevicesSuccess({
              devices: response.content,
              totalElements: response.totalElements,
              totalPages: response.totalPages,
            })
          ),
          catchError((error) =>
            of(DeviceActions.searchDevicesFailure({ error: error.message }))
          )
        )
      )
    )
  );
  // Filter Devices
  filterDevices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeviceActions.filterDevices),
      mergeMap(({ serialNum, page, size }) =>
        this.deviceService.filterDevices(serialNum, page, size).pipe(
          map((response) =>
            DeviceActions.filterDevicesSuccess({
              devices: response.content,
              totalElements: response.totalElements,
              totalPages: response.totalPages,
            })
          ),
          catchError((error) =>
            of(DeviceActions.filterDevicesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadDevicesByZone$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeviceActions.getDevicesByZone),
      mergeMap(({ zoneId, page, pageSize }) =>
        this.deviceService.getDevicesByZone(zoneId, page, pageSize).pipe(
          tap((response) => console.log('API Response in Effect:', response)), // Debugging log
          map((response) =>
            DeviceActions.loadDevicesSuccess({
              devices: response.content,
              totalElements: response.totalElements,
              totalPages: response.totalPages,
            })
          ),
          catchError((error) =>
            of(DeviceActions.loadDevicesFailure({ error: error.message }))
          )
        )
      )
    )
  );
  
}
