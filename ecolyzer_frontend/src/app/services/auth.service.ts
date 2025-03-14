import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthResponse } from '../model/auth.model';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  private getHeaders(includeAuth: boolean = false): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers = headers.append('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  login(usernameOrEmail: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, { usernameOrEmail, password }, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        let errorMessage = 'Email ou mot de passe incorrect.';
  
        switch (error.status) {
          case 401:
            errorMessage = 'Email ou mot de passe incorrect.';
            break;
          case 403:
            errorMessage = 'Votre compte doit être approuvé avant connexion.';
            break;
          case 404:
            errorMessage = 'Utilisateur introuvable.';
            break;
        }
  
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  

  register(username: string, email: string, password: string, roles: string[]): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, { username, email, password, roles },
      { headers: this.getHeaders() }
    );
  }

  logout(): Observable<any> {
    return this.http.post(
      `${this.API_URL}/logout`,
      {},
      { headers: this.getHeaders(true) } 
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isTokenExpired(token: string): boolean {
    const decoded: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp && decoded.exp < now;
  }
  
}
