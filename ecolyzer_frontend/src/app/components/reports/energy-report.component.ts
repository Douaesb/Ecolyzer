import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ArcElement, Chart, DoughnutController } from 'chart.js';

@Component({
  selector: 'app-energy-report',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
   <div class="bg-gray-50 p-6 min-h-screen">
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
    <h1 class="text-3xl font-bold text-gray-800">Rapport Énergétique</h1>
    <div class="bg-white rounded-lg shadow-sm">
      <select 
        (change)="changePeriod($event)" 
        class="border-0 rounded-lg px-4 py-2 bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
        <option value="day">Aujourd'hui</option>
        <option value="week">Cette semaine</option>
        <option value="month">Ce mois</option>
        <option value="year">Cette année</option>
      </select>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <mat-card class="col-span-1 lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
      <mat-card-header class="bg-gray-50 p-5 border-b">
        <mat-card-title class="text-xl font-semibold text-gray-800">Consommation Totale</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 text-center">
          <div class="flex flex-col items-center bg-green-50 rounded-lg p-6 transition-all hover:shadow-md">
            <span class="text-4xl font-bold text-green-600 mb-2">{{totalConsumption}} kWh</span>
            <span class="text-gray-600 font-medium">Consommation</span>
          </div>
          <div class="flex flex-col items-center bg-blue-50 rounded-lg p-6 transition-all hover:shadow-md">
            <span class="text-4xl font-bold text-blue-600 mb-2">{{costEstimate}} €</span>
            <span class="text-gray-600 font-medium">Coût Estimé</span>
          </div>
          <div class="flex flex-col items-center bg-red-50 rounded-lg p-6 transition-all hover:shadow-md">
            <span class="text-4xl font-bold text-red-600 mb-2">{{carbonFootprint}} kg</span>
            <span class="text-gray-600 font-medium">Empreinte CO2</span>
          </div>
        </div>
      </mat-card-content>
    </mat-card>

    <mat-card class="bg-white rounded-xl shadow-md overflow-hidden h-[400px]">
      <mat-card-header class="bg-gray-50 p-5 border-b">
        <mat-card-title class="text-xl font-semibold text-gray-800">Évolution de la Consommation</mat-card-title>
      </mat-card-header>
      <mat-card-content class="p-4">
        <canvas id="consumptionChart" class="h-[300px] w-full"></canvas>
      </mat-card-content>
    </mat-card>

    <mat-card class="bg-white rounded-xl shadow-md overflow-hidden h-[400px]">
      <mat-card-header class="bg-gray-50 p-5 border-b">
        <mat-card-title class="text-xl font-semibold text-gray-800">Distribution par Zone</mat-card-title>
      </mat-card-header>
      <mat-card-content class="p-4">
        <canvas id="distributionChart" class="h-[300px] w-full"></canvas>
      </mat-card-content>
    </mat-card>
  </div>
</div>
  `
})
export class EnergyReportComponent implements OnInit {
  totalConsumption = 1234;
  costEstimate = 567;
  carbonFootprint = 89;

  ngOnInit() {
    this.initCharts();
  }

  initCharts() {
    this.initConsumptionChart();
    this.initDistributionChart();
  }

  initConsumptionChart() {
    const ctx = document.getElementById('consumptionChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        datasets: [{
          label: 'Consommation (kWh)',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: '#4CAF50',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  initDistributionChart() {
    const ctx = document.getElementById('distributionChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Zone A', 'Zone B', 'Zone C'],
        datasets: [{
          data: [300, 200, 100],
          backgroundColor: ['#4CAF50', '#2196F3', '#FFC107']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  changePeriod(event: any) {
    // Implémenter le changement de période
  }
}