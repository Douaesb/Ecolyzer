package com.ecolyzer.ecolyzer_backend.repository;

import com.ecolyzer.ecolyzer_backend.model.Capteur;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CapteurRepository extends MongoRepository<Capteur, String> {
}
