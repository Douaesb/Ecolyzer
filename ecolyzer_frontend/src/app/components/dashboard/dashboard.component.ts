import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { EnergyDashboard } from '../../model/EnergyDashboard';
import { loadDashboard } from '../../state/dashboard/dashboard.actions';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart } from 'chart.js';
import { selectDashboardData, selectDashboardError, selectDashboardLoading } from '../../state/dashboard/dashboard.selectors';
import { DashboardService } from '../../services/dashboard.service';
import { WebSocketService } from '../../services/WebSocket.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboardData$: Observable<EnergyDashboard | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  dashboard!: EnergyDashboard;
  
  private energyChart: Chart | null = null;
  private wsSubscription: Subscription | null = null;
  private storeSubscription: Subscription | null = null;
  
  deviceCount = 0;
  alertCount = 0;
  
  chartInitialized = false;

  constructor(
    private store: Store,
    private webSocketService: WebSocketService,
    private dashboardService: DashboardService
  ) {
    this.dashboardData$ = this.store.select(selectDashboardData);
    this.loading$ = this.store.select(selectDashboardLoading);
    this.error$ = this.store.select(selectDashboardError);
  }

  ngOnInit() {
    this.store.dispatch(loadDashboard({ period: 'day' }));
    
    this.storeSubscription = this.dashboardData$.subscribe(data => {
      if (data) {
        this.dashboard = this.ensureDataIntegrity(data);
        this.updateCounters(this.dashboard);
        
        if (this.dashboard.consumptionSummaries && this.dashboard.consumptionSummaries.length > 0) {
          this.updateEnergyChart(this.dashboard);
        }
      }
    });
    
    this.wsSubscription = this.webSocketService.connect().subscribe({
      next: (data: any) => {
        console.log('Received WebSocket update:', data);
        
        if (data && typeof data === 'object') {
          const updatedDashboard = this.ensureDataIntegrity(data);
          
          if (this.hasSignificantChanges(this.dashboard, updatedDashboard)) {
            this.dashboard = updatedDashboard;
            this.updateCounters(this.dashboard);
            
            if (this.dashboard.consumptionSummaries && this.dashboard.consumptionSummaries.length > 0) {
              this.updateEnergyChart(this.dashboard);
            }
          }
        }
      },
      error: (error) => {
        console.error('WebSocket error:', error);
      }
    });
  }

  ngOnDestroy() {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
    
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
    
    this.webSocketService.disconnect();
    this.destroyChart();
  }
  
  private hasSignificantChanges(oldData: EnergyDashboard, newData: EnergyDashboard): boolean {
    if (!oldData) return true;
        if (oldData.consumptionSummaries?.length !== newData.consumptionSummaries?.length) {
      return true;
    }
    
    for (let i = 0; i < (newData.consumptionSummaries?.length || 0); i++) {
      if (oldData.consumptionSummaries?.[i]?.totalEnergyConsumption !== 
          newData.consumptionSummaries?.[i]?.totalEnergyConsumption) {
        return true;
      }
    }
    
    if (oldData.totalConsumption !== newData.totalConsumption) {
      return true;
    }
    
    return false;
  }
  
  private ensureDataIntegrity(data: any): EnergyDashboard {
    const consumptionSummaries = Array.isArray(data.consumptionSummaries) 
    ? data.consumptionSummaries.map((summary: any) => ({
        deviceName: summary?.deviceName || 'Unknown Device',
        date: this.ensureValidDate(summary?.date),
        totalEnergyConsumption: Number(summary?.totalEnergyConsumption || 0),
        alertCount: Number(summary?.alertCount || 0)
      }))
    : [];
      
    consumptionSummaries.sort((a: any, b: any) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });
    
    return {
      ...data,
      totalConsumption: Number(data.totalConsumption || 0),
      estimatedCost: Number(data.estimatedCost || 0),
      empreinteC02: Number(data.empreinteC02 || 0),
      activeAlerts: Number(data.activeAlerts || 0),
      consumptionSummaries: consumptionSummaries,
      devices: Array.isArray(data.devices) ? data.devices : [],
      thresholdAlerts: Array.isArray(data.thresholdAlerts) ? data.thresholdAlerts : []
    };
  }
  
  private ensureValidDate(dateValue: any): string {
    if (!dateValue) {
      return new Date().toISOString();
    }
    
    try {
      if (dateValue instanceof Date) {
        return dateValue.toISOString();
      }
      
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    } catch (e) {
      console.warn('Invalid date encountered:', dateValue);
    }
    
    return new Date().toISOString();
  }
  
  hasAlertCountProperty(): boolean {
    if (!this.dashboard?.consumptionSummaries || this.dashboard.consumptionSummaries.length === 0) {
      return false;
    }
    return 'alertCount' in this.dashboard.consumptionSummaries[0];
  }
  
  updateCounters(data: EnergyDashboard) {
    this.deviceCount = data.devices?.length || 0;
    this.alertCount = data.thresholdAlerts?.length || 0;
  }

  updateEnergyChart(data: EnergyDashboard) {
    if (!data.consumptionSummaries || data.consumptionSummaries.length === 0) {
      console.warn('No energy consumption data to display on the chart.');
      return;
    }
  
    setTimeout(() => {
      const canvas = document.getElementById('energyChart') as HTMLCanvasElement;
      if (!canvas) {
        console.error('Energy chart canvas not found');
        return;
      }
  
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Could not get 2D context for energy chart');
        return;
      }
  
      const sortedSummaries = [...data.consumptionSummaries].sort(
        (a, b) => a.totalEnergyConsumption - b.totalEnergyConsumption
      );
  
      const labels = sortedSummaries.map(summary => summary.deviceName);
  
      const consumptionData = sortedSummaries.map(summary => 
        Math.max(0, Number(summary.totalEnergyConsumption) || 0)
      );
  
      if (this.energyChart) {
        this.energyChart.destroy();
        this.energyChart = null;
      }
  
      this.energyChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Consommation (kWh)',
              data: consumptionData,
              borderColor: '#0ea5e9',
              backgroundColor: 'rgba(14, 165, 233, 0.5)',
              
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  const summary = sortedSummaries[context.dataIndex];
                  const value = context.raw as number;
                  const date = new Date(summary.date).toLocaleString();
                  return [`Consommation: ${value.toFixed(2)} kWh`, `Date: ${date}`];
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(0, 0, 0, 0.1)' },
              ticks: {
                callback: function (value) {
                  return value + ' kWh';
                }
              }
            },
            x: {
              grid: { display: false },
              ticks: {
                maxRotation: 45,
                minRotation: 45
              }
            },
          },
        },
      });
  
      this.chartInitialized = true;
    }, 0); 
  }
  
  

  onPeriodChange(event: any) {
    const period = event.target.value;
    this.store.dispatch(loadDashboard({ period }));
    
    this.chartInitialized = false;
    this.destroyChart();
  }

  destroyChart() {
    if (this.energyChart) {
      this.energyChart.destroy();
      this.energyChart = null;
    }
  }
}