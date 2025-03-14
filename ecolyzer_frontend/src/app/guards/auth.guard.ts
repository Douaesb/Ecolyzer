import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take, tap } from 'rxjs/operators';
import { AuthState } from '../state/auth/auth.reducer';
import { jwtDecode } from 'jwt-decode';

export const AuthGuard = (requiredRoles: string[] = []) => {
  const store = inject(Store<{ auth: AuthState }>);
  const router = inject(Router);

  return store.select(state => state.auth).pipe(
    take(1),
    map(authState => {
      console.log('Auth State in Guard:', authState);

      if (!authState.token) {
        console.warn('No token found. Redirecting to login.');
        return { authorized: false, redirect: '/auth/login' };
      }

      try {
        const decodedToken: any = jwtDecode(authState.token);
        console.log('Decoded Token:', decodedToken);

        const now = Math.floor(Date.now() / 1000);
        if (!decodedToken.exp || decodedToken.exp < now) {
          console.warn('Token expired. Redirecting to login.');
          return { authorized: false, redirect: '/auth/login' };
        }

        let userRoles: string[] = [];

        if (Array.isArray(decodedToken.roles) && decodedToken.roles.length) {
          userRoles = decodedToken.roles.map((role: any) => role.authority || role.name || role);
        } else if (Array.isArray(decodedToken.authorities) && decodedToken.authorities.length) {
          userRoles = decodedToken.authorities.map((auth: any) => auth.authority || auth);
        } else if (decodedToken.scope) {
          userRoles = decodedToken.scope.split(' ');
        }

        console.log('Extracted User Roles:', userRoles);

        // If no roles exist, deny access
        if (userRoles.length === 0) {
          console.warn('User has no roles assigned. Redirecting to login.');
          return { authorized: false, redirect: '/auth/login' };
        }

        const hasAccess =
          requiredRoles.length === 0 || requiredRoles.some(role => userRoles.includes(role));

        if (!hasAccess) {
          console.warn('User lacks required roles. Redirecting to unauthorized page.');
          return { authorized: false, redirect: '/unauthorized' };
        }

        return { authorized: true, redirect: null };
      } catch (error) {
        console.error('Error decoding token:', error);
        return { authorized: false, redirect: '/auth/login' };
      }
    }),
    tap(({ authorized, redirect }) => {
      if (!authorized && redirect) {
        router.navigate([redirect]);
      }
    }),
    map(({ authorized }) => authorized)
  );
};
