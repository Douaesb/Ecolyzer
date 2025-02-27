import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { AuthState } from '../state/auth/auth.reducer';
import { jwtDecode } from 'jwt-decode';

export const AuthGuard = (requiredRoles: string[] = []) => {
  const store = inject(Store<{ auth: AuthState }>);
  const router = inject(Router);

  return store.select(state => state.auth).pipe(
    take(1),
    map(authState => {
      console.log('Auth State in Guard:', authState);

      // 🔹 Check authentication
      if (!authState.isAuthenticated || !authState.token) {
        console.warn('User is not authenticated. Redirecting to login.');
        router.navigate(['/auth/login']);
        return false;
      }

      try {
        const token = authState.token;
        const decodedToken: any = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);

        // 🔹 Token expiration check
        const now = Math.floor(Date.now() / 1000);
        if (!decodedToken.exp || decodedToken.exp < now) {
          console.warn('Token expired. Redirecting to login.');
          router.navigate(['/auth/login']);
          return false;
        }

        // 🔹 Extract user roles properly
        let userRoles: string[] = [];

        if (Array.isArray(decodedToken.roles) && decodedToken.roles.length) {
          userRoles = decodedToken.roles.map((role: any) => role.authority || role.name || role);
        } else if (Array.isArray(decodedToken.authorities) && decodedToken.authorities.length) {
          userRoles = decodedToken.authorities.map((auth: any) => auth.authority || auth);
        } else if (decodedToken.scope) {
          userRoles = decodedToken.scope.split(' ');
        }

        console.log('Extracted User Roles:', userRoles);

        // 🔹 Ensure user has valid roles or approval status
        if (!userRoles.length && decodedToken.approved === false) {
          console.warn('User is not approved yet. Redirecting to login.');
          router.navigate(['/auth/login']);
          return false;
        }

        // 🔹 Role-based access control
        const hasAccess =
          requiredRoles.length === 0 || requiredRoles.some(role => userRoles.includes(role));

        if (!hasAccess) {
          console.warn('User lacks required roles. Redirecting to unauthorized page.');
          router.navigate(['/unauthorized']);
          return false;
        }

        return true;
      } catch (error) {
        console.error('Error decoding token:', error);
        router.navigate(['/auth/login']);
        return false;
      }
    })
  );
};
