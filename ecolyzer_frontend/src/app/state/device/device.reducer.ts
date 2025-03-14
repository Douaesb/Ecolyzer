import { createReducer, on } from '@ngrx/store';
import * as DeviceActions from '../device/device.actions';
import { Device } from '../../model/device.model';

export interface DeviceState {
  devices: Device[];
  selectedDevice: Device | null;
  loading: boolean;
  error: string | null;
  totalElements: number;
  totalPages: number;
}

const initialState: DeviceState = {
  devices: [],
  selectedDevice: null,
  loading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
};

export const deviceReducer = createReducer(
  initialState,

  on(DeviceActions.loadDevices, (state) => ({ ...state, loading: true })),
  on(
    DeviceActions.loadDevicesSuccess,
    (state, { devices, totalElements, totalPages }) => {
      console.log('Devices received in reducer:', devices);
      return {
        ...state,
        loading: false,
        devices,
        totalElements,
        totalPages,
        error: null,
      };
    }
  ),
  on(DeviceActions.loadDevicesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Create device
  on(DeviceActions.createDeviceSuccess, (state, { device }) => ({
    ...state,
    devices: [...state.devices, device],
    error: null,
  })),
  on(DeviceActions.createDeviceFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Update device
  on(DeviceActions.updateDeviceSuccess, (state, { device }) => ({
    ...state,
    devices: state.devices.map((item) =>
      item.id === device.id ? device : item
    ),
    error: null,
  })),
  on(DeviceActions.updateDeviceFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Delete device
  on(DeviceActions.deleteDeviceSuccess, (state, { id }) => ({
    ...state,
    devices: state.devices.filter((device) => device.id !== id),
    error: null,
  })),
  on(DeviceActions.deleteDeviceFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Search devices with pagination
  on(DeviceActions.searchDevices, (state) => ({ ...state, loading: true })),
  on(
    DeviceActions.searchDevicesSuccess,
    (state, { devices, totalElements, totalPages }) => ({
      ...state,
      loading: false,
      devices,
      totalElements,
      totalPages,
      error: null,
    })
  ),
  on(DeviceActions.searchDevicesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Filter devices with pagination
  on(DeviceActions.filterDevices, (state) => ({ ...state, loading: true })),
  on(
    DeviceActions.filterDevicesSuccess,
    (state, { devices, totalElements, totalPages }) => ({
      ...state,
      loading: false,
      devices,
      totalElements,
      totalPages,
      error: null,
    })
  ),
  on(DeviceActions.filterDevicesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Get devices by zone with pagination
  on(DeviceActions.getDevicesByZone, (state) => ({
    ...state,
    loading: true,
  })),
  
  on(DeviceActions.getDevicesByZoneSuccess, (state,  { devices, totalElements, totalPages }) => ({
    ...state,
    loading: false,
    devices,
    totalElements,
    totalPages,
    error: null,
  })),
  
  on(DeviceActions.getDevicesByZoneFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
  
);
