import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DeviceListComponent } from './components/devices/device-list.component';
import { ZoneListComponent } from './components/zones/zone-list.component';
import { AlertListComponent } from './components/alerts/alert-list.component';
import { EnergyReportComponent } from './components/reports/energy-report.component';
import { UserManagementComponent } from './components/users/user-management.component';
import { RegisterComponent } from './components/auth/register.component';
import { LoginComponent } from './components/auth/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'devices', component: DeviceListComponent },
  { path: 'zones', component: ZoneListComponent },
  { path: 'alerts', component: AlertListComponent },
  { path: 'reports', component: EnergyReportComponent },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'users',
    component: UserManagementComponent,
  },
];
