import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, switchMap, tap, retry } from 'rxjs/operators';
import { EnergyDashboard } from '../model/EnergyDashboard';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { ThresholdAlert } from '../model/threshold-alert.model';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private dashboardSubject = new Subject<EnergyDashboard>();
  private alertSubject = new Subject<ThresholdAlert>();
  private connectionStatus = new BehaviorSubject<boolean>(false);
  private reconnectAttempts = 0;
  private stompClient: Client | null = null;
  private MAX_RECONNECT_ATTEMPTS = 5;

  constructor() {
    this.connect();
  }
  get connectionStatus$(): Observable<boolean> {
    return this.connectionStatus.asObservable();
  }

  connect(): Observable<EnergyDashboard> {
    if (this.stompClient && this.stompClient.connected) {
      return this.dashboardSubject.asObservable();
    }

    if (this.stompClient) {
      this.disconnect();
    }

    const token = localStorage.getItem('auth_token');
    const baseUrl = 'http://localhost:8080';
    
    this.stompClient = new Client({
      webSocketFactory: () => {
        const ws = new SockJS(`${baseUrl}/dashboard-updates`, null, {
          transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
        });
        ws.onopen = () => {
          console.log('✅ WebSocket opened');
          this.reconnectAttempts = 0;
        };
        ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          this.connectionStatus.next(false);
        };
        ws.onclose = (event) => {
          console.log('🔴 WebSocket closed:', event.code, event.reason);
          this.connectionStatus.next(false);
          
          // Implement automatic reconnection with exponential backoff
          if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1})`);
            setTimeout(() => {
              this.reconnectAttempts++;
              this.connect();
            }, delay);
          } else {
            console.error('❌ Maximum reconnection attempts reached');
          }
        };
        return ws;
      },
      connectHeaders: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      debug: (str) => console.log(str),
      reconnectDelay: 10000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('✅ STOMP connection established');
        this.connectionStatus.next(true);
        this.reconnectAttempts = 0;

        this.stompClient?.subscribe('/topic/dashboard-updates', (message) => {
          try {
            const dashboardData: EnergyDashboard = JSON.parse(message.body);
            console.log('📊 Real-time data received:', dashboardData);
            this.dashboardSubject.next(dashboardData);
          } catch (error) {
            console.error('❌ Parsing error (dashboard):', error);
          }
        });

        this.stompClient?.subscribe('/topic/alerts', (message) => {
          try {
            const alertData: ThresholdAlert = JSON.parse(message.body);
            console.log('🚨 Alert received:', alertData);
            this.alertSubject.next({
              ...alertData,
              receivedAt: new Date().toISOString(),
              isRead: false
            });
          } catch (error) {
            console.error('❌ Parsing error (alerts):', error);
          }
        });
      },
      onStompError: (error) => {
        console.error('❌ STOMP error:', error);
        this.connectionStatus.next(false);
        this.dashboardSubject.error(error);
      },
    });

    try {
      this.stompClient.activate();
      return this.dashboardSubject.asObservable();
    } catch (error) {
      console.error('❌ Failed to activate STOMP client:', error);
      this.connectionStatus.next(false);
      return throwError(() => new Error('Failed to establish WebSocket connection'));
    }
  }

  getAlerts(): Observable<ThresholdAlert> {
    return this.alertSubject.asObservable();
  }

  disconnect(): void {
    if (this.stompClient) {
      try {
        this.stompClient.deactivate();
        console.log('🔴 WebSocket connection closed');
      } catch (error) {
        console.error('❌ Error during WebSocket disconnection:', error);
      } finally {
        this.connectionStatus.next(false);
        this.stompClient = null;
      }
    }
  }

  send(destination: string, data: any): Observable<boolean> {
    if (this.stompClient && this.stompClient.connected) {
      try {
        this.stompClient.publish({
          destination: destination,
          body: JSON.stringify(data),
        });
        return of(true);
      } catch (error) {
        console.error('❌ Error sending message:', error);
        return throwError(() => new Error('Failed to send message'));
      }
    } else {
      console.error('❌ STOMP client not connected. Message not sent.');
      
      // Try to reconnect and then send
      return this.connectionStatus$.pipe(
        switchMap(isConnected => {
          if (isConnected) {
            this.stompClient?.publish({
              destination: destination,
              body: JSON.stringify(data),
            });
            return of(true);
          } else {
            this.connect();
            return throwError(() => new Error('Attempting to reconnect'));
          }
        }),
        retry(3),
        catchError(err => {
          console.error('❌ Failed to send message after reconnection attempts:', err);
          return throwError(() => new Error('Failed to send message after reconnection'));
        })
      );
    }
  }
}