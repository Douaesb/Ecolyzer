import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [CommonModule, FormsModule,  MatIconModule],
  template: `
    <div class="p-6">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Gestion des Appareils</h1>
        <button class="btn-primary mt-4 md:mt-0 flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          <span>Ajouter un appareil</span>
        </button>
      </div>
      

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="relative">
          <input 
            type="text" 
            placeholder="Rechercher un appareil..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            (input)="applyFilter($event)">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-3" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </div>

        <select 
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          (change)="filterByZone($event)">
          <option value="">Toutes les zones</option>
          <option *ngFor="let zone of zones" [value]="zone.id">{{zone.name}}</option>
        </select>

        <select 
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div *ngFor="let device of devices" class="card hover:transform hover:scale-105 transition-all duration-300">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">{{device.name}}</h3>
              <p class="text-sm text-gray-500">{{device.serialNumber}}</p>
            </div>
            <span [class]="device.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="px-3 py-1 rounded-full text-sm font-medium">
              {{device.status === 'active' ? 'Actif' : 'Inactif'}}
            </span>
          </div>

          <div class="space-y-2 mb-6">
            <div class="flex items-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              <span>{{device.zone}}</span>
            </div>
            <div class="flex items-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 7H7v6h6V7z" />
                <path fill-rule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clip-rule="evenodd" />
              </svg>
              <span>Dernière activité: Aujourd'hui 14:30</span>
            </div>
          </div>

          <div class="flex justify-end space-x-2">
          <button 
                class="w-8 h-8 flex items-center justify-center rounded-md bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                (click)="editDevice(device)">
                <span class="material-icons" style="font-size: 18px">edit</span>
              </button>
              <button 
                class="w-8 h-8 flex items-center justify-center rounded-md bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                (click)="deleteDevice(device)">
                <span class="material-icons" style="font-size: 18px">delete</span>
                
              </button>
          
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Import Material Icons font */
    @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
  `]
})
export class DeviceListComponent implements OnInit {
  devices = [
    { id: 1, name: 'Capteur Température 1', serialNumber: 'TEMP001', zone: 'Zone A', status: 'active' },
    { id: 2, name: 'Compteur Électrique 1', serialNumber: 'ELEC001', zone: 'Zone B', status: 'inactive' },
    { id: 3, name: 'Thermostat Zone C', serialNumber: 'THERM001', zone: 'Zone C', status: 'active' },
    { id: 4, name: 'Capteur Humidité 1', serialNumber: 'HUM001', zone: 'Zone A', status: 'active' },
    { id: 5, name: 'Détecteur Présence 1', serialNumber: 'PRES001', zone: 'Zone B', status: 'inactive' }
  ];

  zones = [
    { id: 1, name: 'Zone A' },
    { id: 2, name: 'Zone B' },
    { id: 3, name: 'Zone C' }
  ];

  ngOnInit() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // Implement filtering logic
  }

  filterByZone(event: any) {
    // Implement zone filtering
  }

  editDevice(device: any) {
    // Implement edit logic
  }

  deleteDevice(device: any) {
    // Implement delete logic
  }
}