import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex h-screen bg-gray-50">
    
      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <div class="p-6">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">
          Tableau de bord énergétique
        </h1>
        <div class="mt-4 md:mt-0">
          <select
            class="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            (change)="onPeriodChange($event)"
          >
            <option value="day">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card bg-gradient-to-br from-primary-500 to-primary-600">
          <div class="text-white">
            <h3 class="text-lg font-semibold opacity-90">
              Consommation Totale
            </h3>
            <p class="text-3xl font-bold mt-2">2,547 kWh</p>
            <p class="text-sm mt-2 opacity-80">+12% vs hier</p>
          </div>
        </div>

        <div class="card bg-gradient-to-br from-secondary-500 to-secondary-600">
          <div class="text-white">
            <h3 class="text-lg font-semibold opacity-90">Coût Estimé</h3>
            <p class="text-3xl font-bold mt-2">384 €</p>
            <p class="text-sm mt-2 opacity-80">Budget: 500 €</p>
          </div>
        </div>

        <div class="card bg-gradient-to-br from-yellow-500 to-yellow-600">
          <div class="text-white">
            <h3 class="text-lg font-semibold opacity-90">Appareils Actifs</h3>
            <p class="text-3xl font-bold mt-2">24/30</p>
            <p class="text-sm mt-2 opacity-80">80% en fonction</p>
          </div>
        </div>

        <div class="card bg-gradient-to-br from-purple-500 to-purple-600">
          <div class="text-white">
            <h3 class="text-lg font-semibold opacity-90">Alertes</h3>
            <p class="text-3xl font-bold mt-2">3</p>
            <p class="text-sm mt-2 opacity-80">1 critique</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card" style="height: 350px;">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">
            Consommation d'énergie
          </h2>
          <canvas id="energyChart"></canvas>
        </div>

        <div class="card">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">
            État des appareils
          </h2>
          <div class="space-y-4">
            <div
              *ngFor="let device of devices"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div class="flex items-center space-x-4">
                <div
                  [class]="device.active ? 'bg-green-500' : 'bg-red-500'"
                  class="w-3 h-3 rounded-full"
                ></div>
                <span class="font-medium text-gray-700">{{ device.name }}</span>
              </div>
              <span
                [class]="device.active ? 'text-green-600' : 'text-red-600'"
                class="text-sm font-semibold"
              >
                {{ device.active ? 'Actif' : 'Inactif' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
      
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class DashboardComponent {
  private energyChart: Chart | null = null;

  devices = [
    { name: 'Capteur température Zone A', active: true },
    { name: 'Compteur électrique B1', active: true },
    { name: 'Thermostat intelligent C2', active: false },
    { name: 'Capteur présence D1', active: true },
  ];

  ngOnInit() {
    this.initEnergyChart();
  }

  ngOnDestroy() {
    this.destroyChart();
  }

  initEnergyChart() {
    const canvas = document.getElementById('energyChart') as HTMLCanvasElement;
    if (!canvas) return;
  
    this.destroyChart();
  
    canvas.height = 300; // Explicitly set height to prevent excessive stretching
  
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    this.energyChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [{
          label: 'Consommation (kWh)',
          data: [30, 45, 60, 70, 65, 40],
          borderColor: '#0ea5e9',
          backgroundColor: 'rgba(14, 165, 233, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Still needed for responsiveness
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.1)' }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }
  

  destroyChart() {
    if (this.energyChart) {
      this.energyChart.destroy(); // Properly dispose of the previous chart
      this.energyChart = null;
    }
  }
  onPeriodChange(event: any) {
    console.log('Period changed:', event.target.value);
    this.initEnergyChart(); // Optional: Reload the chart with new data
  }

 }
