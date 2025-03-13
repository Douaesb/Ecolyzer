  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { MatCardModule } from '@angular/material/card';
  import { ArcElement, Chart, DoughnutController } from 'chart.js';
  import { selectAllZones } from '../../state/zone/zone.selectors';
  import { selectAllDevices } from '../../state/device/device.selectors';
  import { Store } from '@ngrx/store';
  import { selectAllSummaries, selectCurrentConsumption, selectTotalPages } from '../../state/energy/energy-consumption.selectors';
  import { loadAllEnergySummaries, loadDailyEnergySummary } from '../../state/energy/energy-consumption.actions';
  import { loadZones } from '../../state/zone/zone.actions';
  import { loadDevices } from '../../state/device/device.actions';
  import { combineLatest, map, Subject, takeUntil } from 'rxjs';
import { selectDashboardData } from '../../state/dashboard/dashboard.selectors';
import { EnergyDashboard } from '../../model/EnergyDashboard';
import { loadDashboard } from '../../state/dashboard/dashboard.actions';

  @Component({
    selector: 'app-energy-report',
    standalone: true,
    imports: [CommonModule, MatCardModule],
    template: `
    <div class="bg-gray-50 p-6 min-h-screen">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <h1 class="text-3xl font-bold text-gray-800">Rapport Énergétique</h1>
      
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <mat-card class="col-span-1 lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
        <mat-card-header class="bg-gray-50 p-5 border-b">
          <mat-card-title class="text-xl font-semibold text-gray-800">Consommation Totale</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 text-center">
            <div class="flex flex-col items-center bg-green-50 rounded-lg p-6 transition-all hover:shadow-md">
              <span class="text-4xl font-bold text-green-600 mb-2">{{totalConsumption | number : "1.0-0"}} kWh</span>
              <span class="text-gray-600 font-medium">Consommation</span>
            </div>
            <div class="flex flex-col items-center bg-blue-50 rounded-lg p-6 transition-all hover:shadow-md">
              <span class="text-4xl font-bold text-blue-600 mb-2">{{estimatedCost | number : "1.0-0"}} €</span>
              <span class="text-gray-600 font-medium">Coût Estimé</span>
            </div>
            <div class="flex flex-col items-center bg-red-50 rounded-lg p-6 transition-all hover:shadow-md">
              <span class="text-4xl font-bold text-red-600 mb-2">{{empreinteC02| number : "1.0-0" }} kg</span>
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
  export class EnergyReportComponent {

    selectedPeriod = 'day';
    page = 0;
    size = 150;
  
    totalConsumption: number = 0;
    estimatedCost: number = 0;
    empreinteC02: number = 0;
    
    private consumptionChart: Chart | null = null;
    private distributionChartInstance: Chart<'doughnut'> | null = null;
    private unsubscribe$ = new Subject<void>();
  
    summaries$ = this.store.select(selectAllSummaries);
    totalPages$ = this.store.select(selectTotalPages);
  
    constructor(private store: Store) {}
  
    ngOnInit() {
      console.log('EnergyReportComponent Initialized');
      
      this.store.dispatch(loadZones({ page: 0, size: 10 }));
      this.store.dispatch(loadDevices({ page: 0, size: 10 }));
      this.loadSummaries();
  this.store.dispatch(loadDashboard({ period: this.selectedPeriod }));
      this.store.select(selectCurrentConsumption)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(data => {
          console.log('selectCurrentConsumption Data:', data);
          this.totalConsumption = data?.totalConsumption || 0;
        });  
  
      this.summaries$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(summaries => {
          console.log('Energy Summaries:', summaries);
          this.updateCharts(summaries);
        });

        this.store
        .select(selectDashboardData)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((dashboard: EnergyDashboard | null) => {
          if (dashboard) {
            this.totalConsumption = dashboard.totalConsumption || 0;
            this.estimatedCost = dashboard.estimatedCost || 0;
            this.empreinteC02 = dashboard.empreinteC02 || 0;
          }
        });    
    }
  
    ngOnDestroy() {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
  
    loadSummaries() {
      console.log('Dispatching loadAllEnergySummaries action...');
      this.store.dispatch(loadAllEnergySummaries({ page: this.page, size: this.size }));
    }
  
    nextPage() {
      this.totalPages$.pipe(takeUntil(this.unsubscribe$)).subscribe(totalPages => {
        if (this.page < totalPages - 1) {
          this.page++;
          this.loadSummaries();
        }
      });
    }
  
    prevPage() {
      if (this.page > 0) {
        this.page--;
        this.loadSummaries();
      }
    }
  
    updateCharts(summaries: any[]) {
      this.updateConsumptionChart(summaries);
      this.updateDistributionChart(summaries);
    }
  
    updateConsumptionChart(summaries: any[]) {
      console.log('Updating Consumption Chart...');
  
      const { labels, data } = this.aggregateDailyConsumption(summaries);
      
      if (!this.consumptionChart) {
        const ctx = document.getElementById('consumptionChart') as HTMLCanvasElement;
        if (!ctx) {
          console.error('Chart element not found!');
          return;
        }
  
        this.consumptionChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Total Energy Consumption (kWh)',
              data,
              fill: false,
              borderColor: '#4CAF50',
              tension: 0.1
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      } else {
        this.consumptionChart.data.labels = labels;
        this.consumptionChart.data.datasets[0].data = data;
        this.consumptionChart.update();
      }
    }
  
    updateDistributionChart(summaries: any[]) {
      console.log('Updating Distribution Chart...');
      
      combineLatest([
        this.store.select(selectAllZones),
        this.store.select(selectAllDevices)
      ])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([zones, devices]) => {
        const zoneEnergyMap: { [zone: string]: number } = {};
  
        zones.forEach(zone => {
          const devicesInZone = devices.filter(device => device.zoneId === zone.id);
          const totalZoneConsumption = devicesInZone.reduce((sum, device) => {
            const deviceEnergy = summaries.find(summary => summary.device && summary.device.id === device.id);
            return sum + (deviceEnergy ? deviceEnergy.totalEnergyConsumption : 0);
          }, 0);
  
          zoneEnergyMap[zone.name] = totalZoneConsumption;
        });
  
        if (!this.distributionChartInstance) {
          const canvas = document.getElementById('distributionChart') as HTMLCanvasElement;
          if (!canvas) {
            console.error('Doughnut Chart element not found!');
            return;
          }
  
          this.distributionChartInstance = new Chart<'doughnut'>(canvas, {
            type: 'doughnut',
            data: {
              labels: Object.keys(zoneEnergyMap),
              datasets: [{
                data: Object.values(zoneEnergyMap),
                backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#FF5722', '#9C27B0', '#607D8B'],
              }]
            },
            options: { responsive: true, maintainAspectRatio: false }
          });
        } else {
          this.distributionChartInstance.data.labels = Object.keys(zoneEnergyMap);
          this.distributionChartInstance.data.datasets[0].data = Object.values(zoneEnergyMap);
          this.distributionChartInstance.update();
        }
      });
    }
  
    aggregateDailyConsumption(summaries: any[]): { labels: string[], data: number[] } {
      const dailyAggregation: { [date: string]: number } = {};
  
      summaries.forEach(summary => {
        const dateKey = new Date(summary.date).toISOString().split('T')[0];
        dailyAggregation[dateKey] = (dailyAggregation[dateKey] || 0) + summary.totalEnergyConsumption;
      });
  
      const sortedDates = Object.keys(dailyAggregation).sort();
      return {
        labels: sortedDates.map(date => new Date(date).toLocaleDateString()),
        data: sortedDates.map(date => dailyAggregation[date])
      };
    }
  }