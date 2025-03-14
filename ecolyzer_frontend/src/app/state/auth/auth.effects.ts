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
          map(response => AuthActions.loginSuccess({
            token: response.token,
            username: response.username,
            roles: this.extractRoles(response)
          })),
          catchError(error => of(AuthActions.loginFailure({ error: error.message }))) 
        )
      )
    )
  );
  

  // REGISTER EFFECT (Redirect to Login)
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(({ credentials }) =>
        this.authService.register(credentials.username, credentials.email, credentials.password, credentials.roles).pipe(
          map((response) => AuthActions.registerSuccess({
            token: response.token, 
            username: response.username, 
            email: response.email, 
            roles: this.extractRoles(response) 
          })),
          catchError(error => of(AuthActions.registerFailure({ error: error.error?.message || 'Registration failed' })))
        )
      )
    )
  );
  

  // LOGOUT EFFECT
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => localStorage.removeItem('token')),
      map(() => AuthActions.logoutSuccess())
    )
  );

  // **NAVIGATION EFFECTS**

  // After login, redirect to dashboard only if roles exist
  navigateAfterLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ token, roles }) => {
          localStorage.setItem('token', token);
          this.router.navigate(roles.length > 0 ? ['/dashboard'] : ['/auth/login']);
        })
      ),
    { dispatch: false }
  );

  // After register, always redirect to login
  navigateAfterRegister$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => this.router.navigate(['/auth/login']))
      ),
    { dispatch: false }
  );

  // After logout, redirect to login
  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => this.router.navigate(['/auth/login']))
      ),
    { dispatch: false }
  );

  // Extract roles from the API response
  private extractRoles(response: any): string[] {
    if (Array.isArray(response.roles)) {
      return response.roles.map((role: any) => role.name || role); 
    } else if (Array.isArray(response.authorities)) {
      return response.authorities.map((auth: any) => auth.authority || auth);
    } else if (typeof response.scope === 'string') {
      return response.scope.split(' ');
    }
    return [];
  }
}
