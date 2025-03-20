// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ArcElement, BarElement, Chart, DoughnutController } from 'chart.js';
import { LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, BarController } from 'chart.js';
import { WebSocketService } from './services/WebSocket.service';
import { addNotification } from './state/notifications/notification.actions';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, DoughnutController, ArcElement, BarElement,BarController);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Eco Energy Platform';
  private subscriptions: Subscription[] = [];



  constructor(
    private webSocketService: WebSocketService,
    private store: Store 
  ) {}


  ngOnInit(): void {
    this.subscriptions.push(
      this.webSocketService.getAlerts().subscribe(alert => {
        console.log('🚨 New alert received:', alert);
        this.store.dispatch(addNotification({ alert }));
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}