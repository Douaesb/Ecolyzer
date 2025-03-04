import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DeviceState } from '../device/device.reducer';

export const selectDeviceState = createFeatureSelector<DeviceState>('devices');

export const selectAllDevices = createSelector(selectDeviceState, state => state.devices);
export const selectDeviceLoading = createSelector(selectDeviceState, state => state.loading);

export const selectDeviceError = createSelector(selectDeviceState, state => state.error);
