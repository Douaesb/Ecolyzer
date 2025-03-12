import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode';
import { AuthState } from '../state/auth/auth.reducer';

@Injectable({
  providedIn: 'root',
})
export class RoleBasedEndpointService {
  private userRole$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private readonly store: Store<{ auth: AuthState }>) {
    // Subscribe to the auth state to get the token
    this.store.select(state => state.auth.token).subscribe(token => {
      console.log('Token from store:', token); // Log the token
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          console.log('Decoded token:', decodedToken); // Log the decoded token
          const role = decodedToken.roles?.[0] || '';
          console.log('Extracted role:', role); // Log the extracted role
          this.userRole$.next(role);
        } catch (error) {
          console.error('Error decoding token:', error); // Log decoding errors
          this.userRole$.next('');
        }
      } else {
        this.userRole$.next('');
      }
    });
  }

  getEndpoint(apiUrl: string, prefix: string): Observable<string> {
    return this.userRole$.asObservable().pipe(
      map(role => {
        console.log('Current role:', role); // Log the current role
        const endpoint = role === 'ROLE_ADMIN' ? `${apiUrl}/admin${prefix}` : `${apiUrl}/user${prefix}`;
        console.log('Constructed endpoint:', endpoint); // Log the constructed endpoint
        return endpoint;
      })
    );
  }
}
