import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, Event } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent, HeaderComponent],
  template: `
    <div class="app-container">
      <div class="content-container">
        <app-sidebar *ngIf="!isAuthPage"></app-sidebar>
        <main [class.full-width]="isAuthPage">
          <app-header *ngIf="!isAuthPage"></app-header>
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .content-container {
      display: flex;
      flex: 1;
    }
    main {
      flex: 1;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .full-width {
      padding: 0;
    }
  `]
})
export class AppComponent {
  title = 'Eco Energy Platform';
  isAuthPage = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isAuthPage = event.urlAfterRedirects.includes('/login') || 
                         event.urlAfterRedirects.includes('/register');
    });
  }
}