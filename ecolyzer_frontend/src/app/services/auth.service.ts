import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from '../model/auth.model';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, { usernameOrEmail: username, password });
  }

  register(username: string, password: string, roles: string[]): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, { username, password, roles });
  }

  logout(): Observable<void> {
    return new Observable<void>((observer) => {
      localStorage.removeItem('token');
      observer.next();
      observer.complete();
    });
  }
}
