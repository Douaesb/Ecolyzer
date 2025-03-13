import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ThresholdAlert } from '../../model/threshold-alert.model';
import { selectAllThresholdAlerts, selectThresholdAlertLoading } from '../../state/threshold/threshold-alert.selectors';
import { loadAlertsByDevice, updateAlertStatus } from '../../state/threshold/threshold-alert.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { Device } from '../../model/device.model';
import { selectAllDevices } from '../../state/device/device.selectors';
import { loadDevices } from '../../state/device/device.actions';
import { selectIsAdmin } from '../../state/auth/auth.selectors';


@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-list.component.html',
})
export class AlertListComponent implements OnInit {
  filters = [
    { label: 'Toutes', value: 'all', active: true },
    { label: 'Non résolues', value: 'UNRESOLVED', active: false },
    { label: 'En cours', value: 'RESOLVING', active: false },
    { label: 'Résolues', value: 'RESOLVED', active: false }
  ];

  selectedFilter = 'all'; 

  alerts$: Observable<ThresholdAlert[]> = this.store.select(selectAllThresholdAlerts).pipe(
    map(alerts => [...alerts].reverse()),
    map(alerts => alerts.filter(alert => this.selectedFilter === 'all' || alert.status === this.selectedFilter))
  );

  loading$: Observable<boolean> = this.store.select(selectThresholdAlertLoading);
  devices$: Observable<Device[]> = this.store.select(selectAllDevices);
  deviceMap$!: Observable<Record<string, string>>;

  showModal = false;
  selectedAlert: ThresholdAlert | null = null;
  constructor(private store: Store, private route: ActivatedRoute, private router: Router) {}

   isAdmin$!: Observable<boolean>;
  

  ngOnInit(): void {
    this.isAdmin$ = this.store.select(selectIsAdmin);
    this.store.dispatch(loadDevices({ page: 0, size: 50 }));
    this.deviceMap$ = this.devices$.pipe(
      map((devices) => {
        return devices.reduce((acc, device) => {
          acc[device.id] = device.name;
          return acc;
        }, {} as Record<string, string>);
      })
    );
    this.route.queryParams.subscribe(params => {
      const deviceId = params['deviceId'];
      if (deviceId) {
        this.store.dispatch(loadAlertsByDevice({ deviceId }));
      } else {
        this.router.navigate(['/devices']);
      }
    });
  }
  
  getDeviceName(deviceId: string, deviceMap: Record<string, string>): string {
    return deviceMap[deviceId] || 'Appareil inconnu';
  }
  getSeverityClass(status: string): string {
    return {
      UNRESOLVED: 'border-red-500',
      RESOLVING: 'border-yellow-500',
      RESOLVED: 'border-green-500'
    }[status] || '';
  }

  getSeverityBgClass(status: string): string {
    return {
      UNRESOLVED: 'bg-red-100 text-red-600',
      RESOLVING: 'bg-yellow-100 text-yellow-600',
      RESOLVED: 'bg-green-100 text-green-600'
    }[status] || '';
  }

 toggleFilter(filter: any) {
    this.filters.forEach(f => f.active = false);
    filter.active = true;
    this.selectedFilter = filter.value;

    this.alerts$ = this.store.select(selectAllThresholdAlerts).pipe(
      map(alerts => [...alerts].reverse()),
      map(alerts => alerts.filter(alert => this.selectedFilter === 'all' || alert.status === this.selectedFilter))
    );
  }

  acknowledgeAlert(alert: ThresholdAlert) {
    let newStatus: 'RESOLVING' | 'RESOLVED';
  
    if (alert.status === 'UNRESOLVED') {
      newStatus = 'RESOLVING';
    } else if (alert.status === 'RESOLVING') {
      newStatus = 'RESOLVED';
    } else {
      return;
    }
  
    this.store.dispatch(updateAlertStatus({ alertId: alert.id, status: newStatus }));
  }

  getActionLabel(status: string): string {
    switch (status) {
      case 'UNRESOLVED': return 'Mark as Resolving';
      case 'RESOLVING': return 'Mark as Resolved';
      case 'RESOLVED': return 'Resolved';
      default: return 'Resolve';
    }
  }
  
  

  viewDetails(alert: ThresholdAlert) {
    this.selectedAlert = alert;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedAlert = null;
  }
}
