import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DeviceListComponent } from './components/devices/device-list.component';
import { ZoneListComponent } from './components/zones/zone-list.component';
import { AlertListComponent } from './components/alerts/alert-list.component';
import { EnergyReportComponent } from './components/reports/energy-report.component';
import { UserManagementComponent } from './components/users/user-management.component';
import { MainLayoutComponent } from './main-layout.component';

export const routes: Routes = [
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./components/auth/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./components/auth/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'devices', component: DeviceListComponent },
      { path: 'zones', component: ZoneListComponent },
      { path: 'alerts', component: AlertListComponent },
      { path: 'reports', component: EnergyReportComponent },
      { path: 'users', component: UserManagementComponent },
    ],
  },
];
