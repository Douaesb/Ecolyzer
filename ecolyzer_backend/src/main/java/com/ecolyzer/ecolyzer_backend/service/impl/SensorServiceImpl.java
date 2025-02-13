package com.ecolyzer.ecolyzer_backend.service.impl;

import com.ecolyzer.ecolyzer_backend.model.Capteur;
import com.ecolyzer.ecolyzer_backend.repository.CapteurRepository;
import com.ecolyzer.ecolyzer_backend.service.SensorService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class SensorServiceImpl implements SensorService {

    private final CapteurRepository capteurRepository;

    public SensorServiceImpl(CapteurRepository capteurRepository) {
        this.capteurRepository = capteurRepository;
    }

    public String getRandomCapteurId() {
        List<Capteur> capteurs = capteurRepository.findAll();
        if (capteurs.isEmpty()) {
            throw new RuntimeException("No Capteurs found in the database!");
        }
        Random random = new Random();
        return capteurs.get(random.nextInt(capteurs.size())).getId();
    }
}
