import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

// Select Auth Feature
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Select Token
export const selectAuthToken = createSelector(
  selectAuthState,
  (state) => state.token
);

// Select if User is Authenticated
export const selectIsAuthenticated = createSelector(
  selectAuthToken,
  (token) => !!token 
);

// Select User
export const selectAuthUser = createSelector(
  selectAuthState,
  (state) => state.username
);

// Select Authorities (Roles)
export const selectUserAuthorities = createSelector(
  selectAuthState,
  (state) => state.roles || [] 
);

export const selectHasRole = (role: string) =>
  createSelector(selectUserAuthorities, (roles) => roles.includes(role));

export const selectIsAdmin = selectHasRole('ROLE_ADMIN');

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);
