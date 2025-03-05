import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ThresholdAlert } from '../../model/threshold-alert.model';
import { selectAllThresholdAlerts, selectThresholdAlertLoading } from '../../state/threshold/threshold-alert.selectors';
import { loadAlertsByDevice, updateAlertStatus } from '../../state/threshold/threshold-alert.actions';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-list.component.html',
})
export class AlertListComponent implements OnInit {
  filters = [
    { label: 'Toutes', value: 'all', active: true },
    { label: 'Critiques', value: 'high', active: false },
    { label: 'Moyennes', value: 'medium', active: false },
    { label: 'Faibles', value: 'low', active: false }
  ];

  alerts$: Observable<ThresholdAlert[]> = this.store.select(selectAllThresholdAlerts);
  loading$: Observable<boolean> = this.store.select(selectThresholdAlertLoading);

  constructor(private store: Store, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const deviceId = params['deviceId'];
      if (deviceId) {
        this.store.dispatch(loadAlertsByDevice({ deviceId }));
      } else {
        this.router.navigate(['/devices']);
      }
    });
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
    console.log('Viewing details for alert:', alert);
    // Implement navigation to detailed view if needed
  }
}
