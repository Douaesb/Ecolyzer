import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Device, PaginatedDevices } from '../model/device.model';
import { RoleBasedEndpointService } from './roleBasedEndpoint.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private roleEndpointService: RoleBasedEndpointService
  ) {}

  getDevices(page: number, size: number): Observable<PaginatedDevices> {
    return this.roleEndpointService.getEndpoint(this.apiUrl, `/devices?page=${page}&size=${size}`).pipe(
      switchMap(endpoint => this.http.get<PaginatedDevices>(endpoint))
    );
  }

  createDevice(device: Device): Observable<Device> {
    return this.roleEndpointService.getEndpoint(this.apiUrl, '/devices').pipe(
      switchMap(endpoint => this.http.post<Device>(endpoint, device))
    );
  }

  updateDevice(id: string, device: Device): Observable<Device> {
    return this.roleEndpointService.getEndpoint(this.apiUrl, `/devices/${id}`).pipe(
      switchMap(endpoint => this.http.put<Device>(endpoint, device))
    );
  }

  deleteDevice(id: string): Observable<void> {
    return this.roleEndpointService.getEndpoint(this.apiUrl, `/devices/${id}`).pipe(
      switchMap(endpoint => this.http.delete<void>(endpoint))
    );
  }

  searchDevices(name: string, page: number, size: number): Observable<PaginatedDevices> {
    return this.roleEndpointService.getEndpoint(this.apiUrl, `/devices/search?name=${name}&page=${page}&size=${size}`).pipe(
      switchMap(endpoint => this.http.get<PaginatedDevices>(endpoint))
    );
  }

  filterDevices(serialNum: number, page: number, size: number): Observable<PaginatedDevices> {
    return this.roleEndpointService.getEndpoint(this.apiUrl, `/devices/filter?serialNum=${serialNum}&page=${page}&size=${size}`).pipe(
      switchMap(endpoint => this.http.get<PaginatedDevices>(endpoint))
    );
  }

  getDevicesByZone(zoneId: string, page: number, pageSize: number):  Observable<PaginatedDevices> {  
    return this.roleEndpointService.getEndpoint(this.apiUrl, `/devices/zone/${zoneId}?page=${page}&size=${pageSize}`).pipe(
      switchMap(endpoint => this.http.get<PaginatedDevices>(endpoint))
    );
  }
}
