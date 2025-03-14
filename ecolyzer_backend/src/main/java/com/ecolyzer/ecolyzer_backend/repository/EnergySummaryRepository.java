package com.ecolyzer.ecolyzer_backend.repository;

import com.ecolyzer.ecolyzer_backend.model.Device;
import com.ecolyzer.ecolyzer_backend.model.EnergyConsumptionSummary;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EnergySummaryRepository extends MongoRepository<EnergyConsumptionSummary, String> {
    Optional<EnergyConsumptionSummary> findByDeviceIdAndDate(String deviceId, LocalDate date);
    @Query(value = "{ 'device.id': ?0, 'date': ?1 }", sort = "{ '_id': -1 }")
    Optional<EnergyConsumptionSummary> findLatestByDeviceIdAndDate(String deviceId, LocalDate date);
    boolean existsByDeviceIdAndDate(String deviceId, LocalDate date);

    List<EnergyConsumptionSummary> findByDeviceInAndDate(List<Device> devices, LocalDate date);
    List<EnergyConsumptionSummary> findByDateGreaterThanEqual(LocalDate date);

}
