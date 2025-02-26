import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import * as AuthActions from './auth.action';

@Injectable()
export class AuthEffects {
  
  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService,
    @Inject(Router) private readonly router: Router
  ) {}

  // LOGIN EFFECT
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ credentials }) =>
        this.authService.login(credentials.usernameOrEmail, credentials.password).pipe(
          map((response) => {
            const authorities = Array.isArray(response.authorities) ? response.authorities : [];
            return AuthActions.loginSuccess({
              token: response.token,
              username: response.username,
              authorities: authorities.map((auth: any) => auth.authority)
            });
          }),
          catchError(error => of(AuthActions.loginFailure({ error: error.error?.message || 'Login failed' })))
        )
      )
    )
  );

  // REGISTER EFFECT
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(({ credentials }) =>
        this.authService.register(credentials.username, credentials.password, credentials.roles).pipe(
          map((response) => {
            const authorities = Array.isArray(response.authorities) ? response.authorities : [];
            return AuthActions.registerSuccess({
              token: response.token,
              username: response.username,
              authorities: authorities.map((auth: any) => auth.authority)
            });
          }),
          catchError(error => of(AuthActions.registerFailure({ error: error.error?.message || 'Registration failed' })))
        )
      )
    )
  );

  // LOGOUT EFFECT
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        localStorage.removeItem('token');
      }),
      map(() => AuthActions.logoutSuccess())
    )
  );

  // NAVIGATION AFTER AUTH SUCCESS
  authSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
        tap(action => {
          localStorage.setItem('token', action.token);
          this.router.navigate(['/dashboard']);
        })
      ),
    { dispatch: false }
  );

  // NAVIGATION AFTER LOGOUT
  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );
}
