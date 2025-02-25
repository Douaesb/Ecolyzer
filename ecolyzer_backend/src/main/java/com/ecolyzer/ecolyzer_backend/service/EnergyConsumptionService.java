package com.ecolyzer.ecolyzer_backend.service;

import com.ecolyzer.ecolyzer_backend.model.EnergyConsumption;
import com.ecolyzer.ecolyzer_backend.model.EnergyConsumptionSummary;
import com.ecolyzer.ecolyzer_backend.model.SensorData;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EnergyConsumptionService {
    void updateEnergyConsumption(SensorData sensorData);
    Optional<EnergyConsumption> getCurrentEnergyConsumption(String deviceId);

    Optional<EnergyConsumptionSummary> getEnergySummaryByDeviceAndDate(String deviceId, LocalDate date);
    List<EnergyConsumptionSummary> getAllEnergySummaries();

    Optional<EnergyConsumptionSummary> getEnergySummaryByZone(String zoneName, LocalDate date, Pageable pageable);
}
