package com.ecolyzer.ecolyzer_backend.dto.embedded;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class EnergyConsumptionSummaryDTO {
    private String id;
    private String deviceName;
    private LocalDate date;
    private double totalEnergyConsumption;
    private int alertCount;
}
