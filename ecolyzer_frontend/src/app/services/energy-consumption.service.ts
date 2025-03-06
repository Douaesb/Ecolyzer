import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EnergyConsumption, EnergyConsumptionSummary } from '../model/energy-consumption.model';

@Injectable({
  providedIn: 'root',
})
export class EnergyConsumptionService {
  private apiUrl = 'http://localhost:8080/api/energy';

  constructor(private http: HttpClient) {}

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    if (error.status === 404) {
      errorMessage = 'No summary found'; 
    } else if (error.status === 500) {
      errorMessage = 'Server error, please try again later';
    }
    return throwError(errorMessage);
  }

  getCurrentEnergyConsumption(deviceId: string): Observable<EnergyConsumption> {
    return this.http.get<EnergyConsumption>(`${this.apiUrl}/admin/device/${deviceId}/current`).pipe(
      catchError(this.handleError) 
    );
  }

  getDailyEnergySummary(deviceId: string, date?: string): Observable<EnergyConsumptionSummary> {
    const query = date ? `?date=${date}` : '';
    return this.http.get<EnergyConsumptionSummary>(`${this.apiUrl}/admin/device/${deviceId}/summary${query}`).pipe(
      catchError(this.handleError) 
    );
  }

  getAllEnergySummaries(): Observable<EnergyConsumptionSummary[]> {
    return this.http.get<EnergyConsumptionSummary[]>(`${this.apiUrl}/admin/summary/all`).pipe(
      catchError(this.handleError) 
    );
  }

  getZoneEnergySummary(zoneName: string, date?: string): Observable<EnergyConsumptionSummary> {
    const query = date ? `?date=${date}` : '';
    return this.http.get<EnergyConsumptionSummary>(`${this.apiUrl}/admin/zone/${zoneName}/summary${query}`).pipe(
      catchError(this.handleError) 
    );
  }
}
