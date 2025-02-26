import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {localStorageSync} from "ngrx-store-localstorage";
import { routes } from './app.routes';
import { MetaReducer, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { AuthEffects } from './state/auth/auth.effects';
import { authReducer } from './state/auth/auth.reducer';


export function localStorageSyncReducer(reducer: any): any {
  return localStorageSync({ keys: ['auth'], rehydrate: true })(reducer);
}

const metaReducers: MetaReducer[] = [localStorageSyncReducer];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideStore({ auth: authReducer }, { metaReducers }),
    provideEffects([AuthEffects,]),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
  
  
};
