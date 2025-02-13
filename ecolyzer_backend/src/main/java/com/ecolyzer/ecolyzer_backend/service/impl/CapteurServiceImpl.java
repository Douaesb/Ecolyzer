package com.ecolyzer.ecolyzer_backend.service.impl;

import com.ecolyzer.ecolyzer_backend.model.Capteur;
import com.ecolyzer.ecolyzer_backend.model.SensorType;
import com.ecolyzer.ecolyzer_backend.repository.CapteurRepository;
import com.ecolyzer.ecolyzer_backend.service.CapteurService;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class CapteurServiceImpl implements CapteurService {

    private final CapteurRepository capteurRepository;

    public CapteurServiceImpl(CapteurRepository capteurRepository) {
        this.capteurRepository = capteurRepository;
    }

    @PostConstruct
    public void initializeCapteurs() {
        if (capteurRepository.count() == 0) {
            Capteur tempSensor = Capteur.builder()
                    .name("Temperature Sensor")
                    .type(SensorType.TEMPERATURE)
                    .build();

            Capteur energySensor = Capteur.builder()
                    .name("Energy Sensor")
                    .type(SensorType.ENERGY)
                    .build();

            Capteur humiditySensor = Capteur.builder()
                    .name("Energy Sensor")
                    .type(SensorType.HUMIDITY)
                    .build();

            capteurRepository.saveAll(List.of(tempSensor, energySensor, humiditySensor));
            System.out.println("✅ Capteurs initialized in MongoDB!");
        }
    }

}
