import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.action';

export interface AuthState {
  token: string | null;
  username: string | null;
  authorities: string[];
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  username: null,
  authorities: [],
  error: null
};

export const authReducer = createReducer(
  initialState,

  // LOGIN SUCCESS
  on(AuthActions.loginSuccess, (state, { token, username, authorities }) => ({
    ...state,
    token,
    username,
    authorities,
    error: null
  })),

  // LOGIN FAILURE
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error
  })),

  // REGISTER SUCCESS
  on(AuthActions.registerSuccess, (state, { token, username, authorities }) => ({
    ...state,
    token,
    username,
    authorities,
    error: null
  })),

  // REGISTER FAILURE
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    error
  })),

  // LOGOUT
  on(AuthActions.logoutSuccess, () => ({
    ...initialState,
    token: null
  }))
);
