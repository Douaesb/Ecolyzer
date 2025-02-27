import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.action';

export interface AuthState {
  token: string | null;
  username: string | null;
  email: string | null; 
  roles: string[];
  error: string | null;
  loading: boolean; 
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  username: null,
  email: null,
  roles: [],
  error: null,
  loading: false 
};

export const authReducer = createReducer(
  initialState,

  // LOGIN
  on(AuthActions.login, state => ({
    ...state,
    loading: true,
    error: null
  })),

  // LOGIN SUCCESS
  on(AuthActions.loginSuccess, (state, { token, username, roles }) => ({
    ...state,
    token,
    username,
    roles: roles.map((role: any) => role.authority || role),
    error: null,
    loading: false
  })),

  // LOGIN FAILURE
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // REGISTER
  on(AuthActions.register, state => ({
    ...state,
    loading: true,
    error: null
  })),

  // REGISTER SUCCESS
  on(AuthActions.registerSuccess, (state, { token, username, email, roles }) => ({
    ...state,
    token,
    username,
    email, 
    roles: roles.map((role: any) => role.authority || role),
    error: null,
    loading: false
  })),

  // REGISTER FAILURE
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(AuthActions.authStateUpdated, state => ({ ...state })),
  // LOGOUT
  on(AuthActions.logoutSuccess, () => ({
    ...initialState,
    token: null
  }))
);
