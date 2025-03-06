import { Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
import { AuthGuard } from './guards/auth.guard'; 

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./components/auth/login.component').then(m => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./components/auth/register.component').then(m => m.RegisterComponent),
      }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    // canActivate: [() => AuthGuard(['ROLE_USER', 'ROLE_ADMIN'])],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'devices',
        loadComponent: () =>
          import('./components/devices/device-list.component').then(m => m.DeviceListComponent),
      },
      {
        path: 'zones',
        loadComponent: () =>
          import('./components/zones/zone-list.component').then(m => m.ZoneListComponent),
      },
      {
        path: 'alerts',
        loadComponent: () =>
          import('./components/alerts/alert-list.component').then(m => m.AlertListComponent),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./components/reports/energy-report.component').then(m => m.EnergyReportComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./components/users/user-management.component').then(m => m.UserManagementComponent),
      },
      {
        path: 'energy',
        loadComponent: () =>
          import('./components/energy/energy-consumption.component').then(m => m.EnergyConsumptionComponent),
      },
    ]
  },
  { path: '**', redirectTo: 'dashboard' } 
];
