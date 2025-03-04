import { createAction, props } from '@ngrx/store';
import { Device } from '../../model/device.model';

// Load all devices
export const loadDevices = createAction('[Device] Load Devices', props<{ page: number; size: number }>());
export const loadDevicesSuccess = createAction('[Device] Load Devices Success', props<{ devices: Device[] , totalElements: number, totalPages: number }>());
export const loadDevicesFailure = createAction('[Device] Load Devices Failure', props<{ error: string }>());

// Create device
export const createDevice = createAction('[Device] Create Device', props<{ device: Device }>());
export const createDeviceSuccess = createAction('[Device] Create Device Success', props<{ device: Device }>());
export const createDeviceFailure = createAction('[Device] Create Device Failure', props<{ error: string }>());

// Update device
export const updateDevice = createAction('[Device] Update Device', props<{ id: string; device: Device }>());
export const updateDeviceSuccess = createAction('[Device] Update Device Success', props<{ device: Device }>());
export const updateDeviceFailure = createAction('[Device] Update Device Failure', props<{ error: string }>());

// Delete device
export const deleteDevice = createAction('[Device] Delete Device', props<{ id: string }>());
export const deleteDeviceSuccess = createAction('[Device] Delete Device Success', props<{ id: string }>());
export const deleteDeviceFailure = createAction('[Device] Delete Device Failure', props<{ error: string }>());

// Search devices
export const searchDevices = createAction('[Device] Search Devices', props<{ name: string; page: number; size: number }>());
export const searchDevicesSuccess = createAction('[Device] Search Devices Success', props<{ devices: Device[], totalElements: number, totalPages: number }>());
export const searchDevicesFailure = createAction('[Device] Search Devices Failure', props<{ error: string }>());

// Filter devices
export const filterDevices = createAction('[Device] Filter Devices', props<{ serialNum: number; page: number; size: number }>());
export const filterDevicesSuccess = createAction('[Device] Filter Devices Success', props<{ devices: Device[], totalElements: number, totalPages: number }>());
export const filterDevicesFailure = createAction('[Device] Filter Devices Failure', props<{ error: string }>());

// Get devices by zone
export const getDevicesByZone = createAction(
    '[Device] Get Devices By Zone',
    props<{ zoneId: string }>()
  );
  
  export const getDevicesByZoneSuccess = createAction(
    '[Device] Get Devices By Zone Success',
    props<{ devices: Device[] }>()
  );
  
  export const getDevicesByZoneFailure = createAction(
    '[Device] Get Devices By Zone Failure',
    props<{ error: string }>()
  );
  