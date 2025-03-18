import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { selectAuthUser } from '../../state/auth/auth.selectors';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
<header class="bg-white border-b border-gray-200 ml-6 sm:ml-0">
<div class="px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Search -->
          <div class="flex-1 min-w-0 max-w-xs">
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="search"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="Search"
              />
            </div>
          </div>

          <!-- Right side -->
          <div class="flex items-center">
            

            <!-- Profile dropdown -->
            <div class="ml-3 relative">
              <div class="flex items-center">
                <button
                  class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <div class="h-8 w-8 rounded-full">
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
                <span class="ml-3 text-sm font-medium text-gray-700"
                  >{{ username$ | async }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  username$: Observable<string | null>;

  constructor(private store: Store) {
    this.username$ = this.store.pipe(select(selectAuthUser)); 
  }
}
