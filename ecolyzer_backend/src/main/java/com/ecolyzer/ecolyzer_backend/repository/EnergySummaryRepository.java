package com.ecolyzer.ecolyzer_backend.repository;

import com.ecolyzer.ecolyzer_backend.model.EnergyConsumptionSummary;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EnergySummaryRepository extends MongoRepository<EnergyConsumptionSummary, String> {
}
