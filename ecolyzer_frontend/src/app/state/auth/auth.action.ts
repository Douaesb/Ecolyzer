import { createAction, props } from '@ngrx/store';
import { LoginCredentials, RegisterCredentials } from '../../model/auth.model';


// LOGIN ACTIONS
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginCredentials }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ token: string; username: string; authorities: string[] }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// REGISTER ACTIONS
export const register = createAction(
  '[Auth] Register',
  props<{ credentials: RegisterCredentials }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ token: string; username: string; authorities: string[] }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

// LOGOUT ACTIONS
export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');
