import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

// Select Auth Feature
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Select Token
export const selectAuthToken = createSelector(
  selectAuthState,
  (state) => state.token
);

// Select User
export const selectAuthUser = createSelector(
  selectAuthState,
  (state) => state.username
);

// Select Authorities (Roles)
export const selectUserAuthorities = createSelector(
  selectAuthState,
  (state) => state.authorities
);

// Select Auth Error
export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);
