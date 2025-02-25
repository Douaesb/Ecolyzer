package com.ecolyzer.ecolyzer_backend.repository;

import com.ecolyzer.ecolyzer_backend.model.Device;
import com.ecolyzer.ecolyzer_backend.model.EnergyConsumptionSummary;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EnergySummaryRepository extends MongoRepository<EnergyConsumptionSummary, String> {
    Optional<EnergyConsumptionSummary> findByDeviceIdAndDate(String deviceId, LocalDate date);
    List<EnergyConsumptionSummary> findByDeviceInAndDate(List<Device> devices, LocalDate date);

}
