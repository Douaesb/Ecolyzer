import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import {localStorageSync} from "ngrx-store-localstorage";
import { routes } from './app.routes';
import { MetaReducer, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { AuthEffects } from './state/auth/auth.effects';
import { authReducer } from './state/auth/auth.reducer';
import { userReducer } from './state/user/user.reducer';
import { UserEffects } from './state/user/user.effects';
import { zoneReducer } from './state/zone/zone.reducer';
import { ZoneEffects } from './state/zone/zone.effects';
import { deviceReducer } from './state/device/device.reducer';
import { DeviceEffects } from './state/device/device.effects';
import { thresholdAlertReducer } from './state/threshold/threshold-alert.reducer';
import { ThresholdAlertEffects } from './state/threshold/threshold-alert.effects';
import { energyReducer } from './state/energy/energy-consumption.reducer';
import { EnergyEffects } from './state/energy/energy-consumption.effects';
import { dashboardReducer } from './state/dashboard/dashboard.reducer';
import { DashboardEffects } from './state/dashboard/dashboard.effects';
import { provideToastr } from 'ngx-toastr';
import { BrowserModule } from '@angular/platform-browser';
import { notificationReducer } from './state/notifications/notification.reducer';


export function localStorageSyncReducer(reducer: any): any {
  return localStorageSync({ keys: ['auth'], rehydrate: true })(reducer);
}

const metaReducers: MetaReducer[] = [localStorageSyncReducer];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideStore({ auth: authReducer, users: userReducer, zones: zoneReducer , devices:  deviceReducer, thresholdAlert: thresholdAlertReducer, energy: energyReducer, dashboard: dashboardReducer, notifications: notificationReducer}, { metaReducers }),
    provideEffects([AuthEffects, UserEffects, ZoneEffects, DeviceEffects, ThresholdAlertEffects, EnergyEffects, DashboardEffects]),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(BrowserModule), 
    provideToastr(),
  ],
  
  
};
