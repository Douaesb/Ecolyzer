import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as AuthActions from '../../state/auth/auth.action';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="w-64 bg-white border-r border-gray-200">
      <!-- Logo -->
      <div class="p-4 border-b border-gray-200">
        <div class=" flex items-center justify-center w-full">
          <img src="/assets/ecolyzer.png" alt="Ecolyzer" class="h-10" />
        </div>
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-1">
        <a
          routerLink="/dashboard"
          routerLinkActive="bg-emerald-50 text-emerald-600"
          class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          <svg
            class="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Dashboard
        </a>

        <a
          routerLink="/devices"
          routerLinkActive="bg-emerald-50 text-emerald-600"
          class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          <svg
            class="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
            />
          </svg>
          Devices
        </a>

        <a
          routerLink="/zones"
          routerLinkActive="bg-emerald-50 text-emerald-600"
          class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          <svg
            class="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          Zones
        </a>

        <a
          routerLink="/alerts"
          routerLinkActive="bg-emerald-50 text-emerald-600"
          class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          <svg
            class="w-5 h-5 mr-3"
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
          Alerts
        </a>

        <a
          routerLink="/reports"
          routerLinkActive="bg-emerald-50 text-emerald-600"
          class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          <svg
            class="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 17v-2m4 2v-4m4 4v-6m-9 6h10M5 3h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
            />
          </svg>

          Reports
        </a>
        <a
          routerLink="/energy"
          routerLinkActive="bg-emerald-50 text-emerald-600"
          class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          <svg
            class="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 17v-2m4 2v-4m4 4v-6m-9 6h10M5 3h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
            />
          </svg>

          energy
        </a>
        <a
          routerLink="/users"
          routerLinkActive="bg-emerald-50 text-emerald-600"
          class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          <svg
            class="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          Users
        </a>
        <a
          (click)="onSubmit()"
          routerLinkActive="bg-emerald-50 text-emerald-600"
          class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          <svg
            class="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H9m4-7H5a2 2 0 00-2 2v14a2 2 0 002 2h8"
            />
          </svg>
          Logout
        </a>
      </nav>
    </aside>
  `,

  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
})
export class SidebarComponent {
  constructor(private readonly store: Store) {}
  onSubmit(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
