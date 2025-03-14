import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="app-container">
      <div class="content-container">
        <app-sidebar></app-sidebar>
        <main>
          <app-header></app-header>
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
  `]
})
export class MainLayoutComponent {}