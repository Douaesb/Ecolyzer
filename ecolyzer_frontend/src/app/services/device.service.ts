import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Device, PaginatedDevices } from '../model/device.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = 'http://localhost:8080/api/admin/devices';

  constructor(private http: HttpClient) {}

  getDevices(page: number, size: number): Observable<PaginatedDevices> {
    return this.http.get<PaginatedDevices>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  createDevice(device: Device): Observable<Device> {
    return this.http.post<Device>(this.apiUrl, device);
  }

  updateDevice(id: string, device: Device): Observable<Device> {
    return this.http.put<Device>(`${this.apiUrl}/${id}`, device);
  }

  deleteDevice(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchDevices(name: string, page: number, size: number): Observable<PaginatedDevices> {
    return this.http.get<PaginatedDevices>(`${this.apiUrl}/search?name=${name}&page=${page}&size=${size}`);
  }

  filterDevices(serialNum: number, page: number, size: number): Observable<PaginatedDevices> {
    return this.http.get<PaginatedDevices>(`${this.apiUrl}/filter?serialNum=${serialNum}&page=${page}&size=${size}`);
  }

  getDevicesByZone(zoneId: string): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.apiUrl}/zone/${zoneId}`);
  }
}
