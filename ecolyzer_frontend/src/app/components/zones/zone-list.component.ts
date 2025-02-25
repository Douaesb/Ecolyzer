import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-zone-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="container mx-auto p-4 sm:p-6">
      <!-- Header with title & button -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">Gestion des Zones</h1>
          <p class="text-sm text-gray-600 mt-1">Gérez vos différentes zones et leurs statistiques</p>
        </div>
        <button 
          class="mt-4 sm:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center"
          (click)="addZone()">
          <span class="material-icons text-lg mr-2">add</span>
          Nouvelle Zone
        </button>
      </div>

      <!-- Responsive Grid Layout -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div *ngFor="let zone of zones" class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <!-- Zone Header -->
          <div class="p-5 border-b">
            <div class="flex items-center">
              <span class="material-icons text-indigo-500 mr-3">location_on</span>
              <div>
                <h2 class="text-xl font-semibold text-gray-800">{{zone.name}}</h2>
                <p class="text-sm text-gray-500">{{zone.deviceCount}} appareils</p>
              </div>
            </div>
          </div>
          
          <!-- Zone Stats -->
          <div class="p-5">
            <div class="grid grid-cols-2 gap-4">
              <!-- Consumption -->
              <div class="bg-blue-50 rounded-lg p-4">
                <p class="text-sm text-gray-600 mb-1">Consommation</p>
                <p class="text-xl font-bold text-blue-600">{{zone.consumption}} kWh</p>
              </div>
              
              <!-- Temperature -->
              <div class="bg-red-50 rounded-lg p-4">
                <p class="text-sm text-gray-600 mb-1">Température</p>
                <p class="text-xl font-bold text-red-500">{{zone.temperature}}°C</p>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="flex justify-between items-center px-5 py-3 bg-gray-50 rounded-b-lg">
            <span class="text-xs text-gray-500">Dernière mise à jour: Aujourd'hui</span>
            <div class="flex space-x-2">
              <button 
                class="w-8 h-8 flex items-center justify-center rounded-md bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                (click)="editZone(zone)">
                <span class="material-icons" style="font-size: 18px">edit</span>
              </button>
              <button 
                class="w-8 h-8 flex items-center justify-center rounded-md bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                (click)="deleteZone(zone)">
                <span class="material-icons" style="font-size: 18px">delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty state when no zones -->
      <div *ngIf="zones.length === 0" class="bg-white rounded-lg p-8 text-center shadow-md">
        <span class="material-icons text-gray-400 text-5xl mb-4">domain_disabled</span>
        <h2 class="text-xl font-semibold text-gray-700 mb-2">Pas de zones configurées</h2>
        <p class="text-gray-500 mb-6">Commencez par créer une nouvelle zone pour voir ses statistiques</p>
        <button 
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center mx-auto"
          (click)="addZone()">
          <span class="material-icons mr-2">add</span>
          Ajouter une zone
        </button>
      </div>
    </div>
  `,
  styles: [`
    /* Import Material Icons font */
    @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
  `]
})
export class ZoneListComponent implements OnInit {
  zones = [
    { id: 1, name: 'Zone A', deviceCount: 5, consumption: 250, temperature: 22 },
    { id: 2, name: 'Zone B', deviceCount: 3, consumption: 180, temperature: 24 }
  ];

  ngOnInit() {}

  addZone() {}

  editZone(zone: any) {}

  deleteZone(zone: any) {}
}