import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedZones, Zone } from '../model/zone.model';

@Injectable({
  providedIn: 'root',
})
export class ZoneService {
  private apiUrl = 'http://localhost:8080/api'; 

  constructor(private http: HttpClient) {}

  getAllZones(page: number, size: number): Observable<PaginatedZones> {
    return this.http.get<PaginatedZones>(`${this.apiUrl}/admin/zones?page=${page}&size=${size}`);
  }
  

  getZoneById(id: string): Observable<Zone> {
    return this.http.get<Zone>(`${this.apiUrl}/user/zones/${id}`);
  }

  createZone(zone: Partial<Zone>): Observable<Zone> {
    return this.http.post<Zone>(`${this.apiUrl}/admin/zones`, zone);
  }

  updateZone(id: string, zone: Partial<Zone>): Observable<Zone> {
    return this.http.put<Zone>(`${this.apiUrl}/admin/zones/${id}`, zone);
  }

  deleteZone(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/zones/${id}`);
  }
}
