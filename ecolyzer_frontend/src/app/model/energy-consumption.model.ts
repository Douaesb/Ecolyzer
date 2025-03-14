export interface EnergyConsumption {
    id: string;
    device: { id: string, name: string };
    totalConsumption: number; 
    timestamp: string; 
  }
  
  export interface EnergyConsumptionSummary {
    id: string;
    device: { id: string, name: string };
    date: string; 
    totalEnergyConsumption: number;
    alertCount: number;
  }
  
  
  export interface EnergyConsumptionSummaryChart {
    id: string;
    deviceName: string;
    date: string; 
    totalEnergyConsumption: number;
    alertCount: number;
  }
  