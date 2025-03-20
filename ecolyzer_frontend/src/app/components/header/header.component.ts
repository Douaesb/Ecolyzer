import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, of, timer } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { selectAuthUser } from '../../state/auth/auth.selectors';
import { WebSocketService } from '../../services/WebSocket.service';
import { ThresholdAlert } from '../../model/threshold-alert.model';
import { ToastrService } from 'ngx-toastr';
import {
  addNotification,
  loadNotifications,
  markAlertsAsRead,
  markAlertAsRead,
  clearResolvedAlerts,
  filterAlertsByStatus
} from '../../state/notifications/notification.actions';
import { 
  selectFilteredNotifications,
  selectUnreadNotificationsCount,
  selectActiveNotifications,
  selectAllNotifications
} from '../../state/notifications/notifications.selectors';
import { RelativeTimePipe } from '../../pipes/relative-time.pipe';
import { loadAlertsByDevice } from '../../state/threshold/threshold-alert.actions';
import { Router } from '@angular/router';
import { takeUntil, tap, switchMap } from 'rxjs/operators';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RelativeTimePipe, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="bg-white border-b border-gray-200 ml-6 sm:ml-0">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          
          
          <div class="flex items-center justify-end flex-1">
            <!-- Notifications -->
            <div class="relative mr-4">
              <button
                class="relative p-2 rounded-full transition-colors duration-200"
                [ngClass]="{
                  'bg-red-50 hover:bg-red-100': unreadAlertCount > 0,
                  'bg-gray-100 hover:bg-gray-200': unreadAlertCount === 0
                }"
                (click)="toggleAlertDropdown()"
                #notificationButton
              >
                <svg
                  class="h-6 w-6"
                  [ngClass]="{
                    'text-red-500': unreadAlertCount > 0,
                    'text-gray-500': unreadAlertCount === 0
                  }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span
                  *ngIf="unreadAlertCount > 0"
                  class="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full"
                  [ngClass]="{'animate-pulse': hasNewAlert}"
                >
                  {{ unreadAlertCount }}
                </span>
              </button>

              <!-- Dropdown alerts -->
              <div
                *ngIf="showAlertDropdown"
                class="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-lg rounded-lg z-50 overflow-hidden"
              >
                <div class="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                  <h3 class="text-sm font-medium">Notifications</h3>
                  
                </div>
                
                
                
                <div class="max-h-60 overflow-y-auto">
                  <ul class="divide-y divide-gray-200">
                    <li
                      *ngFor="let alert of (alerts$ | async)"
                      (click)="viewAlerts(getDeviceId(alert)); markAsRead(alert.id)"
                      class="p-3 text-sm hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                      [ngClass]="{
                        'bg-blue-50': !alert.isRead,
                        'bg-white': alert.isRead
                      }"
                    >
                      <div class="flex items-start">
                        <div 
                          class="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full mr-2" 
                          [ngClass]="{
                            'bg-red-500': alert.status === 'UNRESOLVED',
                            'bg-yellow-500': alert.status === 'RESOLVING',
                            'bg-green-500': alert.status === 'RESOLVED'
                          }"
                        ></div>
                        <div class="flex-1">
                          <div class="font-medium" [ngClass]="{'font-bold': !alert.isRead}">
                            {{ alert.alertMessage }}
                          </div>
                          <div class="text-xs text-gray-500 mt-1">
                            Device: {{ alert.deviceName || alert.device?.name || 'Unknown' }}
                          </div>
                          <div class="flex justify-between items-center mt-1">
                            <span class="text-xs text-gray-500">
                              {{ alert.timestamp | date : 'dd MMM, HH:mm' }}
                            </span>
                            <span class="text-xs text-gray-400">
                              {{ alert.receivedAt | relativeTime }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>

                    <li
                      *ngIf="(alerts$ | async)?.length === 0"
                      class="p-4 text-sm text-gray-500 text-center"
                    >
                      No notifications
                    </li>
                  </ul>
                </div>
                
                
              </div>
            </div>

            <!-- Profile dropdown -->
            <div class="ml-3 relative">
              <div class="flex items-center">
                <button
                  class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <div class="h-8 w-8 rounded-full text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M12 14c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z" />
                    </svg>
                  </div>
                </button>
                <span class="ml-3 text-sm font-medium text-gray-700">
                  {{ username$ | async }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent implements OnInit, OnDestroy {
  username$: Observable<string | null>;
  alerts$: Observable<ThresholdAlert[]>;
  connectionStatus$: Observable<boolean>;
  unreadAlertCount = 0;
  showAlertDropdown = false;
  currentFilter: 'UNRESOLVED' | 'RESOLVING' | 'RESOLVED' | 'ALL' = 'ALL';
  hasNewAlert = false;
  
  private subscriptions: Subscription[] = [];
  private alerts: ThresholdAlert[] = [];

  constructor(
    private store: Store,
    private webSocketService: WebSocketService,
    private toastr: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.username$ = this.store.pipe(select(selectAuthUser));
    this.alerts$ = this.store.pipe(select(selectFilteredNotifications));
    this.connectionStatus$ = this.webSocketService.connectionStatus$;
  }

  ngOnInit() {
    // Load initial notifications
    this.store.dispatch(loadNotifications());
  
    // Subscribe to unread notification count
    const unreadCountSub = this.store
      .pipe(select(selectUnreadNotificationsCount))
      .subscribe(count => {
        this.unreadAlertCount = count;
        this.cdr.markForCheck();
      });
    this.subscriptions.push(unreadCountSub);
  
    // Handle new alerts from WebSocket
    const alertSub = this.webSocketService.getAlerts().subscribe(alert => {
      console.log('🚨 New alert received:', alert);
      
      const alertWithMetadata = {
        ...alert,
        deviceId: alert.device?.id || alert.deviceId,
        deviceName: alert.device?.name || alert.deviceName,
        receivedAt: new Date().toISOString(),
        isRead: false
      };
      
      this.store.dispatch(addNotification({ alert: alertWithMetadata }));
      
      // Show animation on the notification bell
      this.hasNewAlert = true;
      setTimeout(() => {
        this.hasNewAlert = false;
        this.cdr.markForCheck();
      }, 3000);
      
      // Show toast notification
      this.showToastNotification(alert);
    });
    this.subscriptions.push(alertSub);
    
    // Add mapping for device IDs
    const alertsMappingSub = this.store
      .pipe(select(selectAllNotifications))
      .subscribe((alerts) => {
        this.alerts = alerts.map((alert) => ({
          ...alert,
          deviceId: alert.device?.id || 'Unknown', 
        }));
        this.cdr.markForCheck();
      });
    this.subscriptions.push(alertsMappingSub);
    
    // Set up click outside handler to close dropdown
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }
  
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const notificationButton = document.querySelector('#notificationButton');
    const notificationDropdown = document.querySelector('.dropdown-alerts');
    
    if (this.showAlertDropdown && 
        notificationButton && 
        notificationDropdown && 
        !notificationButton.contains(target) && 
        !notificationDropdown.contains(target)) {
      this.showAlertDropdown = false;
      this.cdr.markForCheck();
    }
  }

  toggleAlertDropdown() {
    this.showAlertDropdown = !this.showAlertDropdown;
    
    // Mark all as read after a delay if dropdown is opened
    if (this.showAlertDropdown && this.unreadAlertCount > 0) {
      setTimeout(() => {
        this.store.dispatch(markAlertsAsRead());
      }, 2000);
    }
  }
  
  markAsRead(id: string) {
    this.store.dispatch(markAlertAsRead({ id }));
  }
  
  markAllAsRead() {
    this.store.dispatch(markAlertsAsRead());
  }
  
  clearResolved() {
    this.store.dispatch(clearResolvedAlerts());
  }
  
  filterAlerts(status: 'UNRESOLVED' | 'RESOLVING' | 'RESOLVED' | 'ALL') {
    this.currentFilter = status;
    this.store.dispatch(filterAlertsByStatus({ status }));
  }

  viewAlerts(deviceId: string): void {
    console.log('Viewing alerts for device with ID:', deviceId);
    this.store.dispatch(loadAlertsByDevice({ deviceId }));
    this.router.navigate(['/alerts'], { queryParams: { deviceId } });
    this.showAlertDropdown = false;
  }
  
  viewAllAlerts(): void {
    this.router.navigate(['/alerts']);
    this.showAlertDropdown = false;
  }

  getDeviceId(alert: ThresholdAlert): string {
    return alert.device?.id || alert.deviceId || 'unknown';
  }
  
  reconnectWebSocket() {
    this.webSocketService.connect();
  }
  
  private showToastNotification(alert: ThresholdAlert) {
    const deviceName = alert.deviceName || alert.device?.name || 'Unknown device';
    
    this.toastr.warning(
      `${alert.alertMessage} (${deviceName})`,
      '🚨 Alert Detected',
      {
        timeOut: 5000,
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-right',
        tapToDismiss: true,
        onActivateTick: true
      }
    );
  }

  ngOnDestroy() {
    // Clean up all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // Remove click outside handler
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }
}