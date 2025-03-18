import { Component, HostListener } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import * as AuthActions from "../../state/auth/auth.action"
import { Store } from "@ngrx/store"
import { Observable } from "rxjs"
import { selectIsAdmin } from "../../state/auth/auth.selectors"

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Mobile sidebar toggle button -->
    <button 
      (click)="toggleSidebar()" 
      class="lg:hidden fixed top-8 left-0 z-50 p-2 rounded-md bg-white shadow-md text-gray-700 hover:bg-gray-100 focus:outline-none"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-6 w-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          *ngIf="!isSidebarOpen" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M4 6h16M4 12h16M4 18h16"
        />
        <path 
          *ngIf="isSidebarOpen" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    <!-- Overlay for mobile -->
    <div 
      *ngIf="isSidebarOpen" 
      (click)="closeSidebar()"
      class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
    ></div>

    <!-- Sidebar -->
    <aside 
      [class.translate-x-0]="isSidebarOpen"
      [class.-translate-x-full]="!isSidebarOpen"
      class="fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static"
    >
      <!-- Logo -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-center w-full">
          <img src="/assets/ecolyzer.png" alt="Ecolyzer" class="h-10" />
        </div>
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
        <a
          routerLink="/dashboard"
          routerLinkActive="bg-emerald-50 text-emerald-600"
          class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50"
          (click)="onMobileNavClick()"
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
          (click)="onMobileNavClick()"
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
          (click)="onMobileNavClick()"
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
          routerLink="/reports"
          routerLinkActive="bg-emerald-50 text-emerald-600"
          class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50"
          (click)="onMobileNavClick()"
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
          (click)="onMobileNavClick()"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 2L3 14h8l-1 8L21 10h-8l1-8z"/>
          </svg>
          Energy
        </a>
        
        <a *ngIf="isAdmin$ | async"
          routerLink="/users"
          routerLinkActive="bg-emerald-50 text-emerald-600"
          class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50"
          (click)="onMobileNavClick()"
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
          class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer"
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
      
      @media (min-width: 1024px) {
        :host {
          position: sticky;
          top: 0;
        }
      }
    `,
  ],
})
export class SidebarComponent {
  isAdmin$!: Observable<boolean>
  isSidebarOpen = false

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.isAdmin$ = this.store.select(selectIsAdmin)

    // Check screen size on init
    this.checkScreenSize()
  }

  @HostListener("window:resize")
  checkScreenSize() {
    // Auto-open sidebar on large screens
    this.isSidebarOpen = window.innerWidth >= 1024
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen
  }

  closeSidebar() {
    if (window.innerWidth < 1024) {
      this.isSidebarOpen = false
    }
  }

  // Close sidebar on mobile after navigation
  onMobileNavClick() {
    if (window.innerWidth < 1024) {
      this.isSidebarOpen = false
    }
  }

  onSubmit(): void {
    this.store.dispatch(AuthActions.logout())
  }
}

