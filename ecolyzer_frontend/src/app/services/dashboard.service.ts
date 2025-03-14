import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnergyDashboard } from '../model/EnergyDashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8080/api/dashboard';

  constructor(private http: HttpClient) {}

  getDashboardData(period: string = 'day'): Observable<EnergyDashboard> {
    return this.http.get<EnergyDashboard>(`${this.apiUrl}?period=${period}`);
  }
}
