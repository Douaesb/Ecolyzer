import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EnergyDashboard } from '../model/EnergyDashboard';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

(window as any).global = window;

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private subject = new Subject<EnergyDashboard>();
  private stompClient: Client | null = null;

  constructor() {}

  connect(): Observable<EnergyDashboard> {
    if (this.stompClient) {
      this.disconnect();
    }

    const token = localStorage.getItem('auth_token');
    
    this.stompClient = new Client({
      webSocketFactory: () => {
        const ws = new SockJS('http://localhost:8080/dashboard-updates', null, {
          transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
        });
        ws.onopen = () => console.log('WebSocket opened');
        ws.onerror = (error) => console.error('WebSocket error:', error);
        ws.onclose = (event) => console.log('WebSocket closed:', event.code, event.reason);
        return ws;      },
      connectHeaders: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      debug: (str) => console.log(str),
      reconnectDelay: 10000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('WebSocket connection established via STOMP');
    
        this.stompClient?.subscribe('/topic/dashboard-updates', (message) => {
          try {
            const dashboardData: EnergyDashboard = JSON.parse(message.body);
            console.log('Received real-time data:', dashboardData);
            this.subject.next(dashboardData);
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        });
      },
      onStompError: (error) => {
        console.error('WebSocket connection error:', error);
        this.subject.error(error);
      },
    });

    this.stompClient.activate();  

    return this.subject.asObservable();
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate(); 
      console.log('WebSocket connection closed');
    }
  }

  send(destination: string, data: any): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: destination,
        body: JSON.stringify(data),
      });
    } else {
      console.error('STOMP client is not connected. Message not sent.');
    }
  }
}