package com.ecolyzer.ecolyzer_backend.service.impl;

import com.ecolyzer.ecolyzer_backend.model.Capteur;
import com.ecolyzer.ecolyzer_backend.model.Device;
import com.ecolyzer.ecolyzer_backend.model.SensorType;
import com.ecolyzer.ecolyzer_backend.repository.CapteurRepository;
import com.ecolyzer.ecolyzer_backend.repository.DeviceRepository;
import com.ecolyzer.ecolyzer_backend.service.CapteurService;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class CapteurServiceImpl implements CapteurService {

    private final CapteurRepository capteurRepository;
    private final DeviceRepository deviceRepository;

    public CapteurServiceImpl(CapteurRepository capteurRepository, DeviceRepository deviceRepository) {
        this.capteurRepository = capteurRepository;
        this.deviceRepository = deviceRepository;
    }

    @PostConstruct
    public void initializeCapteurs() {
        if (capteurRepository.count() == 0) {
            Device device = deviceRepository.findAll().stream().findFirst().orElse(null);

            if (device == null) {
                log.warn("❌ No devices found! Please create a device before initializing sensors.");
                return;
            }

            Capteur tempSensor = Capteur.builder()
                    .name("Temperature Sensor")
                    .type(SensorType.TEMPERATURE)
                    .device(device)
                    .build();

            Capteur energySensor = Capteur.builder()
                    .name("Energy Sensor")
                    .type(SensorType.ENERGY)
                    .device(device)
                    .build();

            Capteur humiditySensor = Capteur.builder()
                    .name("Humidity Sensor")
                    .type(SensorType.HUMIDITY)
                    .device(device)
                    .build();

            capteurRepository.saveAll(List.of(tempSensor, energySensor, humiditySensor));
            log.info("✅ Capteurs initialized and associated with device: {}", device.getName());
        }
    }


}
