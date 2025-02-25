import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Alertes et Notifications</h1>
        <div class="flex space-x-2 mt-4 md:mt-0">
          <button 
            *ngFor="let filter of filters"
            [class]="filter.active ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'"
            class="px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-primary-500 hover:text-white"
            (click)="toggleFilter(filter)">
            {{filter.label}}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div *ngFor="let alert of alerts" 
             [class]="'card border-l-4 ' + getSeverityClass(alert.severity)">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div [class]="'p-2 rounded-full ' + getSeverityBgClass(alert.severity)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-800">{{alert.title}}</h3>
                <p class="text-sm text-gray-500">{{alert.timestamp | date:'medium'}}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button class="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </button>
            </div>
          </div>

          <p class="text-gray-600 mb-4">{{alert.description}}</p>

          <div class="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              {{alert.location}}
            </div>
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
              </svg>
              {{alert.device}}
            </div>
          </div>

          <div class="flex justify-end space-x-2">
            <button class="btn-secondary" (click)="acknowledgeAlert(alert)">
              Acquitter
            </button>
            <button class="btn-primary" (click)="viewDetails(alert)">
              Détails
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AlertListComponent implements OnInit {
  filters = [
    { label: 'Toutes', value: 'all', active: true },
    { label: 'Critiques', value: 'high', active: false },
    { label: 'Moyennes', value: 'medium', active: false },
    { label: 'Faibles', value: 'low', active: false }
  ];

  alerts = [
    {
      id: 1,
      title: 'Consommation Anormale Détectée',
      description: 'Pic de consommation inhabituel détecté dans la Zone A',
      severity: 'high',
      timestamp: new Date(),
      location: 'Zone A',
      device: 'Compteur Principal'
    },
    {
      id: 2,
      title: 'Maintenance Préventive',
      description: 'Le capteur de température nécessite une calibration',
      severity: 'medium',
      timestamp: new Date(),
      location: 'Zone B',
      device: 'Capteur Temp-01'
    },
    {
      id: 3,
      title: 'Objectif Atteint',
      description: 'La Zone C a atteint son objectif de réduction',
      severity: 'low',
      timestamp: new Date(),
      location: 'Zone C',
      device: 'Système Global'
    }
  ];

  getSeverityClass(severity: string): string {
    const classes = {
      high: 'border-red-500',
      medium: 'border-yellow-500',
      low: 'border-green-500'
    };
    return classes[severity as keyof typeof classes] || '';
  }

  getSeverityBgClass(severity: string): string {
    const classes = {
      high: 'bg-red-100 text-red-600',
      medium: 'bg-yellow-100 text-yellow-600',
      low: 'bg-green-100 text-green-600'
    };
    return classes[severity as keyof typeof classes] || '';
  }

  toggleFilter(filter: any) {
    this.filters.forEach(f => f.active = false);
    filter.active = true;
    // Implement filtering logic
  }

  acknowledgeAlert(alert: any) {
    // Implement acknowledge logic
  }

  viewDetails(alert: any) {
    // Implement view details logic
  }

  ngOnInit() {}
}