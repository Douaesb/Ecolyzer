import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { PaginatedZones, Zone } from '../model/zone.model';
import { RoleBasedEndpointService } from './roleBasedEndpoint.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ZoneService {
  private apiUrl = environment.apiUrl; 

  constructor(
    private http: HttpClient,
    private roleEndpointService: RoleBasedEndpointService
  ) {}

  getAllZones(page: number, size: number): Observable<PaginatedZones> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.roleEndpointService.getEndpoint(this.apiUrl, '/zones').pipe(
      switchMap(endpoint => this.http.get<PaginatedZones>(endpoint, { params }))
    );
  }

  getZoneById(id: string): Observable<Zone> {
    return this.roleEndpointService.getEndpoint(this.apiUrl, `/zones/${id}`).pipe(
      switchMap(endpoint => this.http.get<Zone>(endpoint))
    );
  }

  createZone(zone: Partial<Zone>): Observable<Zone> {
    return this.roleEndpointService.getEndpoint(this.apiUrl, '/zones').pipe(
      switchMap(endpoint => this.http.post<Zone>(endpoint, zone))
    );
  }

  updateZone(id: string, zone: Partial<Zone>): Observable<Zone> {
    return this.roleEndpointService.getEndpoint(this.apiUrl, `/zones/${id}`).pipe(
      switchMap(endpoint => this.http.put<Zone>(endpoint, zone))
    );
  }

  deleteZone(id: string): Observable<void> {
    return this.roleEndpointService.getEndpoint(this.apiUrl, `/zones/${id}`).pipe(
      switchMap(endpoint => this.http.delete<void>(endpoint))
    );
  }
}
