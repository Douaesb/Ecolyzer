import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { EnergyConsumption, EnergyConsumptionSummary } from '../model/energy-consumption.model';
import { RoleBasedEndpointService } from './roleBasedEndpoint.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnergyConsumptionService {
  private apiUrl = environment.apiUrl + '/energy';

  constructor(
    private http: HttpClient,
    private roleEndpointService: RoleBasedEndpointService
  ) {}

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
    return this.roleEndpointService.getEndpoint(this.apiUrl, `/device/${deviceId}/current`).pipe(
      switchMap(endpoint => this.http.get<EnergyConsumption>(endpoint)),
      catchError(this.handleError)
    );
  }

  getDailyEnergySummary(deviceId: string, date?: string): Observable<EnergyConsumptionSummary> {
    const query = date ? `?date=${date}` : '';
    return this.roleEndpointService.getEndpoint(this.apiUrl, `/device/${deviceId}/summary${query}`).pipe(
      switchMap(endpoint => this.http.get<EnergyConsumptionSummary>(endpoint)),
      catchError(this.handleError)
    );
  }

  getAllEnergySummaries(): Observable<EnergyConsumptionSummary[]> {
    return this.roleEndpointService.getEndpoint(this.apiUrl, '/summary/all').pipe(
      switchMap(endpoint => this.http.get<EnergyConsumptionSummary[]>(endpoint)),
      catchError(this.handleError)
    );
  }

  getZoneEnergySummary(zoneName: string, date?: string): Observable<EnergyConsumptionSummary> {
    const query = date ? `?date=${date}` : '';
    return this.roleEndpointService.getEndpoint(this.apiUrl, `/zone/${zoneName}/summary${query}`).pipe(
      switchMap(endpoint => this.http.get<EnergyConsumptionSummary>(endpoint)),
      catchError(this.handleError)
    );
  }
}