package com.ecolyzer.ecolyzer_backend.service.impl;

import com.ecolyzer.ecolyzer_backend.model.Capteur;
import com.ecolyzer.ecolyzer_backend.model.EnergyConsumption;
import com.ecolyzer.ecolyzer_backend.model.SensorData;
import com.ecolyzer.ecolyzer_backend.repository.CapteurRepository;
import com.ecolyzer.ecolyzer_backend.repository.EnergyConsumptionRepository;
import com.ecolyzer.ecolyzer_backend.service.EnergyConsumptionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EnergyConsumptionServiceImpl implements EnergyConsumptionService {
    private final EnergyConsumptionRepository repository;
    private final CapteurRepository capteurRepository;

    public EnergyConsumptionServiceImpl(EnergyConsumptionRepository repository, CapteurRepository capteurRepository) {
        this.repository = repository;
        this.capteurRepository = capteurRepository;
    }

    public void updateEnergyConsumption(SensorData sensorData) {
        if (!"energy".equalsIgnoreCase(sensorData.getType().name())) return;

        Capteur capteur = capteurRepository.findById(sensorData.getCapteur().getId()).orElse(null);
        if (capteur == null || capteur.getDevice() == null) {
            log.warn("Capteur or Device not found for SensorData: {}", sensorData.getId());
            return;
        }

        EnergyConsumption consumption = repository.findByDeviceId(capteur.getDevice().getId())
                .orElse(new EnergyConsumption(null, capteur.getDevice(), 0.0));

        consumption.addConsumption(sensorData.getValue());
        repository.save(consumption);
    }

}
