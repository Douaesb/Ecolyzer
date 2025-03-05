import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ThresholdAlert } from '../model/threshold-alert.model';

@Injectable({
  providedIn: 'root'
})
export class ThresholdAlertService {
  private baseUrl = 'http://localhost:8080/api'; 

  constructor(private http: HttpClient) {}

  getAlertsByDevice(deviceId: string): Observable<ThresholdAlert[]> {
    return this.http.get<ThresholdAlert[]>(`${this.baseUrl}/admin/threshold-alerts/device/${deviceId}`);
  }

  updateAlertStatus(alertId: string, status: string): Observable<ThresholdAlert> {
    return this.http.put<ThresholdAlert>(`${this.baseUrl}/alerts/${alertId}/status?status=${status}`, {});
  }

  deleteAlert(alertId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/threshold-alerts/${alertId}`);
  }
}
