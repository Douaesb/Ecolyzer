package com.ecolyzer.ecolyzer_backend.service.impl;

import com.ecolyzer.ecolyzer_backend.model.Capteur;
import com.ecolyzer.ecolyzer_backend.repository.CapteurRepository;
import com.ecolyzer.ecolyzer_backend.service.SensorService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@Slf4j
public class SensorServiceImpl implements SensorService {

    private final CapteurRepository capteurRepository;

    public SensorServiceImpl(CapteurRepository capteurRepository) {
        this.capteurRepository = capteurRepository;
    }

    public Optional<String> getRandomCapteurId() {
        List<Capteur> capteurs = capteurRepository.findAll();

        if (capteurs.isEmpty()) {
            log.warn("⚠️ No Capteurs found in the database!");
            return Optional.empty(); // Return an empty Optional instead of throwing an exception
        }

        Random random = new Random();
        return Optional.of(capteurs.get(random.nextInt(capteurs.size())).getId());
    }
}
