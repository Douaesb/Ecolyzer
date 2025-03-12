import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { ThresholdAlert } from '../model/threshold-alert.model';
import { RoleBasedEndpointService } from './roleBasedEndpoint.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ThresholdAlertService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private roleEndpointService: RoleBasedEndpointService
  ) {}

  getAlertsByDevice(deviceId: string): Observable<ThresholdAlert[]> {
    return this.roleEndpointService.getEndpoint(this.apiUrl, `/threshold-alerts/device/${deviceId}`).pipe(
      switchMap(endpoint => this.http.get<ThresholdAlert[]>(endpoint))
    );
  }

  updateAlertStatus(alertId: string, status: string): Observable<ThresholdAlert> {
    const params = new HttpParams().set('status', status);
    return this.roleEndpointService.getEndpoint(this.apiUrl, `/alerts/${alertId}/status`).pipe(
      switchMap(endpoint => this.http.put<ThresholdAlert>(endpoint, {}, { params }))
    );
  }

  deleteAlert(alertId: string): Observable<void> {
    return this.roleEndpointService.getEndpoint(this.apiUrl, `/threshold-alerts/${alertId}`).pipe(
      switchMap(endpoint => this.http.delete<void>(endpoint))
    );
  }
}
