import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { Device } from '../../model/device.model';
import {
  selectAllDevices,
  selectDeviceLoading,
} from '../../state/device/device.selectors';
import {
  loadDevices,
  createDevice,
  updateDevice,
  deleteDevice,
  searchDevices,
  filterDevices,
  getDevicesByZone,
} from '../../state/device/device.actions';
import { selectAllZones } from '../../state/zone/zone.selectors';
import { loadZones } from '../../state/zone/zone.actions';
import { Zone } from '../../model/zone.model';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './device-list.component.html',
  styles: [
    `
      @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
    `,
  ],
})
export class DeviceListComponent implements OnInit {
  devices$: Observable<Device[]> = this.store.select(selectAllDevices);
  loading$: Observable<boolean> = this.store.select(selectDeviceLoading);
  zones$: Observable<Zone[]> = this.store.select(selectAllZones);
  selectedDevice: Partial<Device> | null = null;
  zoneMap$!: Observable<Record<string, string>>;
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(loadDevices({ page: 0, size: 10 }));
    this.store.dispatch(loadZones({ page: 0, size: 50 }));

    this.zoneMap$ = this.zones$.pipe(
      map((zones) => {
        return zones.reduce((acc, zone) => {
          acc[zone.id] = zone.name;
          return acc;
        }, {} as Record<string, string>);
      })
    );
  }

  getZoneName(zoneId: string, zoneMap: Record<string, string>): string {
    return zoneMap[zoneId] || 'Zone inconnue';
  }

  openEditModal(device: Device | null): void {
    this.selectedDevice = device
      ? { ...device }
      : {
          name: '',
          serialNum: undefined,
          energyThreshold: undefined,
          zoneId: undefined,
        };
  }

  closeEditModal(): void {
    this.selectedDevice = null;
  }

  onSaveDevice(): void {
    if (!this.selectedDevice) {
      console.error('No selected device to save');
      return;
    }

    if (this.selectedDevice.id) {
      this.store.dispatch(
        updateDevice({
          id: this.selectedDevice.id,
          device: this.selectedDevice as Device,
        })
      );
    } else {
      const newDevice: Partial<Device> = {
        name: this.selectedDevice.name,
        serialNum: this.selectedDevice.serialNum,
        energyThreshold: this.selectedDevice.energyThreshold,
        zoneId: this.selectedDevice.zoneId,
      };
      const deviceToCreate: Device = {
        ...newDevice,
        id: newDevice.id || '',
      } as Device;
      this.store.dispatch(createDevice({ device: deviceToCreate }));
    }

    this.closeEditModal();
  }

  onDeleteDevice(deviceId: string): void {
    if (!deviceId) {
      console.error('No device ID provided for deletion');
      return;
    }
    this.store.dispatch(deleteDevice({ id: deviceId }));
  }

  searchDevices(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.store.dispatch(
        searchDevices({ name: target.value, page: 0, size: 10 })
      );
    }
  }

  filterDevices(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.store.dispatch(
        filterDevices({ serialNum: Number(target.value), page: 0, size: 10 })
      );
    }
  }
  getDevicesByZone(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      const zoneId = target.value;
      console.log('zoneId:', zoneId);
  
      if (zoneId === 'all') {
        console.log('Dispatching loadDevices');
        this.store.dispatch(loadDevices({ page: 0, size: 10 }));
      } else {
        console.log('Dispatching getDevicesByZone with zoneId:', zoneId);
        this.store.dispatch(getDevicesByZone({ zoneId}));
      }
    }
  }
  
}
