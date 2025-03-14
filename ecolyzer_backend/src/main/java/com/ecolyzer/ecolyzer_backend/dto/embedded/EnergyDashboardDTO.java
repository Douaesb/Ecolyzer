package com.ecolyzer.ecolyzer_backend.dto.embedded;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EnergyDashboardDTO {
    private double totalConsumption;
    private double estimatedCost;
    private long activeAlerts;
    private double empreinteC02;
    private List<EnergyConsumptionSummaryDTO> consumptionSummaries;
    private List<ThresholdAlertEmbeddedDTO> thresholdAlerts;
    private List<DeviceEmbeddedDTO> devices;
}
