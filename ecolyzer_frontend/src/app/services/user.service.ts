import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/admin/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  updateUserRoles(id: string, roles: string[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/roles`, roles);
  }

  approveUser(id: string): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/approve-user/${id}`, {});
  }

  deleteUser(id: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`, {});
  }
}
