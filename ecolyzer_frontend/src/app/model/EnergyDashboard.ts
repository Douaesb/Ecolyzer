import { Device } from "./device.model";
import { EnergyConsumptionSummaryChart } from "./energy-consumption.model";
import { ThresholdAlert } from "./threshold-alert.model";

export interface EnergyDashboard {
    totalConsumption: number;
    estimatedCost: number;
    activeAlerts: number;
    empreinteC02: number;
    consumptionSummaries: EnergyConsumptionSummaryChart[];
    thresholdAlerts: ThresholdAlert[];
    devices: Device[];
  }
  