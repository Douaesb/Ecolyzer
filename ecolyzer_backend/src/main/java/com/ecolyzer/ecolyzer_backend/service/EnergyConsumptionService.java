package com.ecolyzer.ecolyzer_backend.service;

import com.ecolyzer.ecolyzer_backend.model.SensorData;

public interface EnergyConsumptionService {
    void updateEnergyConsumption(SensorData sensorData);
}
