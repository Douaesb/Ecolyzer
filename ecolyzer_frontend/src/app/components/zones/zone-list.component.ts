import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { Zone } from '../../model/zone.model';
import { selectAllZones, selectZoneLoading } from '../../state/zone/zone.selectors';
import { Store } from '@ngrx/store';
import { createZone, deleteZone, loadZones, updateZone } from '../../state/zone/zone.actions';
import { FormsModule } from '@angular/forms';
import { selectIsAdmin } from '../../state/auth/auth.selectors';
import { Router } from '@angular/router';

@Component({
  selector: 'app-zone-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './zone-list.component.html',
  styles: [`
    @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
  `]
})
export class ZoneListComponent implements OnInit {
  zones$: Observable<Zone[]> = this.store.select(selectAllZones);
  loading$: Observable<boolean> = this.store.select(selectZoneLoading);
  isAdmin$!: Observable<boolean>;

  selectedZone: Partial<Zone> | null = null;

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.store.dispatch(loadZones({ page: 0, size: 10 }));
    this.isAdmin$ = this.store.select(selectIsAdmin);

  }

  goToDevices(zoneId: string): void {
    this.router.navigate(['/devices', zoneId]); 
  }

  openEditModal(zone: Zone | null): void {
    this.selectedZone = zone ? { ...zone } : { name: '', description: '', location: '', devices: [] };
  }

  closeEditModal(): void {
    this.selectedZone = null;
  }

  onSaveZone(): void {
    if (!this.selectedZone) {
      console.error('No selected zone to save');
      return;
    }
    
    console.log('Saving zone:', this.selectedZone);
    
    if (this.selectedZone.id) {
      console.log('Updating existing zone with ID:', this.selectedZone.id);
      this.store.dispatch(updateZone({ 
        id: this.selectedZone.id, 
        zone: this.selectedZone as Zone 
      }));
    } else {
      console.log('Creating new zone');
      const newZone: Partial<Zone> = {
        name: this.selectedZone.name,
        description: this.selectedZone.description,
        location: this.selectedZone.location,
        devices: []
      };
      this.store.dispatch(createZone({ zone: newZone }));
    }
    
    this.closeEditModal();
  }
  
  onDeleteZone(zoneId: string): void {
    console.log('Deleting zone with ID:', zoneId);
    if (!zoneId) {
      console.error('No zone ID provided for deletion');
      return;
    }
    this.store.dispatch(deleteZone({ id: zoneId }));
  }
}
